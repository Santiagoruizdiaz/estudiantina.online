<?php
/**
 * API REST de Foro de Debate - Estudiantina de Posadas
 * estudiantina.online - Backend Hostinger con SQLite
 */

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Cache-Control: no-cache, no-store, must-revalidate");

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method === "OPTIONS") {
    http_response_code(200);
    exit;
}

$dbPath = __DIR__ . "/../data/foro.db";
$dbDir = dirname($dbPath);
if (!is_dir($dbDir)) {
    @mkdir($dbDir, 0755, true);
}

try {
    $pdo = new PDO("sqlite:" . $dbPath, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    // Habilitar Write-Ahead Logging, caché en RAM y parámetros de alto rendimiento
    $pdo->exec("PRAGMA journal_mode = WAL;");
    $pdo->exec("PRAGMA synchronous = NORMAL;");
    $pdo->exec("PRAGMA cache_size = -64000;");
    $pdo->exec("PRAGMA busy_timeout = 5000;");
    $pdo->exec("PRAGMA foreign_keys = ON;");
    $pdo->exec("PRAGMA temp_store = MEMORY;");
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error de base de datos: " . $e->getMessage()]);
    exit;
}

// Inicialización de Tablas si no existen
$pdo->exec("
CREATE TABLE IF NOT EXISTS usuarios (
    google_id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    colegio_id TEXT DEFAULT 'janssen',
    rol TEXT DEFAULT 'usuario',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS canales (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    icono TEXT,
    color TEXT
);

CREATE TABLE IF NOT EXISTS hilos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    canal_id TEXT NOT NULL,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    autor_google_id TEXT NOT NULL,
    autor_nombre TEXT NOT NULL,
    autor_avatar TEXT,
    colegio_id TEXT DEFAULT 'janssen',
    votos INTEGER DEFAULT 0,
    respuestas_count INTEGER DEFAULT 0,
    fijado INTEGER DEFAULT 0,
    reportes INTEGER DEFAULT 0,
    oculto INTEGER DEFAULT 0,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hilo_id INTEGER NOT NULL,
    contenido TEXT NOT NULL,
    autor_google_id TEXT NOT NULL,
    autor_nombre TEXT NOT NULL,
    autor_avatar TEXT,
    colegio_id TEXT DEFAULT 'janssen',
    parent_id INTEGER DEFAULT NULL,
    votos INTEGER DEFAULT 0,
    reportes INTEGER DEFAULT 0,
    oculto INTEGER DEFAULT 0,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS votos (
    item_tipo TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    google_id TEXT NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(item_tipo, item_id, google_id)
);

CREATE TABLE IF NOT EXISTS reportes (
    item_tipo TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    reporter_google_id TEXT NOT NULL,
    motivo TEXT DEFAULT '',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(item_tipo, item_id, reporter_google_id)
);

CREATE INDEX IF NOT EXISTS idx_hilos_canal ON hilos(canal_id);
CREATE INDEX IF NOT EXISTS idx_hilos_creado ON hilos(creado_en);
CREATE INDEX IF NOT EXISTS idx_hilos_votos ON hilos(votos);
CREATE INDEX IF NOT EXISTS idx_comentarios_hilo ON comentarios(hilo_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_parent ON comentarios(parent_id);
CREATE INDEX IF NOT EXISTS idx_votos_item ON votos(item_tipo, item_id, google_id);
CREATE INDEX IF NOT EXISTS idx_reportes_item ON reportes(item_tipo, item_id);
CREATE INDEX IF NOT EXISTS idx_hilos_canal_compuesto ON hilos(canal_id, oculto, fijado, creado_en);
CREATE INDEX IF NOT EXISTS idx_comentarios_hilo_compuesto ON comentarios(hilo_id, oculto, creado_en);
CREATE INDEX IF NOT EXISTS idx_hilos_colegio_compuesto ON hilos(colegio_id, oculto);
");

try { $pdo->exec("ALTER TABLE hilos ADD COLUMN noticia_id TEXT;"); } catch (Exception $e) {}
try { $pdo->exec("CREATE INDEX IF NOT EXISTS idx_hilos_noticia ON hilos(noticia_id);"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE comentarios ADD COLUMN parent_id INTEGER DEFAULT NULL;"); } catch (Exception $e) {}
try { $pdo->exec("CREATE INDEX IF NOT EXISTS idx_comentarios_parent ON comentarios(parent_id);"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN estado TEXT DEFAULT 'activo';"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN motivo_sancion TEXT;"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN sancionado_hasta DATETIME;"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN sancionado_por TEXT;"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN sancionado_en DATETIME;"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN bio TEXT DEFAULT '';"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN rol_estudiantil TEXT DEFAULT 'Hincha de Tribuna';"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN ano_escolar TEXT DEFAULT 'Secundaria';"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN instagram TEXT DEFAULT '';"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN avatar_personalizado TEXT DEFAULT '';"); } catch (Exception $e) {}
try { $pdo->exec("ALTER TABLE usuarios ADD COLUMN username TEXT DEFAULT '';"); } catch (Exception $e) {}
try { $pdo->exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(LOWER(username)) WHERE username != '' AND username IS NOT NULL;"); } catch (Exception $e) {}

const RESERVED_USERNAMES = [
    "admin", "administrador", "moderador", "mod", "sistema",
    "estudiantina", "staff", "soporte", "oficial", "posadas", "redaccion"
];

function validatePhpUsername(string $rawUsername): array {
    $username = strtolower(trim($rawUsername));
    if (empty($username)) {
        return ["valid" => false, "message" => "El nombre de usuario es obligatorio"];
    }
    if (!preg_match('/^[a-z0-9_]{3,20}$/', $username)) {
        return ["valid" => false, "message" => "El usuario debe tener entre 3 y 20 caracteres y solo letras, números o guión bajo (_)."];
    }
    if (in_array($username, RESERVED_USERNAMES, true)) {
        return ["valid" => false, "message" => "Ese nombre de usuario está reservado."];
    }
    return ["valid" => true, "username" => $username];
}

function checkPhpUserSanction($pdo, $googleId) {
    if (empty($googleId)) return null;
    try {
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE google_id = ?");
        $stmt->execute([$googleId]);
        $user = $stmt->fetch();
        if (!$user) return null;

        if ($user["estado"] === "baneado") {
            return [
                "bloqueado" => true,
                "tipo" => "baneo",
                "mensaje" => "Tu cuenta ha sido baneada permanentemente del foro. Motivo: " . ($user["motivo_sancion"] ?: "Infracción a las normas de convivencia.")
            ];
        }

        if ($user["estado"] === "suspendido") {
            if (!empty($user["sancionado_hasta"])) {
                $hastaTime = strtotime($user["sancionado_hasta"]);
                if ($hastaTime > time()) {
                    return [
                        "bloqueado" => true,
                        "tipo" => "suspension",
                        "hasta" => $user["sancionado_hasta"],
                        "mensaje" => "Tu cuenta se encuentra suspendida hasta el " . date("d/m/Y H:i", $hastaTime) . ". Motivo: " . ($user["motivo_sancion"] ?: "Infracción temporal.")
                    ];
                } else {
                    $pdo->prepare("UPDATE usuarios SET estado = 'activo', motivo_sancion = NULL, sancionado_hasta = NULL WHERE google_id = ?")->execute([$googleId]);
                    return null;
                }
            } else {
                return [
                    "bloqueado" => true,
                    "tipo" => "suspension",
                    "mensaje" => "Tu cuenta se encuentra suspendida temporalmente. Motivo: " . ($user["motivo_sancion"] ?: "Infracción temporal.")
                ];
            }
        }
    } catch (Exception $e) {}
    return null;
}

function calculatePhpUserBadges($user, $totalHilos, $totalComentarios, $karmaTotal, $maxVotes) {
    $badges = [];
    $badges[] = [
        "id" => "pionero_2026",
        "titulo" => "Pionero 2026",
        "icono" => "🌟",
        "color" => "#f59e0b",
        "desc" => "Miembro activo de la temporada Estudiantina 2026."
    ];
    if ($totalHilos >= 3) {
        $badges[] = [
            "id" => "voz_tribuna",
            "titulo" => "Voz de la Tribuna",
            "icono" => "📢",
            "color" => "#38bdf8",
            "desc" => "Inició 3 o más debates en la comunidad."
        ];
    }
    if ($totalComentarios >= 5) {
        $badges[] = [
            "id" => "comentarista_fiel",
            "titulo" => "Comentarista Fiel",
            "icono" => "💬",
            "color" => "#a855f7",
            "desc" => "Aportó 5 o más respuestas constructivas."
        ];
    }
    if ($karmaTotal >= 20 || $maxVotes >= 10) {
        $badges[] = [
            "id" => "costanera_trending",
            "titulo" => "Trending Costanera",
            "icono" => "🔥",
            "color" => "#ef4444",
            "desc" => "Sus aportes cosecharon amplio reconocimiento popular."
        ];
    }
    if ($user && (($user["estado"] ?? "activo") === "activo")) {
        $badges[] = [
            "id" => "convivencia_ejemplar",
            "titulo" => "Convivencia Ejemplar",
            "icono" => "🛡️",
            "color" => "#22c55e",
            "desc" => "Cuenta en regla con respeto a las hinchadas posadeñas."
        ];
    }
    if ($user && (($user["rol"] ?? "") === "admin" || ($user["rol"] ?? "") === "superadmin")) {
        $badges[] = [
            "id" => "moderador_oficial",
            "titulo" => "Moderador Oficial",
            "icono" => "⚡",
            "color" => "#fbbf24",
            "desc" => "Miembro del equipo de fiscalización y moderación."
        ];
    }
    return $badges;
}

// Insertar canales iniciales si está vacía la tabla
$checkCanales = $pdo->query("SELECT COUNT(*) FROM canales")->fetchColumn();
if ($checkCanales == 0) {
    $ins = $pdo->prepare("INSERT INTO canales (id, titulo, descripcion, icono, color) VALUES (?, ?, ?, ?, ?)");
    $canalesInit = [
        ["general", "General & Comunidad", "Debates abiertos, anécdotas y actualidad de la Estudiantina.", "💬", "#38bdf8"],
        ["banda", "Banda de Música", "Arreglos, redoblantes, chanchas, cortes y ritmos.", "🥁", "#f59e0b"],
        ["baile", "Cuerpo de Baile", "Coreografías, temáticas, trajes, tocados y evolución en calle.", "💃", "#ec4899"],
        ["hinchadas", "Tribunas & Hinchadas", "Cantos, banderas, color y aliento de cada colegio.", "📢", "#22c55e"],
        ["simulador", "Sugerencias del Juego", "Ideas, reportes de eventos y mejoras para el Simulador.", "🎮", "#a855f7"],
        ["noticias", "Noticias & Cobertura", "Debates oficiales sobre las crónicas, coberturas y novedades de estudiantina.online.", "📰", "#38bdf8"],
        ["offtopic", "Off Topic", "Charlas libres, memes, debates abiertos y anécdotas fuera de competencia.", "☕", "#f43f5e"]
    ];
    foreach ($canalesInit as $c) {
        $ins->execute($c);
    }
} else {
    $checkNoticias = $pdo->query("SELECT COUNT(*) FROM canales WHERE id = 'noticias'")->fetchColumn();
    if ($checkNoticias == 0) {
        $insN = $pdo->prepare("INSERT INTO canales (id, titulo, descripcion, icono, color) VALUES (?, ?, ?, ?, ?)");
        $insN->execute(["noticias", "Noticias & Cobertura", "Debates oficiales sobre las crónicas, coberturas y novedades de estudiantina.online.", "📰", "#38bdf8"]);
    }
    $checkOfftopic = $pdo->query("SELECT COUNT(*) FROM canales WHERE id = 'offtopic'")->fetchColumn();
    if ($checkOfftopic == 0) {
        $insOff = $pdo->prepare("INSERT INTO canales (id, titulo, descripcion, icono, color) VALUES (?, ?, ?, ?, ?)");
        $insOff->execute(["offtopic", "Off Topic", "Charlas libres, memes, debates abiertos y anécdotas fuera de competencia.", "☕", "#f43f5e"]);
    }
}

// Sembrar usuarios demo si no existen
$insU = $pdo->prepare("INSERT OR IGNORE INTO usuarios (google_id, email, nombre, username, avatar_url, colegio_id, rol_estudiantil, ano_escolar, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$insU->execute(["admin-redaccion", "redaccion@estudiantina.online", "Redacción Oficial", "redaccion", "assets/avatar-redaccion.webp", "posadas", "Redacción Oficial", "Equipo Editorial", "Cobertura oficial y crónica minuto a minuto de la Estudiantina."]);
$insU->execute(["demo-user-1", "lucas@example.com", "Lucas Percusión", "lucas_percusion", "assets/avatar-default.webp", "janssen", "Redoblante", "5° Año (Promo)", "Apasionado del ritmo y los cortes de batería del Janssen."]);
$insU->execute(["demo-user-2", "valentina@example.com", "Valentina Pasista", "valen_pasista", "assets/avatar-default.webp", "santa_maria", "Pasista de Escuadra", "4° Año", "Bailando en la costanera con el corazón azul y blanco."]);
$insU->execute(["demo-user-3", "agustin@example.com", "Agustín Gamer", "agustin_gamer", "assets/avatar-default.webp", "industrial", "Director/a de Banda", "6° Año Técnico", "Simulador y tambores en la previa de la fiesta."]);
$insU->execute(["seed-roque-1", "bautista@example.com", "Bautista Roque", "bauti_roque", "assets/avatar-default.webp", "roque", "Chanchero Mayor", "5° Año (Promo)", "Dejando la piel en cada golpe de chancha por el Roque."]);
$insU->execute(["seed-roque-2", "camila@example.com", "Camila Pasista", "camila_pasista", "assets/avatar-default.webp", "roque", "Pasista Principal", "4° Año", "Brillo y sincronización en la Costanera."]);
$insU->execute(["seed-santa-1", "valen_sm@example.com", "Valentina Pasista", "valentina_sm", "assets/avatar-default.webp", "santa_maria", "Bastonera", "5° Año (Promo)", "Orgullo y pasión albiazul en cada pasada."]);
$insU->execute(["seed-santa-2", "sofi@example.com", "Sofi Santa", "sofi_santa", "assets/avatar-default.webp", "santa_maria", "Hincha de Tribuna", "3° Año", "La tribuna del Santa copando el cuarto tramo."]);
$insU->execute(["seed-sanba-1", "mateo@example.com", "Mateo Sanba", "mateo_sanba", "assets/avatar-default.webp", "san_basilio", "Redoblante", "4° Año", "El compás dinámico del San Basilio."]);
$insU->execute(["seed-madre-1", "lucia@example.com", "Lucía Pasista", "lucia_madre", "assets/avatar-default.webp", "madre_misericordia", "Cuerpo de Baile", "5° Año (Promo)", "Coreografía y elegancia en la pista."]);
$insU->execute(["seed-indu-2", "franco@example.com", "Franco Indu", "franco_indu", "assets/avatar-default.webp", "industrial", "Banda de Música", "6° Año Técnico", "Potencia pesada de la EPET 1."]);
$insU->execute(["seed-janssen-1", "lucas_j@example.com", "Lucas Percusión", "lucas_janssen", "assets/avatar-default.webp", "janssen", "Caja / Redoble", "5° Año", "Tradición y cortes precisos en los palcos."]);
$insU->execute(["seed-34-1", "santy@example.com", "Santy Ruiz Diaz", "sonta", "assets/avatar-default.webp", "epet_34", "Director/a de Banda", "6° Año Técnico", "Liderando los parches y el simulador."]);
$insU->execute(["seed-goyena-1", "julieta@example.com", "Julieta Goyena", "juli_goyena", "assets/avatar-default.webp", "goyena", "Cuerpo de Baile", "4° Año", "Alegría y ritmo del Goyena."]);
$insU->execute(["seed-nacional-1", "rodrigo@example.com", "Rodrigo Nacional", "rodrigo_nacional", "assets/avatar-default.webp", "nacional", "Banda de Música", "5° Año", "Aliento sin pausa del Martín de Moussy."]);
$insU->execute(["seed-normal-1", "nahuel@example.com", "Nahuel Normal", "nahuel_normal", "assets/avatar-default.webp", "normal_estados_unidos", "Banda de Música", "5° Año", "Fuerza histórica de la Normal."]);
$insU->execute(["seed-c6-1", "joaquin@example.com", "Joaquín C6", "joaquin_c6", "assets/avatar-default.webp", "comercio_6", "Banda de Música", "5° Año", "Los cortes del Comercio 6 en el anfiteatro."]);
$insU->execute(["seed-c18-1", "belen@example.com", "Belén C18", "belen_c18", "assets/avatar-default.webp", "comercio_18", "Cuerpo de Baile", "4° Año", "La magia y color del Comercio 18."]);
$insU->execute(["seed-bachi-1", "clara@example.com", "Clara Bachi", "clara_bachi", "assets/avatar-default.webp", "humanista", "Estandarte Alegórico", "5° Año (Promo)", "Fineza conceptual del Bachillerato Humanista."]);

// Auto-reparación de autores sin usuario en PHP
try {
    $autoresSinU = $pdo->query("
        SELECT DISTINCT autor_google_id, autor_nombre, autor_avatar, colegio_id
        FROM (
            SELECT autor_google_id, autor_nombre, autor_avatar, colegio_id FROM hilos
            UNION
            SELECT autor_google_id, autor_nombre, autor_avatar, colegio_id FROM comentarios
        ) a
        WHERE a.autor_google_id NOT IN (SELECT google_id FROM usuarios)
    ")->fetchAll();

    foreach ($autoresSinU as $a) {
        if (empty($a['autor_google_id'])) continue;
        $cleanName = trim($a['autor_nombre'] ?? "Hincha");
        $base = preg_replace('/[^a-z0-9_]/', '', strtolower($cleanName));
        if (empty($base) || strlen($base) < 3) $base = "hincha_" . substr($a['autor_google_id'], -4);
        $base = substr($base, 0, 16);

        $chkU = $pdo->prepare("SELECT 1 FROM usuarios WHERE LOWER(username) = LOWER(?)");
        $chkU->execute([$base]);
        $finalU = $chkU->fetchColumn() ? ($base . "_" . substr($a['autor_google_id'], -4)) : $base;

        $insU->execute([
            $a['autor_google_id'],
            $finalU . "@estudiantina.online",
            $cleanName,
            $finalU,
            $a['autor_avatar'] ?: "assets/avatar-default.webp",
            $a['colegio_id'] ?: "janssen",
            "Hincha de Tribuna",
            "Secundaria",
            "Hincha posadeño de la fiesta estudiantil."
        ]);
    }

    $sinUsernames = $pdo->query("SELECT google_id, nombre FROM usuarios WHERE username IS NULL OR username = ''")->fetchAll();
    $updU = $pdo->prepare("UPDATE usuarios SET username = ? WHERE google_id = ?");
    foreach ($sinUsernames as $u) {
        $base = substr(preg_replace('/[^a-z0-9_]/', '', strtolower($u['nombre'] ?? "hincha")), 0, 12);
        if (strlen($base) < 3) $base = "hincha";
        $unique = $base . "_" . substr($u['google_id'], -4);
        $updU->execute([$unique, $u['google_id']]);
    }
} catch (Exception $e) {}

// Sembrar hilos iniciales si no hay ninguno
$checkHilos = $pdo->query("SELECT COUNT(*) FROM hilos")->fetchColumn();
if ($checkHilos == 0) {
    $insHilo = $pdo->prepare("INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, votos, respuestas_count, fijado, creado_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $hilosSeed = [
        ["banda", "¡Ritmos y sincronización de las chanchas pesadas en la Costanera!", "¿Qué opinan de los cortes que prepararon los colegios técnicos este año? En las pruebas piloto se notó una potencia tremenda en los palcos.", "demo-user-1", "Lucas Percusión", "assets/avatar-default.webp", "janssen", 28, 2, 1, date("Y-m-d H:i:s", strtotime("-3 hours"))],
        ["baile", "¿Cómo influye el peso de los espaldares en las pasadas largas?", "Bailar 800 metros seguidos con plumas y tocados de pedrería demanda un físico tremendo. ¿Qué técnicas de respiración usan sus escuadras?", "demo-user-2", "Valentina Pasista", "assets/avatar-default.webp", "santa_maria", 34, 1, 0, date("Y-m-d H:i:s", strtotime("-5 hours"))],
        ["simulador", "Propuesta: Que se puedan personalizar los cortes de redoble en el juego", "Estaría genial que en las noches de calle del simulador puedas elegir ritmos acelerados o hacer solos de batería antes de entrar al palco.", "demo-user-3", "Agustín Gamer", "assets/avatar-default.webp", "industrial", 19, 1, 0, date("Y-m-d H:i:s", strtotime("-8 hours"))]
    ];
    foreach ($hilosSeed as $h) {
        $insHilo->execute($h);
    }

    // Comentarios seed
    $pdo->exec("
        INSERT INTO comentarios (hilo_id, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, votos, creado_en)
        VALUES (1, 'Totalmente de acuerdo, los cortes cruzados de chancha este año van a definir el primer puesto.', 'demo-user-2', 'Valentina Pasista', 'assets/avatar-default.webp', 'santa_maria', 5, datetime('now', '-2 hours')),
               (1, 'El secreto está en los redoblantes bien tensados, si no suenan secos se pierde en el viento del río.', 'demo-user-3', 'Agustín Gamer', 'assets/avatar-default.webp', 'industrial', 3, datetime('now', '-1 hours')),
               (2, 'Nosotras ensayamos con chalecos livianos para acostumbrarnos al peso de las plumas antes de las noches oficiales.', 'demo-user-1', 'Lucas Percusión', 'assets/avatar-default.webp', 'janssen', 6, datetime('now', '-3 hours')),
               (3, '¡Apoyo total! Poder elegir la velocidad del redoble en los palcos sumaría muchísima adrenalina al simulador.', 'demo-user-1', 'Lucas Percusión', 'assets/avatar-default.webp', 'janssen', 4, datetime('now', '-4 hours'));
    ");
}

// Rate-limiting con soporte de APCu y fallback a SQLite
function checkPhpRateLimit($pdo, string $googleId, string $tipo = "hilo", int $windowSec = 30): bool {
    if (empty($googleId)) return false;
    if (function_exists('apcu_fetch')) {
        $key = 'rl_' . $tipo . '_' . $googleId;
        $last = apcu_fetch($key);
        if ($last !== false && (time() - $last) < $windowSec) return false;
        apcu_store($key, time(), $windowSec);
        return true;
    }
    // Fallback a SQLite cuando APCu no está disponible (ej. Hosting compartido)
    try {
        $table = $tipo === "hilo" ? "hilos" : "comentarios";
        $colAuthor = "autor_google_id";
        $stmt = $pdo->prepare("SELECT creado_en FROM {$table} WHERE {$colAuthor} = ? ORDER BY id DESC LIMIT 1");
        $stmt->execute([$googleId]);
        $lastDate = $stmt->fetchColumn();
        if ($lastDate) {
            $lastTime = strtotime($lastDate);
            if ($lastTime && (time() - $lastTime) < $windowSec) {
                return false;
            }
        }
    } catch (Exception $e) {}
    return true;
}

$action = $_GET["action"] ?? "";

// -------------------------------------------------------------
// ACTION: CHECK USERNAME (Validación en tiempo real)
// -------------------------------------------------------------
if ($action === "check_username") {
    $rawUsername = trim($_GET["username"] ?? "");
    $excludeGoogleId = trim($_GET["googleId"] ?? "");
    $check = validatePhpUsername($rawUsername);
    if (!$check["valid"]) {
        echo json_encode(["status" => "ok", "available" => false, "message" => $check["message"]]);
        exit;
    }

    $chk = $pdo->prepare("SELECT google_id FROM usuarios WHERE LOWER(username) = LOWER(?) AND google_id != ?");
    $chk->execute([$check["username"], $excludeGoogleId]);
    if ($chk->fetchColumn()) {
        echo json_encode(["status" => "ok", "available" => false, "message" => "El nombre de usuario ya está registrado por otro hincha."]);
        exit;
    }

    echo json_encode(["status" => "ok", "available" => true, "message" => "¡Usuario disponible!", "username" => $check["username"]]);
    exit;
}

// -------------------------------------------------------------
// ACTION: CANALES
// -------------------------------------------------------------
if ($action === "canales") {
    $stmt = $pdo->query("
        SELECT c.*, COUNT(h.id) as hilos_count
        FROM canales c
        LEFT JOIN hilos h ON c.id = h.canal_id AND h.oculto = 0
        GROUP BY c.id
    ");
    $canales = $stmt->fetchAll();

    $stmtCol = $pdo->query("
        SELECT colegio_id, COUNT(id) as count
        FROM hilos
        WHERE oculto = 0
        GROUP BY colegio_id
    ");
    $colegiosCountsRaw = $stmtCol->fetchAll();
    $colegiosCounts = [];
    foreach ($colegiosCountsRaw as $r) {
        if (!empty($r["colegio_id"])) {
            $colegiosCounts[$r["colegio_id"]] = (int)$r["count"];
        }
    }

    echo json_encode(["status" => "ok", "canales" => $canales, "colegiosCounts" => $colegiosCounts]);
    exit;
}

// -------------------------------------------------------------
// ACTION: HILOS (Paginados y ordenados)
// -------------------------------------------------------------
if ($action === "hilos") {
    $canal = $_GET["canal"] ?? "todos";
    $sort = $_GET["sort"] ?? "top"; // 'top', 'recientes' o 'comentados'
    $colegio = $_GET["colegio"] ?? "todos";
    $limit = min(50, max(1, (int)($_GET["limit"] ?? 10)));
    $offset = max(0, (int)($_GET["offset"] ?? 0));
    $q = trim($_GET["q"] ?? "");

    $sql = "
        SELECT
            h.*,
            COALESCE(NULLIF(u.username, ''), '') as autor_username,
            COALESCE(NULLIF(u.nombre, ''), h.autor_nombre) as autor_nombre,
            COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), h.autor_avatar) as autor_avatar,
            COALESCE(NULLIF(u.colegio_id, ''), h.colegio_id) as colegio_id,
            COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
        FROM hilos h
        LEFT JOIN usuarios u ON h.autor_google_id = u.google_id
        WHERE h.oculto = 0
    ";
    $params = [];

    if ($canal !== "todos" && !empty($canal)) {
        $sql .= " AND h.canal_id = ?";
        $params[] = $canal;
    }

    if ($colegio !== "todos" && !empty($colegio)) {
        $sql .= " AND h.colegio_id = ?";
        $params[] = $colegio;
    }

    // Búsqueda full-text sobre título, contenido, nombre de autor y username
    if (!empty($q)) {
        $like = "%$q%";
        $sql .= " AND (h.titulo LIKE ? OR h.contenido LIKE ? OR h.autor_nombre LIKE ? OR u.username LIKE ?)";
        $params[] = $like;
        $params[] = $like;
        $params[] = $like;
        $params[] = $like;
    }

    $viewerGoogleId = trim($_GET["googleId"] ?? "");

    if ($sort === "recientes") {
        $sql .= " ORDER BY h.fijado DESC, h.creado_en DESC LIMIT $limit OFFSET $offset";
    } elseif ($sort === "comentados") {
        $sql .= " ORDER BY h.fijado DESC, h.respuestas_count DESC, h.votos DESC, h.creado_en DESC LIMIT $limit OFFSET $offset";
    } else {
        $sql .= " ORDER BY h.fijado DESC, h.votos DESC, h.creado_en DESC LIMIT $limit OFFSET $offset";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $hilosRaw = $stmt->fetchAll();

    $votedHilosMap = [];
    if (!empty($viewerGoogleId) && !empty($hilosRaw)) {
        $ids = array_column($hilosRaw, "id");
        $placeholders = implode(",", array_fill(0, count($ids), "?"));
        $votedStmt = $pdo->prepare("SELECT item_id FROM votos WHERE item_tipo = 'hilo' AND google_id = ? AND item_id IN ($placeholders)");
        $votedStmt->execute(array_merge([$viewerGoogleId], $ids));
        $votedHilosMap = array_flip($votedStmt->fetchAll(PDO::FETCH_COLUMN));
    }

    $hilos = array_map(function($h) use ($votedHilosMap) {
        $h["user_voted"] = isset($votedHilosMap[$h["id"]]) ? 1 : 0;
        return $h;
    }, $hilosRaw);

    // Conteo total para métricas y paginación
    $countSql = "SELECT COUNT(*) FROM hilos h LEFT JOIN usuarios u ON h.autor_google_id = u.google_id WHERE h.oculto = 0";
    $countParams = [];
    if ($canal !== "todos" && !empty($canal)) {
        $countSql .= " AND h.canal_id = ?";
        $countParams[] = $canal;
    }
    if ($colegio !== "todos" && !empty($colegio)) {
        $countSql .= " AND h.colegio_id = ?";
        $countParams[] = $colegio;
    }
    if (!empty($q)) {
        $like = "%$q%";
        $countSql .= " AND (h.titulo LIKE ? OR h.contenido LIKE ? OR h.autor_nombre LIKE ? OR u.username LIKE ?)";
        $countParams[] = $like;
        $countParams[] = $like;
        $countParams[] = $like;
        $countParams[] = $like;
    }
    $stmtCount = $pdo->prepare($countSql);
    $stmtCount->execute($countParams);
    $totalCount = (int)$stmtCount->fetchColumn();

    echo json_encode(["status" => "ok", "total_count" => $totalCount, "hilos" => $hilos]);
    exit;
}

// -------------------------------------------------------------
// ACTION: HILO DETALLE (con comentarios)
// -------------------------------------------------------------
if ($action === "hilo") {
    $id = (int)($_GET["id"] ?? 0);
    $viewerGoogleId = trim($_GET["googleId"] ?? "");
    $stmt = $pdo->prepare("
        SELECT
            h.*,
            COALESCE(NULLIF(u.username, ''), '') as autor_username,
            COALESCE(NULLIF(u.nombre, ''), h.autor_nombre) as autor_nombre,
            COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), h.autor_avatar) as autor_avatar,
            COALESCE(NULLIF(u.colegio_id, ''), h.colegio_id) as colegio_id,
            COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
        FROM hilos h
        LEFT JOIN usuarios u ON h.autor_google_id = u.google_id
        WHERE h.id = ? AND h.oculto = 0
    ");
    $stmt->execute([$id]);
    $hilo = $stmt->fetch();

    if (!$hilo) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Hilo no encontrado o eliminado"]);
        exit;
    }

    // user_voted en el hilo principal
    if ($viewerGoogleId) {
        $chk = $pdo->prepare("SELECT 1 FROM votos WHERE item_tipo = 'hilo' AND item_id = ? AND google_id = ?");
        $chk->execute([$id, $viewerGoogleId]);
        $hilo["user_voted"] = $chk->fetchColumn() ? 1 : 0;
    } else {
        $hilo["user_voted"] = 0;
    }

    $stmtComentarios = $pdo->prepare("
        SELECT
            c.*,
            COALESCE(NULLIF(u.username, ''), '') as autor_username,
            COALESCE(NULLIF(u.nombre, ''), c.autor_nombre) as autor_nombre,
            COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), c.autor_avatar) as autor_avatar,
            COALESCE(NULLIF(u.colegio_id, ''), c.colegio_id) as colegio_id,
            COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
        FROM comentarios c
        LEFT JOIN usuarios u ON c.autor_google_id = u.google_id
        WHERE c.hilo_id = ? AND c.oculto = 0
        ORDER BY c.creado_en ASC
    ");
    $stmtComentarios->execute([$id]);
    $comentariosRaw = $stmtComentarios->fetchAll();

    // Enriquecer comentarios con user_voted (batch sin N+1)
    $votedComentariosMap = [];
    if (!empty($viewerGoogleId) && !empty($comentariosRaw)) {
        $cIds = array_column($comentariosRaw, "id");
        $placeholders = implode(",", array_fill(0, count($cIds), "?"));
        $votedStmt = $pdo->prepare("SELECT item_id FROM votos WHERE item_tipo = 'comentario' AND google_id = ? AND item_id IN ($placeholders)");
        $votedStmt->execute(array_merge([$viewerGoogleId], $cIds));
        $votedComentariosMap = array_flip($votedStmt->fetchAll(PDO::FETCH_COLUMN));
    }

    $comentarios = array_map(function($c) use ($votedComentariosMap) {
        $c["user_voted"] = isset($votedComentariosMap[$c["id"]]) ? 1 : 0;
        return $c;
    }, $comentariosRaw);

    echo json_encode(["status" => "ok", "hilo" => $hilo, "comentarios" => $comentarios]);
    exit;
}

// -------------------------------------------------------------
// ACTION: NOTICIA_HILO (Obtener o inicializar hilo para una noticia)
// -------------------------------------------------------------
if ($action === "noticia_hilo") {
    $noticiaId = trim($_GET["noticiaId"] ?? "");
    $viewerGoogleId = trim($_GET["googleId"] ?? "");

    if (empty($noticiaId)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Parámetro noticiaId requerido"]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT
            h.*,
            COALESCE(NULLIF(u.username, ''), '') as autor_username,
            COALESCE(NULLIF(u.nombre, ''), h.autor_nombre) as autor_nombre,
            COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), h.autor_avatar) as autor_avatar,
            COALESCE(NULLIF(u.colegio_id, ''), h.colegio_id) as colegio_id,
            COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
        FROM hilos h
        LEFT JOIN usuarios u ON h.autor_google_id = u.google_id
        WHERE h.noticia_id = ? AND h.oculto = 0
    ");
    $stmt->execute([$noticiaId]);
    $hilo = $stmt->fetch();

    if (!$hilo) {
        $stmtNotic = $pdo->prepare("SELECT * FROM noticias WHERE id = ?");
        $stmtNotic->execute([$noticiaId]);
        $notic = $stmtNotic->fetch();

        $titulo = $notic ? $notic["titulo"] : "Debate: Noticia $noticiaId";
        $contenido = $notic ? ($notic["resumen"] ?: $notic["titulo"]) : "Espacio oficial de debate y comentarios sobre esta cobertura periodística.";

        $ins = $pdo->prepare("
            INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, noticia_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $ins->execute(["noticias", $titulo, $contenido, "admin-redaccion", "Redacción Oficial", "assets/avatar-redaccion.webp", "posadas", $noticiaId]);
        $newId = (int)$pdo->lastInsertId();

        $stmt = $pdo->prepare("
            SELECT
                h.*,
                COALESCE(NULLIF(u.username, ''), '') as autor_username,
                COALESCE(NULLIF(u.nombre, ''), h.autor_nombre) as autor_nombre,
                COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), h.autor_avatar) as autor_avatar,
                COALESCE(NULLIF(u.colegio_id, ''), h.colegio_id) as colegio_id,
                COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
            FROM hilos h
            LEFT JOIN usuarios u ON h.autor_google_id = u.google_id
            WHERE h.id = ?
        ");
        $stmt->execute([$newId]);
        $hilo = $stmt->fetch();
    }

    if ($viewerGoogleId) {
        $chk = $pdo->prepare("SELECT 1 FROM votos WHERE item_tipo = 'hilo' AND item_id = ? AND google_id = ?");
        $chk->execute([$hilo["id"], $viewerGoogleId]);
        $hilo["user_voted"] = $chk->fetchColumn() ? 1 : 0;
    } else {
        $hilo["user_voted"] = 0;
    }

    $stmtComentarios = $pdo->prepare("
        SELECT
            c.*,
            COALESCE(NULLIF(u.username, ''), '') as autor_username,
            COALESCE(NULLIF(u.nombre, ''), c.autor_nombre) as autor_nombre,
            COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), c.autor_avatar) as autor_avatar,
            COALESCE(NULLIF(u.colegio_id, ''), c.colegio_id) as colegio_id,
            COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
        FROM comentarios c
        LEFT JOIN usuarios u ON c.autor_google_id = u.google_id
        WHERE c.hilo_id = ? AND c.oculto = 0
        ORDER BY c.creado_en ASC
    ");
    $stmtComentarios->execute([$hilo["id"]]);
    $comentariosRaw = $stmtComentarios->fetchAll();

    $votedNoticiaComentariosMap = [];
    if (!empty($viewerGoogleId) && !empty($comentariosRaw)) {
        $cIds = array_column($comentariosRaw, "id");
        $placeholders = implode(",", array_fill(0, count($cIds), "?"));
        $votedStmt = $pdo->prepare("SELECT item_id FROM votos WHERE item_tipo = 'comentario' AND google_id = ? AND item_id IN ($placeholders)");
        $votedStmt->execute(array_merge([$viewerGoogleId], $cIds));
        $votedNoticiaComentariosMap = array_flip($votedStmt->fetchAll(PDO::FETCH_COLUMN));
    }

    $comentarios = array_map(function($c) use ($votedNoticiaComentariosMap) {
        $c["user_voted"] = isset($votedNoticiaComentariosMap[$c["id"]]) ? 1 : 0;
        return $c;
    }, $comentariosRaw);

    echo json_encode(["status" => "ok", "hilo" => $hilo, "comentarios" => $comentarios]);
    exit;
}

// -------------------------------------------------------------
// ACTION: PERFIL (Detalle público, estadísticas e insignias)
// -------------------------------------------------------------
if ($action === "perfil") {
    $targetId = trim($_GET["id"] ?? $_GET["googleId"] ?? "");
    if (empty($targetId)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID de usuario requerido"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE google_id = ?");
    $stmt->execute([$targetId]);
    $user = $stmt->fetch();

    if (!$user) {
        $stmtAutor = $pdo->prepare("
            SELECT autor_nombre, autor_avatar, colegio_id
            FROM hilos WHERE autor_google_id = ?
            UNION
            SELECT autor_nombre, autor_avatar, colegio_id
            FROM comentarios WHERE autor_google_id = ?
            LIMIT 1
        ");
        $stmtAutor->execute([$targetId, $targetId]);
        $autorInfo = $stmtAutor->fetch();

        if ($autorInfo) {
            $user = [
                "google_id" => $targetId,
                "nombre" => $autorInfo["autor_nombre"] ?: ("Hincha " . substr($targetId, -4)),
                "email" => "",
                "avatar_url" => $autorInfo["autor_avatar"] ?: "",
                "avatar_personalizado" => "",
                "colegio_id" => $autorInfo["colegio_id"] ?: "janssen",
                "rol" => "usuario",
                "estado" => "activo",
                "bio" => "",
                "rol_estudiantil" => "Hincha de Tribuna",
                "ano_escolar" => "Secundaria",
                "instagram" => "",
                "creado_en" => date("Y-m-d H:i:s")
            ];
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Perfil de usuario no encontrado"]);
            exit;
        }
    }

    // Métricas en tiempo real
    $stH = $pdo->prepare("SELECT COUNT(*) FROM hilos WHERE autor_google_id = ? AND oculto = 0");
    $stH->execute([$targetId]);
    $totalHilos = (int)$stH->fetchColumn();

    $stC = $pdo->prepare("SELECT COUNT(*) FROM comentarios WHERE autor_google_id = ? AND oculto = 0");
    $stC->execute([$targetId]);
    $totalComentarios = (int)$stC->fetchColumn();

    $stKVH = $pdo->prepare("SELECT COALESCE(SUM(votos), 0) as karma, COALESCE(MAX(votos), 0) as max_votos FROM hilos WHERE autor_google_id = ? AND oculto = 0");
    $stKVH->execute([$targetId]);
    $rowKVH = $stKVH->fetch();
    $karmaHilos = (int)($rowKVH["karma"] ?? 0);
    $maxVotes = (int)($rowKVH["max_votos"] ?? 0);

    $stKVC = $pdo->prepare("SELECT COALESCE(SUM(votos), 0) FROM comentarios WHERE autor_google_id = ? AND oculto = 0");
    $stKVC->execute([$targetId]);
    $karmaComentarios = (int)$stKVC->fetchColumn();

    $karmaTotal = $karmaHilos + $karmaComentarios;

    $insignias = calculatePhpUserBadges($user, $totalHilos, $totalComentarios, $karmaTotal, $maxVotes);

    $stHR = $pdo->prepare("
        SELECT id, canal_id, titulo, votos, respuestas_count, creado_en
        FROM hilos
        WHERE autor_google_id = ? AND oculto = 0
        ORDER BY creado_en DESC
        LIMIT 10
    ");
    $stHR->execute([$targetId]);
    $hilosRecientes = $stHR->fetchAll();

    $stCR = $pdo->prepare("
        SELECT c.id, c.hilo_id, c.contenido, c.votos, c.creado_en, h.titulo as hilo_titulo
        FROM comentarios c
        LEFT JOIN hilos h ON h.id = c.hilo_id
        WHERE c.autor_google_id = ? AND c.oculto = 0
        ORDER BY c.creado_en DESC
        LIMIT 10
    ");
    $stCR->execute([$targetId]);
    $comentariosRecientes = $stCR->fetchAll();

    echo json_encode([
        "status" => "ok",
        "usuario" => [
            "googleId" => $user["google_id"],
            "nombre" => $user["nombre"],
            "username" => $user["username"] ?? "",
            "avatarUrl" => !empty($user["avatar_personalizado"]) ? $user["avatar_personalizado"] : $user["avatar_url"],
            "avatarOriginal" => $user["avatar_url"],
            "colegioId" => $user["colegio_id"],
            "rol" => $user["rol"] ?? "usuario",
            "estado" => $user["estado"] ?? "activo",
            "bio" => $user["bio"] ?? "",
            "rolEstudiantil" => $user["rol_estudiantil"] ?? "Hincha de Tribuna",
            "anoEscolar" => $user["ano_escolar"] ?? "Secundaria",
            "instagram" => $user["instagram"] ?? "",
            "creadoEn" => $user["creado_en"]
        ],
        "metricas" => [
            "totalHilos" => $totalHilos,
            "totalComentarios" => $totalComentarios,
            "karmaTotal" => $karmaTotal,
            "karmaHilos" => $karmaHilos,
            "karmaComentarios" => $karmaComentarios
        ],
        "insignias" => $insignias,
        "hilosRecientes" => $hilosRecientes,
        "comentariosRecientes" => $comentariosRecientes
    ]);
    exit;
}

// -------------------------------------------------------------
// ACTION: AUTH GOOGLE (Guardar / Actualizar usuario)
// -------------------------------------------------------------
if ($action === "auth_google" && $method === "POST") {
    $body = json_decode(file_get_contents("php://input"), true);
    $googleId = trim($body["googleId"] ?? "");
    $nombre = trim($body["nombre"] ?? "");
    $email = trim($body["email"] ?? "");
    $avatarUrl = trim($body["avatarUrl"] ?? "");
    $colegioId = trim($body["colegioId"] ?? "janssen");

    if (empty($googleId) || empty($nombre)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Datos de usuario incompletos"]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO usuarios (google_id, nombre, email, avatar_url, colegio_id)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(google_id) DO UPDATE SET
            email = CASE WHEN excluded.email != '' THEN excluded.email ELSE usuarios.email END,
            avatar_url = CASE WHEN usuarios.avatar_url IS NULL OR usuarios.avatar_url = '' THEN excluded.avatar_url ELSE usuarios.avatar_url END,
            nombre = CASE WHEN usuarios.nombre IS NULL OR usuarios.nombre = '' THEN excluded.nombre ELSE usuarios.nombre END,
            colegio_id = CASE WHEN usuarios.colegio_id IS NULL THEN excluded.colegio_id ELSE usuarios.colegio_id END
    ");
    $stmt->execute([$googleId, $nombre, $email, $avatarUrl, $colegioId]);

    $rowUser = $pdo->prepare("SELECT * FROM usuarios WHERE google_id = ?");
    $rowUser->execute([$googleId]);
    $u = $rowUser->fetch();

    $needsOnboarding = empty($u) || empty($u["username"]) || trim($u["username"]) === "";

    echo json_encode([
        "status" => "ok",
        "needsOnboarding" => $needsOnboarding,
        "usuario" => [
            "googleId" => $googleId,
            "nombre" => $u ? $u["nombre"] : $nombre,
            "username" => $u ? ($u["username"] ?? "") : "",
            "avatarUrl" => $u ? (!empty($u["avatar_personalizado"]) ? $u["avatar_personalizado"] : $u["avatar_url"]) : $avatarUrl,
            "avatarOriginal" => $u ? $u["avatar_url"] : $avatarUrl,
            "colegioId" => $u ? $u["colegio_id"] : $colegioId,
            "bio" => $u ? ($u["bio"] ?: "") : "",
            "rolEstudiantil" => $u ? ($u["rol_estudiantil"] ?: "Hincha de Tribuna") : "Hincha de Tribuna",
            "anoEscolar" => $u ? ($u["ano_escolar"] ?: "Secundaria") : "Secundaria",
            "instagram" => $u ? ($u["instagram"] ?: "") : ""
        ]
    ]);
    exit;
}

// -------------------------------------------------------------
// ACTION: COMPLETAR REGISTRO (Onboarding con @username único y foto)
// -------------------------------------------------------------
if ($action === "completar_registro" && $method === "POST") {
    $body = json_decode(file_get_contents("php://input"), true);
    $googleId = trim($body["googleId"] ?? "");
    $rawUsername = trim($body["username"] ?? "");
    $nombre = htmlspecialchars(trim(mb_substr($body["nombre"] ?? "", 0, 50)), ENT_QUOTES, "UTF-8");
    $colegioId = trim($body["colegioId"] ?? "janssen");
    $rolEstudiantil = htmlspecialchars(trim(mb_substr($body["rolEstudiantil"] ?? "Hincha de Tribuna", 0, 50)), ENT_QUOTES, "UTF-8");
    $anoEscolar = htmlspecialchars(trim(mb_substr($body["anoEscolar"] ?? "5° Año (Promo)", 0, 40)), ENT_QUOTES, "UTF-8");
    $bio = htmlspecialchars(trim(mb_substr($body["bio"] ?? "", 0, 160)), ENT_QUOTES, "UTF-8");
    $rawInsta = preg_replace('/^@/', '', trim(mb_substr($body["instagram"] ?? "", 0, 30)));
    $instagram = htmlspecialchars($rawInsta, ENT_QUOTES, "UTF-8");
    $avatarUrl = trim($body["avatarUrl"] ?? "");

    if (empty($googleId)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID de usuario requerido"]);
        exit;
    }

    $check = validatePhpUsername($rawUsername);
    if (!$check["valid"]) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => $check["message"]]);
        exit;
    }

    $chkTaken = $pdo->prepare("SELECT google_id FROM usuarios WHERE LOWER(username) = LOWER(?) AND google_id != ?");
    $chkTaken->execute([$check["username"], $googleId]);
    if ($chkTaken->fetchColumn()) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "El nombre de usuario ya está registrado por otro hincha."]);
        exit;
    }

    if (empty($nombre) || mb_strlen($nombre) < 2) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "El nombre debe tener al menos 2 caracteres."]);
        exit;
    }

    $chkUser = $pdo->prepare("SELECT * FROM usuarios WHERE google_id = ?");
    $chkUser->execute([$googleId]);
    $exist = $chkUser->fetch();

    $isCustomPhoto = str_starts_with($avatarUrl, "data:image/");
    $customAvatarToSave = $isCustomPhoto ? $avatarUrl : ($exist ? ($exist["avatar_personalizado"] ?? "") : "");

    if (!$exist) {
        $ins = $pdo->prepare("
            INSERT INTO usuarios (google_id, username, nombre, colegio_id, bio, rol_estudiantil, ano_escolar, instagram, avatar_personalizado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $ins->execute([$googleId, $check["username"], $nombre, $colegioId, $bio, $rolEstudiantil, $anoEscolar, $instagram, $customAvatarToSave]);
    } else {
        $upd = $pdo->prepare("
            UPDATE usuarios
            SET username = ?, nombre = ?, colegio_id = ?, bio = ?, rol_estudiantil = ?, ano_escolar = ?, instagram = ?, avatar_personalizado = ?
            WHERE google_id = ?
        ");
        $upd->execute([$check["username"], $nombre, $colegioId, $bio, $rolEstudiantil, $anoEscolar, $instagram, $customAvatarToSave, $googleId]);
    }

    $finalAvatar = !empty($customAvatarToSave) ? $customAvatarToSave : ($exist ? ($exist["avatar_url"] ?? "") : $avatarUrl);
    try {
        $pdo->prepare("UPDATE hilos SET autor_nombre = ?, autor_avatar = ?, colegio_id = ? WHERE autor_google_id = ?")->execute([$nombre, $finalAvatar, $colegioId, $googleId]);
        $pdo->prepare("UPDATE comentarios SET autor_nombre = ?, autor_avatar = ?, colegio_id = ? WHERE autor_google_id = ?")->execute([$nombre, $finalAvatar, $colegioId, $googleId]);
    } catch (Exception $e) {}

    echo json_encode([
        "status" => "ok",
        "message" => "¡Registro completado con éxito!",
        "usuario" => [
            "googleId" => $googleId,
            "username" => $check["username"],
            "nombre" => $nombre,
            "colegioId" => $colegioId,
            "bio" => $bio,
            "rolEstudiantil" => $rolEstudiantil,
            "anoEscolar" => $anoEscolar,
            "instagram" => $instagram,
            "avatarUrl" => $finalAvatar,
            "avatarOriginal" => $exist ? ($exist["avatar_url"] ?? "") : ""
        ]
    ]);
    exit;
}

// -------------------------------------------------------------
// ACTION: EDITAR PERFIL
// -------------------------------------------------------------
if ($action === "editar_perfil" && $method === "POST") {
    $body = json_decode(file_get_contents("php://input"), true);
    $googleId = trim($body["googleId"] ?? "");
    $rawUsername = trim($body["username"] ?? "");
    $nombre = htmlspecialchars(trim(mb_substr($body["nombre"] ?? "", 0, 50)), ENT_QUOTES, "UTF-8");
    $colegioId = trim($body["colegioId"] ?? "janssen");
    $bio = htmlspecialchars(trim(mb_substr($body["bio"] ?? "", 0, 160)), ENT_QUOTES, "UTF-8");
    $rolEstudiantil = htmlspecialchars(trim(mb_substr($body["rolEstudiantil"] ?? "Hincha de Tribuna", 0, 50)), ENT_QUOTES, "UTF-8");
    $anoEscolar = htmlspecialchars(trim(mb_substr($body["anoEscolar"] ?? "Secundaria", 0, 40)), ENT_QUOTES, "UTF-8");
    $rawInsta = preg_replace('/^@/', '', trim(mb_substr($body["instagram"] ?? "", 0, 30)));
    $instagram = htmlspecialchars($rawInsta, ENT_QUOTES, "UTF-8");
    $avatarUrl = trim($body["avatarUrl"] ?? $body["avatarPersonalizado"] ?? "");
    $restoreGoogleAvatar = !empty($body["restoreGoogleAvatar"]);

    if (empty($googleId)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID de usuario requerido"]);
        exit;
    }
    if (empty($nombre) || mb_strlen($nombre) < 2) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "El nombre debe tener al menos 2 caracteres"]);
        exit;
    }

    $validatedUsername = null;
    if (!empty($rawUsername)) {
        $check = validatePhpUsername($rawUsername);
        if (!$check["valid"]) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => $check["message"]]);
            exit;
        }
        $chkTaken = $pdo->prepare("SELECT google_id FROM usuarios WHERE LOWER(username) = LOWER(?) AND google_id != ?");
        $chkTaken->execute([$check["username"], $googleId]);
        if ($chkTaken->fetchColumn()) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "El nombre de usuario ya está registrado por otro hincha."]);
            exit;
        }
        $validatedUsername = $check["username"];
    }

    $sanction = checkPhpUserSanction($pdo, $googleId);
    if ($sanction && !empty($sanction["bloqueado"])) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => $sanction["mensaje"], "sanction" => $sanction]);
        exit;
    }

    $chkUser = $pdo->prepare("SELECT * FROM usuarios WHERE google_id = ?");
    $chkUser->execute([$googleId]);
    $exist = $chkUser->fetch();

    $customAvatar = $exist ? ($exist["avatar_personalizado"] ?? "") : "";
    if ($restoreGoogleAvatar) {
        $customAvatar = "";
    } else if (str_starts_with($avatarUrl, "data:image/")) {
        $customAvatar = $avatarUrl;
    }

    $finalUsername = $validatedUsername !== null ? $validatedUsername : ($exist ? ($exist["username"] ?? "") : "");

    if (!$exist) {
        $ins = $pdo->prepare("
            INSERT INTO usuarios (google_id, username, nombre, colegio_id, bio, rol_estudiantil, ano_escolar, instagram, avatar_personalizado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $ins->execute([$googleId, $finalUsername, $nombre, $colegioId, $bio, $rolEstudiantil, $anoEscolar, $instagram, $customAvatar]);
    } else {
        $upd = $pdo->prepare("
            UPDATE usuarios
            SET username = ?, nombre = ?, colegio_id = ?, bio = ?, rol_estudiantil = ?, ano_escolar = ?, instagram = ?, avatar_personalizado = ?
            WHERE google_id = ?
        ");
        $upd->execute([$finalUsername, $nombre, $colegioId, $bio, $rolEstudiantil, $anoEscolar, $instagram, $customAvatar, $googleId]);
    }

    $finalAvatarUrl = !empty($customAvatar) ? $customAvatar : ($exist ? ($exist["avatar_url"] ?? "") : $avatarUrl);

    try {
        $pdo->prepare("UPDATE hilos SET autor_nombre = ?, autor_avatar = ?, colegio_id = ? WHERE autor_google_id = ?")->execute([$nombre, $finalAvatarUrl, $colegioId, $googleId]);
        $pdo->prepare("UPDATE comentarios SET autor_nombre = ?, autor_avatar = ?, colegio_id = ? WHERE autor_google_id = ?")->execute([$nombre, $finalAvatarUrl, $colegioId, $googleId]);
    } catch (Exception $e) {}

    echo json_encode([
        "status" => "ok",
        "message" => "Perfil actualizado con éxito",
        "usuario" => [
            "googleId" => $googleId,
            "username" => $finalUsername,
            "nombre" => $nombre,
            "colegioId" => $colegioId,
            "bio" => $bio,
            "rolEstudiantil" => $rolEstudiantil,
            "anoEscolar" => $anoEscolar,
            "instagram" => $instagram,
            "avatarUrl" => $finalAvatarUrl,
            "avatarOriginal" => $exist ? ($exist["avatar_url"] ?? "") : ""
        ]
    ]);
    exit;
}

// -------------------------------------------------------------
// ACTION: CREAR HILO
// -------------------------------------------------------------
if ($action === "crear_hilo" && $method === "POST") {
    $body = json_decode(file_get_contents("php://input"), true);
    $canalId = trim($body["canalId"] ?? "general");
    $titulo = trim($body["titulo"] ?? "");
    $contenido = trim($body["contenido"] ?? "");
    $googleId = trim($body["googleId"] ?? "");
    $autorNombre = trim($body["autorNombre"] ?? "");
    $autorAvatar = trim($body["autorAvatar"] ?? "");
    $colegioId = trim($body["colegioId"] ?? "janssen");

    if (empty($titulo) || strlen($titulo) < 5) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "El título debe tener al menos 5 caracteres."]);
        exit;
    }
    if (empty($contenido) || strlen($contenido) < 10) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "La descripción debe tener al menos 10 caracteres."]);
        exit;
    }
    if (empty($googleId) || empty($autorNombre)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Debés identificarte con tu cuenta de Google para publicar."]);
        exit;
    }

    // Verificar si el usuario está suspendido o baneado
    $sanction = checkPhpUserSanction($pdo, $googleId);
    if ($sanction && !empty($sanction["bloqueado"])) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => $sanction["mensaje"], "sanction" => $sanction]);
        exit;
    }

    // Rate-limiting: 1 debate cada 30 segundos por usuario
    if (!checkPhpRateLimit($pdo, $googleId, "hilo", 30)) {
        http_response_code(429);
        echo json_encode(["status" => "error", "message" => "Esperá 30 segundos entre debates. ¡No hagas spam!"]);
        exit;
    }

    // Sanitización XSS
    $titulo = htmlspecialchars($titulo, ENT_QUOTES, "UTF-8");
    $contenido = htmlspecialchars($contenido, ENT_QUOTES, "UTF-8");
    $autorNombre = htmlspecialchars($autorNombre, ENT_QUOTES, "UTF-8");

    $stmt = $pdo->prepare("
        INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$canalId, $titulo, $contenido, $googleId, $autorNombre, $autorAvatar, $colegioId]);
    $newId = $pdo->lastInsertId();

    echo json_encode(["status" => "ok", "hiloId" => $newId, "message" => "Debate publicado con éxito!"]);
    exit;
}

