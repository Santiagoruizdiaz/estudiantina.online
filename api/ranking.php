<?php
/**
 * API Global de Ranking y Salón de la Fama - Estudiantina de Posadas
 * estudiantina.online
 */

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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

$dataFile = __DIR__ . "/../data/ranking.json";

const COLEGIOS_WHITELIST = [
    "janssen","industrial","santa_maria","roque","san_basilio",
    "madre_misericordia","pedro_goyena","nacional","normal_mixta",
    "humanista","cep_4","virgen_itati","comercio_6","mborore",
    "san_alberto","del_carmen","jesus_nino","inmaculada","epet_2",
    "jesus_nazareth","comercio_8","lisandro_torre","epet_34","bop_9",
    "estrada","san_jorge","san_miguel","verbo_divino","normal_10",
    "comercio_18","santa_catalina","bop_1","epet_37"
];

function leerDatos($dataFile) {
    if (!file_exists($dataFile)) {
        return ["top10" => [], "colegios" => []];
    }
    $raw = @file_get_contents($dataFile);
    if (!$raw) {
        return ["top10" => [], "colegios" => []];
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return ["top10" => [], "colegios" => []];
    }
    if (!isset($decoded["top10"]) || !is_array($decoded["top10"])) {
        $decoded["top10"] = [];
    } else {
        $decoded["top10"] = array_values(array_filter($decoded["top10"], function($p) {
            $id = $p["colegioId"] ?? "";
            $nom = $p["colegioNombre"] ?? "";
            return $id !== "esmu" && stripos($nom, "esmu") === false;
        }));
    }
    if (!isset($decoded["colegios"]) || !is_array($decoded["colegios"])) {
        $decoded["colegios"] = [];
    } else {
        unset($decoded["colegios"]["esmu"]);
    }
    return $decoded;
}

/**
 * Mutación concurrente segura con bloqueo exclusivo vía flock
 * Escribe a archivo temporal y realiza rename atómico
 */
function withJsonLock($file, callable $mutator) {
    $dir = dirname($file);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    $lockFile = $file . ".lock";
    $lockFp = @fopen($lockFile, "c+");
    if (!$lockFp) {
        throw new Exception("No se pudo abrir archivo de lock");
    }
    if (!@flock($lockFp, LOCK_EX)) {
        @fclose($lockFp);
        throw new Exception("No se pudo adquirir el lock exclusivo");
    }

    try {
        $currentData = leerDatos($file);
        $result = $mutator($currentData);
        if (is_array($result)) {
            $json = json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            $tmpFile = tempnam($dir, "rnk_");
            if ($tmpFile === false) {
                throw new Exception("No se pudo crear archivo temporal");
            }
            if (@file_put_contents($tmpFile, $json) === false) {
                @unlink($tmpFile);
                throw new Exception("Error al escribir archivo temporal");
            }
            if (DIRECTORY_SEPARATOR === '\\' && file_exists($file)) {
                @unlink($file);
            }
            if (!@rename($tmpFile, $file)) {
                @unlink($tmpFile);
                throw new Exception("Error en rename atómico");
            }
        }
        @flock($lockFp, LOCK_UN);
        @fclose($lockFp);
        return $result;
    } catch (Throwable $e) {
        @flock($lockFp, LOCK_UN);
        @fclose($lockFp);
        throw $e;
    }
}

function guardarDatos($dataFile, $datos) {
    return withJsonLock($dataFile, function() use ($datos) {
        return $datos;
    });
}

