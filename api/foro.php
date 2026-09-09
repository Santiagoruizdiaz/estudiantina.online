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

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$dbPath = __DIR__ . "/../data/foro.db";
$dbDir = dirname($dbPath);
if (!is_dir($dbDir)) {
    @mkdir($dbDir, 0755, true);
}

try {
    $pdo = new PDO("sqlite:" . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    // Habilitar Write-Ahead Logging para concurrencia de lecturas y escrituras
    $pdo->exec("PRAGMA journal_mode = WAL;");
    $pdo->exec("PRAGMA synchronous = NORMAL;");
    $pdo->exec("PRAGMA foreign_keys = ON;");
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
");

// Insertar canales iniciales si está vacía la tabla
$checkCanales = $pdo->query("SELECT COUNT(*) FROM canales")->fetchColumn();
if ($checkCanales == 0) {
    $ins = $pdo->prepare("INSERT INTO canales (id, titulo, descripcion, icono, color) VALUES (?, ?, ?, ?, ?)");
    $canalesInit = [
        ["general", "General & Comunidad", "Debates abiertos, anécdotas y actualidad de la Estudiantina.", "💬", "#38bdf8"],
        ["banda", "Banda de Música", "Arreglos, redoblantes, chanchas, cortes y ritmos.", "🥁", "#f59e0b"],
        ["baile", "Cuerpo de Baile", "Coreografías, temáticas, trajes, tocados y evolución en calle.", "💃", "#ec4899"],
        ["hinchadas", "Tribunas & Hinchadas", "Cantos, banderas, color y aliento de cada colegio.", "📢", "#22c55e"],
        ["simulador", "Sugerencias del Juego", "Ideas, reportes de eventos y mejoras para el Simulador.", "🎮", "#a855f7"]
    ];
    foreach ($canalesInit as $c) {
        $ins->execute($c);
    }
}

// Sembrar hilos iniciales si no hay ninguno
$checkHilos = $pdo->query("SELECT COUNT(*) FROM hilos")->fetchColumn();
if ($checkHilos == 0) {
    $insHilo = $pdo->prepare("INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, votos, respuestas_count, fijado, creado_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $hilosSeed = [
        ["banda", "¡Ritmos y sincronización de las chanchas pesadas en la Costanera!", "¿Qué opinan de los cortes que prepararon los colegios técnicos este año? En las pruebas piloto se notó una potencia tremenda en los palcos.", "demo-user-1", "Lucas Percusión", "https://api.dicebear.com/7.x/bottts/svg?seed=Lucas", "janssen", 28, 2, 1, date("Y-m-d H:i:s", strtotime("-3 hours"))],
        ["baile", "¿Cómo influye el peso de los espaldares en las pasadas largas?", "Bailar 800 metros seguidos con plumas y tocados de pedrería demanda un físico tremendo. ¿Qué técnicas de respiración usan sus escuadras?", "demo-user-2", "Valentina Pasista", "https://api.dicebear.com/7.x/bottts/svg?seed=Valentina", "santa_maria", 34, 1, 0, date("Y-m-d H:i:s", strtotime("-5 hours"))],
        ["simulador", "Propuesta: Que se puedan personalizar los cortes de redoble en el juego", "Estaría genial que en las noches de calle del simulador puedas elegir ritmos acelerados o hacer solos de batería antes de entrar al palco.", "demo-user-3", "Agustín Gamer", "https://api.dicebear.com/7.x/bottts/svg?seed=Agustin", "industrial", 19, 1, 0, date("Y-m-d H:i:s", strtotime("-8 hours"))]
    ];
    foreach ($hilosSeed as $h) {
        $insHilo->execute($h);
    }

    // Comentarios seed
    $pdo->exec("
        INSERT INTO comentarios (hilo_id, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, votos, creado_en)
        VALUES (1, 'Totalmente de acuerdo, los cortes cruzados de chancha este año van a definir el primer puesto.', 'demo-user-2', 'Valentina Pasista', 'https://api.dicebear.com/7.x/bottts/svg?seed=Valentina', 'santa_maria', 5, datetime('now', '-2 hours')),
               (1, 'El secreto está en los redoblantes bien tensados, si no suenan secos se pierde en el viento del río.', 'demo-user-3', 'Agustín Gamer', 'https://api.dicebear.com/7.x/bottts/svg?seed=Agustin', 'industrial', 3, datetime('now', '-1 hours')),
               (2, 'Nosotras ensayamos con chalecos livianos para acostumbrarnos al peso de las plumas antes de las noches oficiales.', 'demo-user-1', 'Lucas Percusión', 'https://api.dicebear.com/7.x/bottts/svg?seed=Lucas', 'janssen', 6, datetime('now', '-3 hours')),
               (3, '¡Apoyo total! Poder elegir la velocidad del redoble en los palcos sumaría muchísima adrenalina al simulador.', 'demo-user-1', 'Lucas Percusión', 'https://api.dicebear.com/7.x/bottts/svg?seed=Lucas', 'janssen', 4, datetime('now', '-4 hours'));
    ");
}

$action = $_GET["action"] ?? "";

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
    echo json_encode(["status" => "ok", "canales" => $canales]);
    exit;
}

// -------------------------------------------------------------
// ACTION: HILOS (Paginados y ordenados)
// -------------------------------------------------------------
if ($action === "hilos") {
    $canal = $_GET["canal"] ?? "todos";
    $sort = $_GET["sort"] ?? "top"; // 'top' o 'recientes'
    $page = max(1, (int)($_GET["page"] ?? 1));
    $limit = 15;
    $offset = ($page - 1) * $limit;

    $sql = "SELECT h.* FROM hilos h WHERE h.oculto = 0";
    $params = [];

    if ($canal !== "todos" && !empty($canal)) {
        $sql .= " AND h.canal_id = ?";
        $params[] = $canal;
    }

    if ($sort === "recientes") {
        $sql .= " ORDER BY h.fijado DESC, h.creado_en DESC LIMIT $limit OFFSET $offset";
    } else {
        $sql .= " ORDER BY h.fijado DESC, h.votos DESC, h.creado_en DESC LIMIT $limit OFFSET $offset";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $hilos = $stmt->fetchAll();

    echo json_encode(["status" => "ok", "hilos" => $hilos]);
    exit;
}

// -------------------------------------------------------------
// ACTION: HILO DETALLE (con comentarios)
// -------------------------------------------------------------
if ($action === "hilo") {
    $id = (int)($_GET["id"] ?? 0);
    $stmt = $pdo->prepare("SELECT * FROM hilos WHERE id = ? AND oculto = 0");
    $stmt->execute([$id]);
    $hilo = $stmt->fetch();

    if (!$hilo) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Hilo no encontrado o eliminado"]);
        exit;
    }

    $stmtComentarios = $pdo->prepare("SELECT * FROM comentarios WHERE hilo_id = ? AND oculto = 0 ORDER BY creado_en ASC");
    $stmtComentarios->execute([$id]);
    $comentarios = $stmtComentarios->fetchAll();

    echo json_encode(["status" => "ok", "hilo" => $hilo, "comentarios" => $comentarios]);
    exit;
}

// -------------------------------------------------------------
// ACTION: AUTH GOOGLE (Guardar / Actualizar usuario)
// -------------------------------------------------------------
if ($action === "auth_google" && $_SERVER["REQUEST_METHOD"] === "POST") {
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
            nombre = excluded.nombre,
            email = excluded.email,
            avatar_url = excluded.avatar_url,
            colegio_id = excluded.colegio_id
    ");
    $stmt->execute([$googleId, $nombre, $email, $avatarUrl, $colegioId]);

    echo json_encode(["status" => "ok", "usuario" => [
        "googleId" => $googleId,
        "nombre" => $nombre,
        "avatarUrl" => $avatarUrl,
        "colegioId" => $colegioId
    ]]);
    exit;
}

// -------------------------------------------------------------
// ACTION: CREAR HILO
// -------------------------------------------------------------
if ($action === "crear_hilo" && $_SERVER["REQUEST_METHOD"] === "POST") {
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

    // Sanitización básica contra XSS
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
if ($action === "comentar" && $_SERVER["REQUEST_METHOD"] === "POST") {
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

    $contenido = htmlspecialchars($contenido, ENT_QUOTES, "UTF-8");
    $autorNombre = htmlspecialchars($autorNombre, ENT_QUOTES, "UTF-8");

    $stmt = $pdo->prepare("
        INSERT INTO comentarios (hilo_id, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$hiloId, $contenido, $googleId, $autorNombre, $autorAvatar, $colegioId]);

    // Incrementar contador de respuestas en el hilo
    $pdo->prepare("UPDATE hilos SET respuestas_count = respuestas_count + 1 WHERE id = ?")->execute([$hiloId]);

    echo json_encode(["status" => "ok", "message" => "Respuesta enviada!"]);
    exit;
}

// -------------------------------------------------------------
// ACTION: VOTAR (Toggle único por Google ID)
// -------------------------------------------------------------
if ($action === "votar" && $_SERVER["REQUEST_METHOD"] === "POST") {
    $body = json_decode(file_get_contents("php://input"), true);
    $tipo = $body["tipo"] === "comentario" ? "comentario" : "hilo";
    $itemId = (int)($body["itemId"] ?? 0);
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
// ACTION: REPORTAR (Auto-moderación con 3 reportes)
// -------------------------------------------------------------
if ($action === "reportar" && $_SERVER["REQUEST_METHOD"] === "POST") {
    $body = json_decode(file_get_contents("php://input"), true);
    $tipo = $body["tipo"] === "comentario" ? "comentario" : "hilo";
    $itemId = (int)($body["itemId"] ?? 0);

    if ($itemId <= 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Item inválido"]);
        exit;
    }

    $table = $tipo === "hilo" ? "hilos" : "comentarios";
    $pdo->prepare("UPDATE $table SET reportes = reportes + 1 WHERE id = ?")->execute([$itemId]);
    // Si acumula 3 o más reportes, se oculta preventivamente
    $pdo->prepare("UPDATE $table SET oculto = 1 WHERE id = ? AND reportes >= 3")->execute([$itemId]);

    echo json_encode(["status" => "ok", "message" => "Gracias por tu reporte. Nuestro equipo lo revisará."]);
    exit;
}

http_response_code(400);
echo json_encode(["status" => "error", "message" => "Acción no reconocida"]);