// -------------------------------------------------------------
// ACTION: COMENTAR
// -------------------------------------------------------------
if ($action === "comentar" && $method === "POST") {
    $body = json_decode(file_get_contents("php://input"), true);
    $hiloId = (int)($body["hiloId"] ?? 0);
    $contenido = trim($body["contenido"] ?? "");
    $googleId = trim($body["googleId"] ?? "");
    $autorNombre = trim($body["autorNombre"] ?? "");
    $autorAvatar = trim($body["autorAvatar"] ?? "");
    $colegioId = trim($body["colegioId"] ?? "janssen");

    if ($hiloId <= 0 || empty($contenido)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "El comentario no puede estar vacío."]);
        exit;
    }
    if (empty($googleId) || empty($autorNombre)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Iniciá sesión con Google para responder."]);
        exit;
    }

    // Rate-limiting: 1 comentario cada 5 segundos por usuario
    if (!checkPhpRateLimit($pdo, $googleId, "comentario", 5)) {
        http_response_code(429);
        echo json_encode(["status" => "error", "message" => "Esperá unos segundos entre comentarios. ¡No hagas spam!"]);
        exit;
    }

    // Verificar si el usuario está suspendido o baneado
    $sanctionCom = checkPhpUserSanction($pdo, $googleId);
    if ($sanctionCom && !empty($sanctionCom["bloqueado"])) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => $sanctionCom["mensaje"], "sanction" => $sanctionCom]);
        exit;
    }

    // Validar que el hilo exista y no esté oculto
    $stmtCheckHilo = $pdo->prepare("SELECT id FROM hilos WHERE id = ? AND oculto = 0");
    $stmtCheckHilo->execute([$hiloId]);
    if (!$stmtCheckHilo->fetch()) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "El debate no existe o fue eliminado"]);
        exit;
    }

    $contenido = htmlspecialchars($contenido, ENT_QUOTES, "UTF-8");
    $autorNombre = htmlspecialchars($autorNombre, ENT_QUOTES, "UTF-8");

    $parentId = !empty($body["parentId"]) ? (int)$body["parentId"] : null;

    $stmt = $pdo->prepare("
        INSERT INTO comentarios (hilo_id, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, parent_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$hiloId, $contenido, $googleId, $autorNombre, $autorAvatar, $colegioId, $parentId]);

    // Incrementar contador de respuestas en el hilo
    $pdo->prepare("UPDATE hilos SET respuestas_count = respuestas_count + 1 WHERE id = ?")->execute([$hiloId]);

    echo json_encode(["status" => "ok", "message" => "Respuesta enviada!"]);
    exit;
}