function compararPorOVR($a, $b) {
    $ovrA = isset($a["ovr"]) ? (int)$a["ovr"] : 0;
    $ovrB = isset($b["ovr"]) ? (int)$b["ovr"] : 0;
    if ($ovrB !== $ovrA) return $ovrB - $ovrA;

    $oroA = isset($a["titulosOro"]) ? (int)$a["titulosOro"] : 0;
    $oroB = isset($b["titulosOro"]) ? (int)$b["titulosOro"] : 0;
    if ($oroB !== $oroA) return $oroB - $oroA;

    $podA = isset($a["podiosTotales"]) ? (int)$a["podiosTotales"] : 0;
    $podB = isset($b["podiosTotales"]) ? (int)$b["podiosTotales"] : 0;
    if ($podB !== $podA) return $podB - $podA;

    $ritA = isset($a["ritmo"]) ? (int)$a["ritmo"] : 0;
    $ritB = isset($b["ritmo"]) ? (int)$b["ritmo"] : 0;
    if ($ritB !== $ritA) return $ritB - $ritA;

    $hinA = isset($a["hinchada"]) ? (int)$a["hinchada"] : 0;
    $hinB = isset($b["hinchada"]) ? (int)$b["hinchada"] : 0;
    return $hinB - $hinA;
}

