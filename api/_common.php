<?php
/**
 * Utilidades compartidas de la API PHP (Hostinger) - Estudiantina de Posadas
 * Validación central de entradas, errores siempre en JSON y configuración de entorno.
 * No es un endpoint: cada archivo de api/ lo incluye con require_once.
 */

// Acceso HTTP directo a este archivo: responder como si no existiera
if (realpath($_SERVER["SCRIPT_FILENAME"] ?? "") === __FILE__) {
    http_response_code(404);
    exit;
}

function api_send_error(int $status, string $message): void {
    if (!headers_sent()) {
        http_response_code($status);
        header("Content-Type: application/json; charset=utf-8");
    }
    echo json_encode(["status" => "error", "message" => $message]);
}

// Excepciones no capturadas: nunca un 500 con cuerpo vacío ni detalles internos.
// Un TypeError/ValueError proviene de datos con tipo inesperado (ej. un array donde se espera texto).
set_exception_handler(function (Throwable $e) {
    error_log(sprintf("[api] %s en %s:%d: %s", get_class($e), basename($e->getFile()), $e->getLine(), $e->getMessage()));
    if ($e instanceof TypeError || $e instanceof ValueError) {
        api_send_error(400, "Datos de la petición con formato inválido");
    } else {
        api_send_error(500, "Error interno del servidor");
    }
});

// Ningún endpoint acepta arrays en la query string (?q[]=x)
(function () {
    foreach ($_GET as $value) {
        if (!is_string($value)) {
            api_send_error(400, "Parámetro de consulta inválido");
            exit;
        }
    }
})();

// Carga de variables de entorno desde .env en la raíz (sin pisar las ya definidas)
function api_load_env(string $envPath): void {
    if (!is_file($envPath)) return;
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines ?: [] as $line) {
        $line = trim($line);
        if (empty($line) || str_starts_with($line, "#")) continue;
        $parts = explode("=", $line, 2);
        if (count($parts) === 2) {
            $k = trim($parts[0]);
            $v = trim($parts[1], " \t\n\r\0\x0B\"'");
            if (getenv($k) === false) {
                putenv("$k=$v");
                $_ENV[$k] = $v;
            }
        }
    }
}
api_load_env(__DIR__ . "/../.env");

// Conexión local real (REMOTE_ADDR); nunca se usan cabeceras del cliente como Host o SERVER_NAME
function api_is_local_request(): bool {
    return in_array($_SERVER["REMOTE_ADDR"] ?? "", ["127.0.0.1", "::1"], true);
}

// Entorno configurado con NODE_ENV o APP_ENV; sin configuración, desarrollo solo para conexiones locales
function api_env_name(): string {
    $env = getenv("NODE_ENV") ?: (getenv("APP_ENV") ?: "");
    if ($env !== "") return strtolower(trim($env));
    return api_is_local_request() ? "development" : "production";
}

// Los modos development/test (secretos de desarrollo, mocks) solo aplican a conexiones locales:
// un .env de producción copiado de .env.example con NODE_ENV=development sigue fallando cerrado
function api_is_production(): bool {
    return !(in_array(api_env_name(), ["development", "test"], true) && api_is_local_request());
}

// IP del cliente para rate limiting: X-Forwarded-For lo controla el cliente y no es confiable
function api_client_ip(): string {
    return $_SERVER["REMOTE_ADDR"] ?? "unknown";
}

// Cuerpo JSON de la petición: vacío equivale a {}; JSON inválido o escalar responde 400
function api_json_body(): array {
    $raw = file_get_contents("php://input");
    if ($raw === false || trim($raw) === "") return [];
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        api_send_error(400, "JSON inválido");
        exit;
    }
    return $data;
}

// Valor escalar como texto; arrays/objetos se reemplazan por $default
function api_scalar_str($value, string $default = ""): string {
    return is_scalar($value) ? (string)$value : $default;
}

// Truncado por caracteres (no bytes) para no producir UTF-8 inválido
function api_truncate(string $value, int $maxChars): string {
    return mb_substr($value, 0, $maxChars, "UTF-8");
}

// Serialización para persistir en disco: lanza excepción en lugar de devolver false (evita escribir archivos vacíos)
function api_json_encode_file($data): string {
    return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
}
