const rawInput = await readStdin();

if (rawInput.trim().length === 0) {
  emitDecision({ decision: "allow", reason: "No command payload was provided." });
  process.exit(0);
}

let payload;

try {
  payload = JSON.parse(rawInput);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown JSON parse error.";
  emitDecision({ decision: "deny", reason: "Invalid hook payload: " + message });
  process.exit(0);
}

const commandLine = extractCommandLine(payload);
// Normalizar guiones unicode (– U+2013, — U+2014, − U+2212, etc.) a guion estándar
const normalizedCommandLine = commandLine.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-");

const denyPatterns = [
  // rm destructivo: flags combinados (-rf, -fr) o separados (-r -f, -f -r, --recursive --force)
  // con soporte para guiones estándar y unicode (–, —)
  /\brm\s+[^;&|]*?[-–—][a-z0-9]*[rf][a-z0-9]*[rf]/i,
  /\brm\s+[^;&|]*?(?:[-–—]+(?:r\b|recursive\b)|[-–—][a-z0-9]*r\b)[^;&|]*?(?:[-–—]+(?:f\b|force\b)|[-–—][a-z0-9]*f\b)/i,
  /\brm\s+[^;&|]*?(?:[-–—]+(?:f\b|force\b)|[-–—][a-z0-9]*f\b)[^;&|]*?(?:[-–—]+(?:r\b|recursive\b)|[-–—][a-z0-9]*r\b)/i,
  /\b(?:Remove-Item|rm|ri)\s+[^;&|]*?[-–—]+(?:Recurse\b|r\b)[^;&|]*?[-–—]+(?:Force\b|f\b)/i,
  /\b(?:Remove-Item|rm|ri)\s+[^;&|]*?[-–—]+(?:Force\b|f\b)[^;&|]*?[-–—]+(?:Recurse\b|r\b)/i,

  // Borrado recursivo y destructivo en Windows (cmd / PowerShell)
  /\brmdir\s+[^;&|]*?[\/\-–—]s\b/i,
  /\bdel\s+[^;&|]*?[\/\-–—]s\b/i,

  // Comandos recursivos destructivos (find . -delete, chmod -R 000 .)
  /\bfind\s+[^;&|]*?[-–—]+delete\b/i,
  /\bchmod\s+[^;&|]*?(?:[-–—]+R\b[^;&|]*?\b000\b|\b000\b[^;&|]*?[-–—]+R\b)/i,

  // Operaciones de Git destructivas
  /\bgit\s+reset\s+[^;&|]*?[-–—]+hard\b/i,
  /\bgit\s+clean\s+[^;&|]*?[-–—]+[a-z0-9]*f/i,

  // Git push --force o git push -f con cualquier origen o rama (ej. git push origin main -f, git push -f)
  /\bgit\s+push\b[^;&|]*?(?:[-–—]+(?:f\b|force\b|force-with-lease\b)|\s+\+[a-zA-Z0-9_\-\/\.]+)/i,

  // Base de datos y migraciones destructivas
  /\bprisma\s+migrate\s+reset\b/i,
  /\bDROP\s+(DATABASE|SCHEMA)\b/i,
];

const approvalPatterns = [
  /\b(?:prisma|npx\s+prisma|pnpm\s+prisma)\s+migrate\s+(?:dev|deploy)\b/i,
  /\bdocker\s+(?:rm|system\s+prune)\b/i,
  /\bterraform\s+(?:apply|destroy)\b/i,
  /\bgit\s+push\b/i,
];

const secretPatterns = [
  // Detección de lectura de secretos: captura variantes de ruta para archivos .env
  // (ej. cat .env, cat ./.env, cat */.env, Get-Content .env, type .env, .\.env, dir/.env)
  /(?:^|[\s"'=;`|<>&()\/\\*?])(?:[\w\-.~*?\/\\$]+[\\/])?\.env(?:\.(?!example\b)[A-Za-z0-9._-]+)?(?=$|[\s"'=;`|<>&()\/\\*?:])/i,
  /\b(?:cat|type|Get-Content|gc|head|tail|more|less)\b[^;&|]*?(?:[\w\-.~*?\/\\$]+[\\/])?\.env(?:\.(?!example\b)[A-Za-z0-9._-]+)?/i,
  /id_rsa|id_ed25519|[\\/]\.ssh[\\/]/i,
];

const matchesAny = (patterns) =>
  patterns.some((pattern) => pattern.test(commandLine) || pattern.test(normalizedCommandLine));

if (matchesAny(denyPatterns)) {
  emitDecision({ decision: "deny", reason: "Blocked destructive or irreversible command." });
} else if (matchesAny(secretPatterns)) {
  emitDecision({ decision: "deny", reason: "Direct secret or credential file access is blocked." });
} else if (matchesAny(approvalPatterns)) {
  emitDecision({ decision: "force_ask", reason: "External-state, migration, history or infrastructure operation requires explicit approval." });
} else {
  emitDecision({ decision: "allow", reason: "Command passed the safety gate." });
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", (error) => reject(error));
  });
}

function extractCommandLine(value) {
  if (typeof value !== "object" || value === null) {
    return "";
  }

  const toolCall = value.toolCall;
  if (typeof toolCall !== "object" || toolCall === null) {
    return "";
  }

  const args = toolCall.args;
  if (typeof args !== "object" || args === null) {
    return "";
  }

  const command = args.CommandLine ?? args.commandLine ?? args.command;
  return typeof command === "string" ? command : "";
}

function emitDecision(decision) {
  process.stdout.write(JSON.stringify(decision) + "\n");
}