// -------------------------------------------------------------
// ACTION: VOTAR (Toggle único por Google ID)
// -------------------------------------------------------------
if ($action === "votar" && $method === "POST") {
    $body = json_decode(file_get_contents("php://input"), true);
    $tipo = ($body["tipo"] ?? "") === "comentario" ? "comentario" : "hilo";
    $itemId = (int)($body["itemId"] ?? $body["id"] ?? 0);
    $googleId = trim($body["googleId"] ?? "");

    if ($itemId <= 0 || empty($googleId)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Parámetros de voto inválidos"]);
        exit;
    }

    // Verificar si ya votó
    $check = $pdo->prepare("SELECT 1 FROM votos WHERE item_tipo = ? AND item_id = ? AND google_id = ?");
    $check->execute([$tipo, $itemId, $googleId]);
    $hasVoted = $check->fetchColumn();

    $table = $tipo === "hilo" ? "hilos" : "comentarios";

    if ($hasVoted) {
        // Quitar voto
        $pdo->prepare("DELETE FROM votos WHERE item_tipo = ? AND item_id = ? AND google_id = ?")->execute([$tipo, $itemId, $googleId]);
        $pdo->prepare("UPDATE $table SET votos = MAX(0, votos - 1) WHERE id = ?")->execute([$itemId]);
        $voted = false;
    } else {
        // Agregar voto
        $pdo->prepare("INSERT INTO votos (item_tipo, item_id, google_id) VALUES (?, ?, ?)")->execute([$tipo, $itemId, $googleId]);
        $pdo->prepare("UPDATE $table SET votos = votos + 1 WHERE id = ?")->execute([$itemId]);
        $voted = true;
    }

    $newVotes = (int)$pdo->query("SELECT votos FROM $table WHERE id = $itemId")->fetchColumn();

    echo json_encode(["status" => "ok", "voted" => $voted, "votos" => $newVotes]);
    exit;
}