// 1. GET: Retorna el Top 10 global y estadísticas de colegios
if ($method === "GET") {
    $datos = leerDatos($dataFile);
    echo json_encode([
        "status" => "ok",
        "top10" => $datos["top10"],
        "colegios" => $datos["colegios"]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. POST: Registro de egresados o estadísticas
if ($method === "POST") {
    $input = file_get_contents("php://input");
    $body = json_decode($input, true);

    if (!is_array($body)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "JSON inválido"]);
        exit;
    }

    $action = isset($body["action"]) ? $body["action"] : "";

    try {
        if ($action === "registrarEgresado") {
            $egresado = isset($body["egresado"]) && is_array($body["egresado"]) ? $body["egresado"] : null;
            if (!$egresado) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Datos de egresado faltantes"]);
                exit;
            }

            $colegioId = preg_replace("/[^a-zA-Z0-9_\-]/", "", $egresado["colegioId"] ?? "");
            if (empty($colegioId) || !in_array($colegioId, COLEGIOS_WHITELIST, true)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Colegio no válido o no reconocido"]);
                exit;
            }

            $nombre = trim(substr(strip_tags($egresado["nombre"] ?? "Egresado"), 0, 30));
            $apodo = trim(substr(strip_tags($egresado["apodoJugador"] ?? ""), 0, 35));
            $colegioNombre = trim(substr(strip_tags($egresado["colegioNombre"] ?? ""), 0, 50));
            $colegioApodo = trim(substr(strip_tags($egresado["colegioApodo"] ?? ""), 0, 35));
            $escudo = trim(substr(strip_tags($egresado["escudo"] ?? "🥁"), 0, 10));
            $rubroNombre = trim(substr(strip_tags($egresado["rubroNombre"] ?? ""), 0, 40));
            $rolNombre = trim(substr(strip_tags($egresado["rolNombre"] ?? ""), 0, 40));

            $ovr = max(40, min(99, (int)($egresado["ovr"] ?? 50)));
            $titulosOro = max(0, min(8, (int)($egresado["titulosOro"] ?? 0)));
            $titulosChallenger = max(0, min(2, (int)($egresado["titulosChallenger"] ?? 0)));
            $podiosTotales = max(0, min(6, (int)($egresado["podiosTotales"] ?? 0)));
            $ritmo = max(10, min(99, (int)($egresado["ritmo"] ?? 50)));
            $hinchada = max(10, min(99, (int)($egresado["hinchada"] ?? 50)));
            $resistencia = max(10, min(99, (int)($egresado["resistencia"] ?? 50)));
            $anios = max(1, min(6, (int)($egresado["anios"] ?? 5)));
            $fecha = date("d/m/Y");

            $nuevoRegistro = [
                "id" => "global_" . round(microtime(true) * 1000) . "_" . bin2hex(random_bytes(8)),
                "nombre" => $nombre,
                "apodoJugador" => $apodo,
                "colegioId" => $colegioId,
                "colegioNombre" => $colegioNombre,
                "colegioApodo" => $colegioApodo,
                "escudo" => $escudo,
                "rubroNombre" => $rubroNombre,
                "rolNombre" => $rolNombre,
                "ovr" => $ovr,
                "titulosOro" => $titulosOro,
                "titulosChallenger" => $titulosChallenger,
                "podiosTotales" => $podiosTotales,
                "ritmo" => $ritmo,
                "hinchada" => $hinchada,
                "resistencia" => $resistencia,
                "anios" => $anios,
                "fecha" => $fecha
            ];

            $entroTop10 = false;
            $posicionOVR = 0;
            $top10Retorno = [];

            withJsonLock($dataFile, function($datos) use ($nuevoRegistro, &$entroTop10, &$posicionOVR, &$top10Retorno) {
                $candidatos = array_merge($datos["top10"], [$nuevoRegistro]);
                usort($candidatos, "compararPorOVR");

                foreach ($candidatos as $idx => $cand) {
                    if ($cand["id"] === $nuevoRegistro["id"]) {
                        $posicionOVR = $idx + 1;
                        break;
                    }
                }

                $entroTop10 = ($posicionOVR >= 1 && $posicionOVR <= 10);
                if ($entroTop10) {
                    $datos["top10"] = array_slice($candidatos, 0, 10);
                }
                $top10Retorno = $datos["top10"];
                return $datos;
            });

            echo json_encode([
                "status" => "ok",
                "entroTop10" => $entroTop10,
                "posicionOVR" => $posicionOVR,
                "registro" => $nuevoRegistro,
                "top10" => $top10Retorno
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if ($action === "registrarInicio") {
            $colegioId = preg_replace("/[^a-zA-Z0-9_\-]/", "", $body["colegioId"] ?? "");
            if (empty($colegioId) || !in_array($colegioId, COLEGIOS_WHITELIST, true)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Colegio no válido o no reconocido"]);
                exit;
            }

            withJsonLock($dataFile, function($datos) use ($colegioId) {
                if (!isset($datos["colegios"][$colegioId])) {
                    $datos["colegios"][$colegioId] = [
                        "partidasIniciadas" => 0,
                        "temporadasJugadas" => 0,
                        "titulosOro" => 0,
                        "podiosTotales" => 0
                    ];
                }
                $datos["colegios"][$colegioId]["partidasIniciadas"] = ($datos["colegios"][$colegioId]["partidasIniciadas"] ?? 0) + 1;
                return $datos;
            });

            echo json_encode(["status" => "ok"]);
            exit;
        }

        if ($action === "registrarTemporada") {
            $colegioId = preg_replace("/[^a-zA-Z0-9_\-]/", "", $body["colegioId"] ?? "");
            if (empty($colegioId) || !in_array($colegioId, COLEGIOS_WHITELIST, true)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Colegio no válido o no reconocido"]);
                exit;
            }

            $puesto = (int)($body["puesto"] ?? 0);

            withJsonLock($dataFile, function($datos) use ($colegioId, $puesto) {
                if (!isset($datos["colegios"][$colegioId])) {
                    $datos["colegios"][$colegioId] = [
                        "partidasIniciadas" => 0,
                        "temporadasJugadas" => 0,
                        "titulosOro" => 0,
                        "podiosTotales" => 0
                    ];
                }
                $datos["colegios"][$colegioId]["temporadasJugadas"] = ($datos["colegios"][$colegioId]["temporadasJugadas"] ?? 0) + 1;
                if ($puesto === 1) {
                    $datos["colegios"][$colegioId]["titulosOro"] = ($datos["colegios"][$colegioId]["titulosOro"] ?? 0) + 1;
                }
                if ($puesto >= 1 && $puesto <= 3) {
                    $datos["colegios"][$colegioId]["podiosTotales"] = ($datos["colegios"][$colegioId]["podiosTotales"] ?? 0) + 1;
                }
                return $datos;
            });

            echo json_encode(["status" => "ok"]);
            exit;
        }
    } catch (Throwable $e) {
        error_log("Error en ranking.php: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error interno del servidor"]);
        exit;
    }

    echo json_encode(["status" => "ignored"]);
    exit;
}
