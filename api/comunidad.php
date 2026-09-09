<?php
/**
 * API REST de Noticias y Comunidad - Estudiantina de Posadas
 * estudiantina.online - Backend Hostinger con SQLite
 */

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Cache-Control: no-cache, no-store, must-revalidate");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$dbPath = __DIR__ . "/../data/foro.db";
$comFile = __DIR__ . "/../data/comunidad.json";

$baseData = ["cronograma" => [], "guia" => [], "faq" => [], "ajustes" => []];
if (file_exists($comFile)) {
    $raw = @file_get_contents($comFile);
    if ($raw) {
        $parsed = json_decode($raw, true);
        if ($parsed) {
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

        $stmt = $pdo->query("SELECT * FROM noticias ORDER BY fijada DESC, creada_en DESC");
        $rows = $stmt->fetchAll();

        $noticias = array_map(function($r) {
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
                "tags" => json_decode($r["tags"] ?: "[]", true),
                "imagen" => $r["imagen_url"] ?: "",
                "imagenUrl" => $r["imagen_url"] ?: "",
                "fijada" => (int)$r["fijada"] === 1
            ];
        }, $rows);

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
