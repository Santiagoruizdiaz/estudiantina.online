<?php
/**
 * API REST de Administración Segura - Estudiantina de Posadas
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
    $pdo = new PDO("sqlite:" . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec("PRAGMA journal_mode = WAL;");
    $pdo->exec("PRAGMA synchronous = NORMAL;");
    $pdo->exec("PRAGMA foreign_keys = ON;");
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error de base de datos: " . $e->getMessage()]);
    exit;
}

// Clave secreta para tokens HMAC y Token Maestro de Administración
$ADMIN_SECRET = getenv("ADMIN_SECRET") ?: "estudiantina_admin_secret_posadas_2026_key";
$ADMIN_TOKEN = getenv("ADMIN_TOKEN") ?: (getenv("ADMIN_SECRET") ?: "posadas_admin_2026_x9k2m");

// Tablas de Administración y Noticias
$pdo->exec("
CREATE TABLE IF NOT EXISTS administradores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    rol TEXT DEFAULT 'superadmin',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME
);

CREATE TABLE IF NOT EXISTS noticias (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    categoria_slug TEXT NOT NULL,
    fecha TEXT NOT NULL,
    autor TEXT NOT NULL,
    tiempo_lectura TEXT DEFAULT '3 min de lectura',
    badge TEXT DEFAULT 'NOTICIA',
    resumen TEXT NOT NULL,
    contenido TEXT NOT NULL,
    bloques TEXT,
    tags TEXT NOT NULL,
    imagen_url TEXT,
    fijada INTEGER DEFAULT 0,
    creada_en DATETIME DEFAULT CURRENT_TIMESTAMP
);
");
try { $pdo->exec("ALTER TABLE noticias ADD COLUMN bloques TEXT"); } catch (Exception $e) {}

// Sembrar admin inicial si está vacío
$stmtAdminCount = $pdo->query("SELECT COUNT(*) as count FROM administradores");
if ((int)$stmtAdminCount->fetchColumn() === 0) {
    $defaultSalt = bin2hex(random_bytes(16));
    $defaultHash = hash_pbkdf2("sha256", "Estudiantina2026!", $defaultSalt, 10000, 64);
    $stmtInsAdmin = $pdo->prepare("INSERT INTO administradores (usuario, password_hash, salt, rol) VALUES (?, ?, ?, ?)");
    $stmtInsAdmin->execute(["admin", $defaultHash, $defaultSalt, "superadmin"]);
}

// Helpers de Seguridad
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function generateAdminToken($admin, $secret) {
    $payload = [
        "id" => $admin["id"],
        "usuario" => $admin["usuario"],
        "rol" => $admin["rol"],
        "exp" => time() + (24 * 3600)
    ];
    $payloadB64 = base64url_encode(json_encode($payload));
    $sig = base64url_encode(hash_hmac("sha256", $payloadB64, $secret, true));
    return $payloadB64 . "." . $sig;
}

function verifyAdminToken($token, $secret, $masterToken = null) {
    if (!$token) return null;
    $clean = trim($token);
    if ($masterToken && hash_equals($masterToken, $clean)) {
        return ["id" => 1, "usuario" => "admin", "rol" => "superadmin"];
    }
    if ($secret && hash_equals($secret, $clean)) {
        return ["id" => 1, "usuario" => "admin", "rol" => "superadmin"];
    }
    if (strpos($clean, ".") === false) return null;
    $parts = explode(".", $clean);
    if (count($parts) !== 2) return null;
    list($payloadB64, $sig) = $parts;

    $expectedSig = base64url_encode(hash_hmac("sha256", $payloadB64, $secret, true));
    if (!hash_equals($expectedSig, $sig)) return null;

    $json = base64url_decode($payloadB64);
    $payload = json_decode($json, true);
    if (!$payload || !isset($payload["exp"]) || $payload["exp"] < time()) return null;

    return $payload;
}

function getAdminFromRequest($secret, $masterToken = null) {
    if ($masterToken === null && isset($GLOBALS["ADMIN_TOKEN"])) {
        $masterToken = $GLOBALS["ADMIN_TOKEN"];
    }
    $headers = getallheaders();
    $auth = isset($headers["Authorization"]) ? $headers["Authorization"] : (isset($headers["authorization"]) ? $headers["authorization"] : "");
    if (strpos($auth, "Bearer ") === 0) {
        $token = trim(substr($auth, 7));
        return verifyAdminToken($token, $secret, $masterToken);
    }
    return null;
}

function syncComunidadJson($pdo) {
    $comFile = __DIR__ . "/../data/comunidad.json";
    $currentData = ["noticias" => [], "cronograma" => [], "guia" => []];
    if (file_exists($comFile)) {
        $raw = @file_get_contents($comFile);
        if ($raw) {
            $parsed = json_decode($raw, true);
            if ($parsed) $currentData = $parsed;
        }
    }
    $stmt = $pdo->query("SELECT * FROM noticias ORDER BY fijada DESC, creada_en DESC");
    $rows = $stmt->fetchAll();
    $currentData["noticias"] = array_map(function($r) {
        return [
            "id" => $r["id"],
            "titulo" => $r["titulo"],
            "categoria" => $r["categoria"],
            "categoriaSlug" => $r["categoria_slug"],
            "fecha" => $r["fecha"],
            "autor" => $r["autor"],
            "tiempoLectura" => $r["tiempo_lectura"],
            "badge" => $r["badge"],
            "resumen" => $r["resumen"],
            "contenido" => json_decode($r["contenido"] ?: "[]", true),
            "bloques" => $r["bloques"] ? json_decode($r["bloques"], true) : null,
            "tags" => json_decode($r["tags"] ?: "[]", true),
            "imagen" => $r["imagen_url"] ?: "",
            "imagenUrl" => $r["imagen_url"] ?: ""
        ];
    }, $rows);
    @file_put_contents($comFile, json_encode($currentData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$action = isset($_GET["action"]) ? $_GET["action"] : "";

if ($method === "GET") {
    if ($action === "verificar") {
        $admin = getAdminFromRequest($ADMIN_SECRET);
        if (!$admin) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "No autorizado o token expirado"]);
            exit;
        }
        echo json_encode([
            "status" => "ok",
            "admin" => ["id" => $admin["id"], "usuario" => $admin["usuario"], "rol" => $admin["rol"]],
            "usuario" => $admin["usuario"],
            "rol" => $admin["rol"]
        ]);
        exit;
    }

    if ($action === "reportes") {
        $admin = getAdminFromRequest($ADMIN_SECRET);
        if (!$admin) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "No autorizado"]);
            exit;
        }
        $stmtH = $pdo->query("SELECT * FROM hilos WHERE reportes > 0 ORDER BY reportes DESC");
        $stmtC = $pdo->query("SELECT * FROM comentarios WHERE reportes > 0 ORDER BY reportes DESC");
        $hilos = $stmtH->fetchAll();
        $comentarios = $stmtC->fetchAll();
        echo json_encode([
            "status" => "ok",
            "hilosReportados" => $hilos,
            "hilos" => $hilos,
            "comentariosReportados" => $comentarios,
            "comentarios" => $comentarios
        ]);
        exit;
    }

    if ($action === "hilos") {
        $admin = getAdminFromRequest($ADMIN_SECRET);
        if (!$admin) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "No autorizado"]);
            exit;
        }
        $stmt = $pdo->query("
            SELECT h.*, (SELECT COUNT(*) FROM comentarios c WHERE c.hilo_id = h.id) as count_comentarios
            FROM hilos h
            ORDER BY h.fijado DESC, h.creado_en DESC
        ");
        $hilos = $stmt->fetchAll();
        echo json_encode(["status" => "ok", "hilos" => $hilos]);
        exit;
    }

    if ($action === "usuarios") {
        $admin = getAdminFromRequest($ADMIN_SECRET);
        if (!$admin) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "No autorizado"]);
            exit;
        }
        $stmt = $pdo->query("
            SELECT u.*,
              (SELECT COUNT(*) FROM hilos h WHERE h.autor_google_id = u.google_id) as total_hilos,
              (SELECT COUNT(*) FROM comentarios c WHERE c.autor_google_id = u.google_id) as total_comentarios
            FROM usuarios u
            ORDER BY u.creado_en DESC
        ");
        $usuarios = $stmt->fetchAll();
        echo json_encode(["status" => "ok", "usuarios" => $usuarios]);
        exit;
    }

    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Acción GET no reconocida"]);
    exit;
}

if ($method === "POST") {
    $input = file_get_contents("php://input");
    $body = json_decode($input, true) ?: [];

    // Login
    if ($action === "login") {
        $usuario = trim($body["usuario"] ?? "");
        $password = (string)($body["password"] ?? "");

        if (!$usuario || !$password) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Usuario y contraseña requeridos"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM administradores WHERE usuario = ?");
        $stmt->execute([$usuario]);
        $row = $stmt->fetch();

        if (!$row) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Credenciales inválidas"]);
            exit;
        }

        $calcHash = hash_pbkdf2("sha256", $password, $row["salt"], 10000, 64);
        if (!hash_equals($row["password_hash"], $calcHash)) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Credenciales inválidas"]);
            exit;
        }

        $stmtUp = $pdo->prepare("UPDATE administradores SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?");
        $stmtUp->execute([$row["id"]]);

        $token = generateAdminToken($row, $ADMIN_SECRET);
        echo json_encode([
            "status" => "ok",
            "token" => $token,
            "usuario" => $row["usuario"],
            "rol" => $row["rol"]
        ]);
        exit;
    }

    // Login directo mediante Token de Administración Maestro
    if ($action === "login_token") {
        $rawToken = trim((string)($body["token"] ?? ""));
        if (!$rawToken) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Token de administración requerido"]);
            exit;
        }
        $verified = verifyAdminToken($rawToken, $ADMIN_SECRET, $ADMIN_TOKEN);
        if (!$verified) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Token de administración inválido o no reconocido"]);
            exit;
        }
        echo json_encode([
            "status" => "ok",
            "token" => $rawToken,
            "usuario" => $verified["usuario"] ?? "admin",
            "rol" => $verified["rol"] ?? "superadmin",
            "admin" => $verified
        ]);
        exit;
    }

    // Requiere autenticación Bearer para el resto de acciones
    $admin = getAdminFromRequest($ADMIN_SECRET);
    if (!$admin) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Sesión no válida o expirada"]);
        exit;
    }

    if ($action === "cambiar_password") {
        $passwordActual = (string)($body["passwordActual"] ?? "");
        $passwordNueva = (string)($body["passwordNueva"] ?? "");

        if (!$passwordActual || strlen($passwordNueva) < 6) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "La nueva contraseña debe tener al menos 6 caracteres"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM administradores WHERE id = ?");
        $stmt->execute([$admin["id"]]);
        $row = $stmt->fetch();

        if (!$row) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Administrador no encontrado"]);
            exit;
        }

        $calcHash = hash_pbkdf2("sha256", $passwordActual, $row["salt"], 10000, 64);
        if (!hash_equals($row["password_hash"], $calcHash)) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "La contraseña actual es incorrecta"]);
            exit;
        }

        $newSalt = bin2hex(random_bytes(16));
        $newHash = hash_pbkdf2("sha256", $passwordNueva, $newSalt, 10000, 64);
        $stmtUp = $pdo->prepare("UPDATE administradores SET password_hash = ?, salt = ? WHERE id = ?");
        $stmtUp->execute([$newHash, $newSalt, $admin["id"]]);

        echo json_encode(["status" => "ok", "message" => "Contraseña actualizada exitosamente"]);
        exit;
    }

    if ($action === "crear_noticia") {
        $titulo = trim($body["titulo"] ?? "");
        $categoria = trim($body["categoria"] ?? "Noches de Calle");
        $categoriaSlug = trim($body["categoriaSlug"] ?? "noches-de-calle");
        $badge = strtoupper(trim($body["badge"] ?? "NOTICIA"));
        $resumen = trim($body["resumen"] ?? "");
        $autor = trim($body["autor"] ?? "Redacción Oficial");
        $tiempoLectura = trim($body["tiempoLectura"] ?? "3 min de lectura");
        
        $tags = $body["tags"] ?? [];
        if (is_string($tags)) {
            $tags = array_filter(array_map('trim', explode(',', $tags)));
        }
        
        $bloques = isset($body["bloques"]) && is_array($body["bloques"]) ? $body["bloques"] : null;
        $contenido = $body["contenido"] ?? [];
        if ($bloques && count($bloques) > 0) {
            $contenido = [];
            foreach ($bloques as $b) {
                if (($b["type"] ?? "") === "text" && !empty($b["value"])) {
                    $contenido[] = $b["value"];
                }
            }
            if (empty($contenido)) $contenido = [$resumen];
        } else {
            if (is_string($contenido)) {
                $contenido = array_filter(array_map('trim', explode("\n\n", $contenido)));
            }
            if (empty($contenido)) {
                $contenido = [$resumen];
            }
            $bloques = array_map(function($p) { return ["type" => "text", "value" => $p]; }, $contenido);
        }

        if (!$titulo || !$resumen) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Título y resumen requeridos"]);
            exit;
        }

        $id = "noticia-" . time();
        $fecha = date("d/m/Y");
        $imagenUrl = trim($body["imagen"] ?? $body["imagenUrl"] ?? "");
        $fijada = !empty($body["fijada"]) ? 1 : 0;

        $stmt = $pdo->prepare("
            INSERT INTO noticias (id, titulo, categoria, categoria_slug, fecha, autor, tiempo_lectura, badge, resumen, contenido, bloques, tags, imagen_url, fijada)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id,
            $titulo,
            $categoria,
            $categoriaSlug,
            $fecha,
            $autor,
            $tiempoLectura,
            $badge,
            $resumen,
            json_encode($contenido, JSON_UNESCAPED_UNICODE),
            json_encode($bloques, JSON_UNESCAPED_UNICODE),
            json_encode(array_values($tags), JSON_UNESCAPED_UNICODE),
            $imagenUrl,
            $fijada
        ]);

        syncComunidadJson($pdo);

        echo json_encode([
            "status" => "ok",
            "noticiaId" => $id,
            "noticia" => [
                "id" => $id,
                "titulo" => $titulo,
                "categoria" => $categoria,
                "categoriaSlug" => $categoriaSlug,
                "fecha" => $fecha,
                "autor" => $autor,
                "tiempoLectura" => $tiempoLectura,
                "badge" => $badge,
                "resumen" => $resumen,
                "contenido" => $contenido,
                "bloques" => $bloques,
                "tags" => array_values($tags),
                "imagen" => $imagenUrl,
                "imagenUrl" => $imagenUrl,
                "fijada" => $fijada === 1
            ]
        ]);
        exit;
    }

    if ($action === "editar_noticia") {
        $id = trim($body["id"] ?? "");
        $titulo = trim($body["titulo"] ?? "");
        $categoria = trim($body["categoria"] ?? "Noches de Calle");
        $categoriaSlug = trim($body["categoriaSlug"] ?? "noches-de-calle");
        $badge = strtoupper(trim($body["badge"] ?? "NOTICIA"));
        $resumen = trim($body["resumen"] ?? "");
        $autor = trim($body["autor"] ?? "Redacción Oficial");
        $tiempoLectura = trim($body["tiempoLectura"] ?? "3 min de lectura");
        $imagenUrl = trim($body["imagen"] ?? $body["imagenUrl"] ?? "");
        $fijada = !empty($body["fijada"]) ? 1 : 0;
        
        $tags = $body["tags"] ?? [];
        if (is_string($tags)) {
            $tags = array_filter(array_map('trim', explode(',', $tags)));
        }
        
        $bloques = isset($body["bloques"]) && is_array($body["bloques"]) ? $body["bloques"] : null;
        $contenido = $body["contenido"] ?? [];
        if ($bloques && count($bloques) > 0) {
            $contenido = [];
            foreach ($bloques as $b) {
                if (($b["type"] ?? "") === "text" && !empty($b["value"])) {
                    $contenido[] = $b["value"];
                }
            }
            if (empty($contenido)) $contenido = [$resumen];
        } else {
            if (is_string($contenido)) {
                $contenido = array_filter(array_map('trim', explode("\n\n", $contenido)));
            }
            if (empty($contenido)) {
                $contenido = [$resumen];
            }
            $bloques = array_map(function($p) { return ["type" => "text", "value" => $p]; }, $contenido);
        }

        if (!$id || !$titulo || !$resumen) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID, título y resumen requeridos"]);
            exit;
        }

        $stmt = $pdo->prepare("
            UPDATE noticias 
            SET titulo = ?, categoria = ?, categoria_slug = ?, badge = ?, autor = ?, tiempo_lectura = ?, resumen = ?, contenido = ?, bloques = ?, tags = ?, imagen_url = ?, fijada = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $titulo,
            $categoria,
            $categoriaSlug,
            $badge,
            $autor,
            $tiempoLectura,
            $resumen,
            json_encode($contenido, JSON_UNESCAPED_UNICODE),
            json_encode($bloques, JSON_UNESCAPED_UNICODE),
            json_encode(array_values($tags), JSON_UNESCAPED_UNICODE),
            $imagenUrl,
            $fijada,
            $id
        ]);

        syncComunidadJson($pdo);

        echo json_encode([
            "status" => "ok",
            "message" => "Noticia actualizada con éxito",
            "noticia" => [
                "id" => $id,
                "titulo" => $titulo,
                "categoria" => $categoria,
                "categoriaSlug" => $categoriaSlug,
                "badge" => $badge,
                "autor" => $autor,
                "tiempoLectura" => $tiempoLectura,
                "resumen" => $resumen,
                "contenido" => $contenido,
                "bloques" => $bloques,
                "tags" => array_values($tags),
                "imagen" => $imagenUrl,
                "imagenUrl" => $imagenUrl
            ]
        ]);
        exit;
    }

    if ($action === "guardar_cronograma") {
        $cronograma = is_array($body["cronograma"] ?? null) ? $body["cronograma"] : [];
        $comFile = __DIR__ . "/../data/comunidad.json";
        $cur = ["noticias" => [], "cronograma" => [], "guia" => [], "faq" => [], "ajustes" => []];
        if (file_exists($comFile)) {
            $raw = @file_get_contents($comFile);
            if ($raw) {
                $parsed = json_decode($raw, true);
                if ($parsed) $cur = $parsed;
            }
        }
        $cur["cronograma"] = $cronograma;
        @file_put_contents($comFile, json_encode($cur, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["status" => "ok", "message" => "Cronograma guardado con éxito", "cronograma" => $cronograma]);
        exit;
    }

    if ($action === "guardar_guia" || $action === "guardar_faq") {
        $faq = is_array($body["faq"] ?? null) ? $body["faq"] : (is_array($body["guia"] ?? null) ? $body["guia"] : []);
        $comFile = __DIR__ . "/../data/comunidad.json";
        $cur = ["noticias" => [], "cronograma" => [], "guia" => [], "faq" => [], "ajustes" => []];
        if (file_exists($comFile)) {
            $raw = @file_get_contents($comFile);
            if ($raw) {
                $parsed = json_decode($raw, true);
                if ($parsed) $cur = $parsed;
            }
        }
        $cur["faq"] = $faq;
        $cur["guia"] = $faq;
        @file_put_contents($comFile, json_encode($cur, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["status" => "ok", "message" => "Guía guardada con éxito", "faq" => $faq]);
        exit;
    }

    if ($action === "guardar_ajustes") {
        $ajustes = is_array($body["ajustes"] ?? null) ? $body["ajustes"] : $body;
        $comFile = __DIR__ . "/../data/comunidad.json";
        $cur = ["noticias" => [], "cronograma" => [], "guia" => [], "faq" => [], "ajustes" => []];
        if (file_exists($comFile)) {
            $raw = @file_get_contents($comFile);
            if ($raw) {
                $parsed = json_decode($raw, true);
                if ($parsed) $cur = $parsed;
            }
        }
        $cur["ajustes"] = array_merge($cur["ajustes"] ?? [], $ajustes);
        @file_put_contents($comFile, json_encode($cur, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["status" => "ok", "message" => "Ajustes del sitio actualizados", "ajustes" => $cur["ajustes"]]);
        exit;
    }

    if ($action === "borrar_noticia") {
        $id = trim($body["id"] ?? "");
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID requerido"]);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM noticias WHERE id = ?");
        $stmt->execute([$id]);
        syncComunidadJson($pdo);
        echo json_encode(["status" => "ok", "message" => "Noticia eliminada"]);
        exit;
    }

    if ($action === "borrar_hilo") {
        $hiloId = (int)($body["hiloId"] ?? $body["id"] ?? 0);
        if (!$hiloId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID de hilo requerido"]);
            exit;
        }
        $pdo->prepare("DELETE FROM comentarios WHERE hilo_id = ?")->execute([$hiloId]);
        $pdo->prepare("DELETE FROM votos WHERE item_tipo = 'hilo' AND item_id = ?")->execute([$hiloId]);
        $pdo->prepare("DELETE FROM hilos WHERE id = ?")->execute([$hiloId]);
        echo json_encode(["status" => "ok", "message" => "Hilo eliminado"]);
        exit;
    }

    if ($action === "borrar_comentario") {
        $comentarioId = (int)($body["comentarioId"] ?? $body["id"] ?? 0);
        if (!$comentarioId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID de comentario requerido"]);
            exit;
        }
        $stmtC = $pdo->prepare("SELECT hilo_id FROM comentarios WHERE id = ?");
        $stmtC->execute([$comentarioId]);
        $c = $stmtC->fetch();
        if ($c) {
            $pdo->prepare("DELETE FROM comentarios WHERE id = ?")->execute([$comentarioId]);
            $pdo->prepare("UPDATE hilos SET respuestas_count = MAX(0, respuestas_count - 1) WHERE id = ?")->execute([$c["hilo_id"]]);
        }
        echo json_encode(["status" => "ok", "message" => "Comentario eliminado"]);
        exit;
    }

    if ($action === "fijar_hilo") {
        $hiloId = (int)($body["hiloId"] ?? $body["id"] ?? 0);
        $stmtH = $pdo->prepare("SELECT fijado FROM hilos WHERE id = ?");
        $stmtH->execute([$hiloId]);
        $hilo = $stmtH->fetch();
        if (!$hilo) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Hilo no encontrado"]);
            exit;
        }
        $nuevo = isset($body["fijar"]) ? ((int)$body["fijar"] === 1 ? 1 : 0) : (((int)$hilo["fijado"] === 1) ? 0 : 1);
        $pdo->prepare("UPDATE hilos SET fijado = ? WHERE id = ?")->execute([$nuevo, $hiloId]);
        echo json_encode(["status" => "ok", "fijado" => $nuevo]);
        exit;
    }

    if ($action === "moderar_reporte") {
        $tipo = ($body["tipo"] ?? "hilo") === "comentario" ? "comentario" : "hilo";
        $id = (int)($body["id"] ?? 0);
        $resolucion = strtolower((string)($body["accion"] ?? $body["resolucion"] ?? "descartar"));

        if ($resolucion === "descartar" || $resolucion === "aprobar") {
            $table = ($tipo === "hilo") ? "hilos" : "comentarios";
            $pdo->prepare("UPDATE {$table} SET reportes = 0, oculto = 0 WHERE id = ?")->execute([$id]);
            echo json_encode(["status" => "ok", "message" => "Denuncia descartada"]);
            exit;
        }

        if ($resolucion === "eliminar" || $resolucion === "borrar") {
            if ($tipo === "hilo") {
                $pdo->prepare("DELETE FROM comentarios WHERE hilo_id = ?")->execute([$id]);
                $pdo->prepare("DELETE FROM votos WHERE item_tipo = 'hilo' AND item_id = ?")->execute([$id]);
                $pdo->prepare("DELETE FROM hilos WHERE id = ?")->execute([$id]);
            } else {
                $stmtC = $pdo->prepare("SELECT hilo_id FROM comentarios WHERE id = ?");
                $stmtC->execute([$id]);
                $c = $stmtC->fetch();
                if ($c) {
                    $pdo->prepare("DELETE FROM comentarios WHERE id = ?")->execute([$id]);
                    $pdo->prepare("UPDATE hilos SET respuestas_count = MAX(0, respuestas_count - 1) WHERE id = ?")->execute([$c["hilo_id"]]);
                }
            }
            echo json_encode(["status" => "ok", "message" => "Contenido eliminado"]);
            exit;
        }
    }

    // Moderación: Sancionar / Desbanear Usuario
    if ($action === "sancionar_usuario") {
        $googleId = trim($body["googleId"] ?? "");
        $tipoSancion = strtolower(trim($body["tipoSancion"] ?? "suspender"));
        $motivo = htmlspecialchars(trim(mb_substr($body["motivo"] ?? "", 0, 500)), ENT_QUOTES, "UTF-8");
        $duracionHoras = (int)($body["duracionHoras"] ?? 24);

        if (empty($googleId)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID de usuario requerido"]);
            exit;
        }

        // Asegurar que el usuario exista
        $stmtChk = $pdo->prepare("SELECT * FROM usuarios WHERE google_id = ?");
        $stmtChk->execute([$googleId]);
        $user = $stmtChk->fetch();
        if (!$user) {
            $stmtInfo = $pdo->prepare("SELECT autor_nombre, autor_avatar, colegio_id FROM hilos WHERE autor_google_id = ? UNION SELECT autor_nombre, autor_avatar, colegio_id FROM comentarios WHERE autor_google_id = ? LIMIT 1");
            $stmtInfo->execute([$googleId, $googleId]);
            $autorInfo = $stmtInfo->fetch();
            $nombre = $autorInfo ? $autorInfo["autor_nombre"] : "Usuario " . substr($googleId, -4);
            $avatar = $autorInfo ? $autorInfo["autor_avatar"] : "";
            $col = $autorInfo ? $autorInfo["colegio_id"] : "janssen";
            $pdo->prepare("INSERT INTO usuarios (google_id, nombre, avatar_url, colegio_id) VALUES (?, ?, ?, ?)")->execute([$googleId, $nombre, $avatar, $col]);
        }

        if ($tipoSancion === "desbanear" || $tipoSancion === "levantar") {
            $pdo->prepare("UPDATE usuarios SET estado = 'activo', motivo_sancion = NULL, sancionado_hasta = NULL, sancionado_por = NULL, sancionado_en = NULL WHERE google_id = ?")->execute([$googleId]);
            echo json_encode(["status" => "ok", "message" => "Sanción levantada. El usuario ahora está activo."]);
            exit;
        }

        if ($tipoSancion === "banear") {
            $pdo->prepare("UPDATE usuarios SET estado = 'baneado', motivo_sancion = ?, sancionado_hasta = NULL, sancionado_por = ?, sancionado_en = CURRENT_TIMESTAMP WHERE google_id = ?")->execute([$motivo ?: "Violación grave de las normas de convivencia", $admin["usuario"] ?? "admin", $googleId]);
            echo json_encode(["status" => "ok", "message" => "Usuario baneado permanentemente."]);
            exit;
        }

        if ($tipoSancion === "suspender") {
            $horas = $duracionHoras > 0 ? $duracionHoras : 24;
            $hasta = date("Y-m-d H:i:s", time() + ($horas * 3600));
            $pdo->prepare("UPDATE usuarios SET estado = 'suspendido', motivo_sancion = ?, sancionado_hasta = ?, sancionado_por = ?, sancionado_en = CURRENT_TIMESTAMP WHERE google_id = ?")->execute([$motivo ?: "Suspensión temporal por {$horas}h", $hasta, $admin["usuario"] ?? "admin", $googleId]);
            echo json_encode(["status" => "ok", "message" => "Usuario suspendido hasta " . date("d/m/Y H:i", strtotime($hasta)) . ".", "hasta" => $hasta]);
            exit;
        }

        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Tipo de sanción no válido"]);
        exit;
    }

    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Acción POST no válida"]);
    exit;
}
