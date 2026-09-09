import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("🔍 Iniciando chequeo estático de calidad y sintaxis en Estudiantina.online...\n");

let errors = 0;
let checked = 0;

// 1. Chequeo de archivos JSON
const jsonFiles = [
  "package.json",
  "data/ranking.example.json",
  "data/comunidad.example.json",
  ".agents/hooks.json",
  "site.webmanifest"
];

for (const relPath of jsonFiles) {
  const fullPath = path.join(projectRoot, relPath);
  if (!fs.existsSync(fullPath)) continue;
  try {
    const raw = fs.readFileSync(fullPath, "utf8");
    JSON.parse(raw);
    checked++;
  } catch (err) {
    console.error(`❌ Error de sintaxis JSON en ${relPath}:`, err.message);
    errors++;
  }
}

// 2. Chequeo de sintaxis JS/MJS usando node --check
const jsDirs = [
  projectRoot,
  path.join(projectRoot, "scripts"),
  path.join(projectRoot, "js"),
  path.join(projectRoot, "tests")
];

for (const dir of jsDirs) {
  if (!fs.existsSync(dir)) continue;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".mjs"))) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(projectRoot, fullPath);
      try {
        execFileSync(process.execPath, ["--check", fullPath], { stdio: "pipe" });
        checked++;
      } catch (err) {
        console.error(`❌ Error de sintaxis en ${relPath}:`, err.stderr?.toString() || err.message);
        errors++;
      }
    }
  }
}

// 3. Verificación de archivos PHP con php -l si está disponible
let phpBin = null;
const possiblePhpPaths = [
  "php",
  "C:\\wamp64\\bin\\php\\php8.2.29\\php.exe",
  "C:\\wamp64\\bin\\php\\php8.3.28\\php.exe",
  "C:\\wamp64\\bin\\php\\php8.1.33\\php.exe"
];

for (const p of possiblePhpPaths) {
  try {
    execFileSync(p, ["-v"], { stdio: "ignore" });
    phpBin = p;
    break;
  } catch (e) {}
}

const apiDir = path.join(projectRoot, "api");
if (fs.existsSync(apiDir)) {
  const phpFiles = fs.readdirSync(apiDir).filter(f => f.endsWith(".php"));
  for (const f of phpFiles) {
    const fullPath = path.join(apiDir, f);
    const relPath = path.relative(projectRoot, fullPath);
    if (phpBin) {
      try {
        execFileSync(phpBin, ["-l", fullPath], { stdio: "pipe" });
        checked++;
      } catch (err) {
        console.error(`❌ Error de sintaxis PHP en ${relPath}:`, err.stderr?.toString() || err.message);
        errors++;
      }
    } else {
      // Si no hay PHP binario disponible en el entorno, validar lectura
      fs.readFileSync(fullPath, "utf8");
      checked++;
    }
  }
}

// 4. Verificación de sitemap.xml
const sitemapPath = path.join(projectRoot, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  try {
    const xmlContent = fs.readFileSync(sitemapPath, "utf8");
    if (!xmlContent.includes("<urlset") || !xmlContent.includes("</urlset>")) {
      throw new Error("Estructura <urlset> inválida");
    }
    checked++;
  } catch (err) {
    console.error(`❌ Error en sitemap.xml:`, err.message);
    errors++;
  }
}

// 5. Verificación de integridad de archivos críticos
const requiredFiles = [
  "index.html",
  "comunidad.html",
  "noticia.html",
  "styles.css",
  "server.js",
  "package.json",
  "AGENTS.md",
  "AGENT-MATRIX.md",
  ".agents/hooks.json",
  "api/ranking.php",
  "api/comunidad.php",
  "api/foro.php",
  "api/admin.php",
  "sitemap.xml",
  "robots.txt"
];

for (const relPath of requiredFiles) {
  const fullPath = path.join(projectRoot, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Archivo crítico faltante: ${relPath}`);
    errors++;
  } else {
    checked++;
  }
}

console.log(`\n📊 Verificación completada: ${checked} elementos analizados.`);

if (errors > 0) {
  console.error(`\n🚨 Fallaron ${errors} chequeos de sintaxis o integridad.`);
  process.exit(1);
} else {
  console.log("✅ Todos los chequeos de sintaxis e integridad pasaron con éxito.");
  process.exit(0);
}