// -------------------------------------------------------------
// ACTION: REPORTAR (Auto-moderación protegida con 3 reportes únicos)
// -------------------------------------------------------------
if ($action === "reportar" && $method === "POST") {
    $body = json_decode(file_get_contents("php://input"), true);
    $tipo = ($body["tipo"] ?? "") === "comentario" ? "comentario" : "hilo";
    $itemId = (int)($body["itemId"] ?? $body["id"] ?? 0);
    $reporterGoogleId = trim($body["googleId"] ?? "");
    $motivo = htmlspecialchars(trim(mb_substr($body["motivo"] ?? "", 0, 200)), ENT_QUOTES, "UTF-8");

    if ($itemId <= 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Item inválido"]);
        exit;
    }

    if (empty($reporterGoogleId)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Debés identificarte para reportar contenido."]);
        exit;
    }

    $table = $tipo === "hilo" ? "hilos" : "comentarios";
    $stmtItem = $pdo->prepare("SELECT id, autor_google_id FROM {$table} WHERE id = ?");
    $stmtItem->execute([$itemId]);
    $item = $stmtItem->fetch();

    if (!$item) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Publicación no encontrada"]);
        exit;
    }

    if ($item["autor_google_id"] === $reporterGoogleId) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "No podés reportar tu propia publicación."]);
        exit;
    }

    // Validar si ya reportó este ítem
    $chkRep = $pdo->prepare("SELECT 1 FROM reportes WHERE item_tipo = ? AND item_id = ? AND reporter_google_id = ?");
    $chkRep->execute([$tipo, $itemId, $reporterGoogleId]);
    if ($chkRep->fetchColumn()) {
        echo json_encode(["status" => "ok", "message" => "Ya registraste un reporte para esta publicación previamente.", "alreadyReported" => true]);
        exit;
    }

    // Insertar reporte
    $insRep = $pdo->prepare("INSERT INTO reportes (item_tipo, item_id, reporter_google_id, motivo) VALUES (?, ?, ?, ?)");
    $insRep->execute([$tipo, $itemId, $reporterGoogleId, $motivo]);

    // Contar reportes de usuarios únicos
    $countStmt = $pdo->prepare("SELECT COUNT(DISTINCT reporter_google_id) FROM reportes WHERE item_tipo = ? AND item_id = ?");
    $countStmt->execute([$tipo, $itemId]);
    $totalRep = (int)$countStmt->fetchColumn();

    $pdo->prepare("UPDATE {$table} SET reportes = ? WHERE id = ?")->execute([$totalRep, $itemId]);
    if ($totalRep >= 3) {
        $pdo->prepare("UPDATE {$table} SET oculto = 1 WHERE id = ?")->execute([$itemId]);
    }

    echo json_encode(["status" => "ok", "message" => "Reporte registrado. Nuestro equipo lo revisará.", "reportes" => $totalRep]);
    exit;
}

http_response_code(400);
echo json_encode(["status" => "error", "message" => "Acción no reconocida"]);
