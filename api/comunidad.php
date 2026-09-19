<?php
/**
 * API REST de Noticias y Comunidad - Estudiantina de Posadas
 * estudiantina.online - Backend Hostinger con SQLite
 */

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Vary: Origin");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Cache-Control: no-cache, no-store, must-revalidate");

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method === "OPTIONS") {
    http_response_code(200);
    exit;
}

$dbPath = __DIR__ . "/../data/foro.db";
$comFile = __DIR__ . "/../data/comunidad.json";

$baseData = ["noticias" => [], "cronograma" => [], "guia" => [], "faq" => [], "ajustes" => []];
if (file_exists($comFile)) {
    $raw = @file_get_contents($comFile);
    if ($raw) {
        $parsed = json_decode($raw, true);
        if ($parsed) {
            $baseData["noticias"] = $parsed["noticias"] ?? [];
            $baseData["cronograma"] = $parsed["cronograma"] ?? [];
            $baseData["guia"] = $parsed["guia"] ?? $parsed["faq"] ?? [];
            $baseData["faq"] = $parsed["faq"] ?? $parsed["guia"] ?? [];
            $baseData["ajustes"] = $parsed["ajustes"] ?? [];
        }
    }
}

try {
    if (file_exists($dbPath)) {
        $pdo = new PDO("sqlite:" . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec("PRAGMA busy_timeout = 5000;");

        $stmt = $pdo->query("SELECT * FROM noticias ORDER BY fijada DESC, creada_en DESC");
        $rows = $stmt->fetchAll();

        if (empty($rows) && !empty($baseData["noticias"])) {
            $noticias = $baseData["noticias"];
        } else {
            $noticias = array_map(function($r) {
            $contenido = json_decode($r["contenido"] ?: "[]", true);
            $bloques = !empty($r["bloques"]) ? json_decode($r["bloques"], true) : null;
            if (!$bloques || !is_array($bloques) || count($bloques) === 0) {
                $bloques = array_values(array_filter(array_map(function($p) {
                    $val = is_string($p) ? $p : ($p["value"] ?? ($p["texto"] ?? ""));
                    return [
                        "type" => "text",
                        "value" => $val
                    ];
                }, is_array($contenido) ? $contenido : [$contenido]), function($b) {
                    return !empty($b["value"]);
                }));
            }
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
                "contenido" => $contenido,
                "bloques" => $bloques,
                "tags" => json_decode($r["tags"] ?: "[]", true),
                "imagen" => $r["imagen_url"] ?: "",
                "imagenUrl" => $r["imagen_url"] ?: "",
                "fijada" => (int)$r["fijada"] === 1
            ];
        }, $rows);
        }

        echo json_encode([
            "status" => "ok",
            "noticias" => $noticias,
            "cronograma" => $baseData["cronograma"],
            "guia" => $baseData["guia"],
            "faq" => $baseData["faq"],
            "ajustes" => $baseData["ajustes"]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
} catch (Exception $e) {
    // Fallback a comunidad.json directo si hay error
}

if (file_exists($comFile)) {
    echo file_get_contents($comFile);
    exit;
}

http_response_code(404);
echo json_encode(["status" => "error", "message" => "Datos no disponibles"]);
