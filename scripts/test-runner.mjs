import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const dataDir = path.join(projectRoot, "data");

function cleanTestDbs() {
  try {
    const files = fs.readdirSync(dataDir);
    for (const file of files) {
      if (file.includes(".test.db")) {
        try { fs.unlinkSync(path.join(dataDir, file)); } catch {}
      }
    }
  } catch {}
}

cleanTestDbs();

console.log("🧪 Ejecutando suite de pruebas automatizadas en Estudiantina.online...\n");

const result = spawnSync(
  process.execPath,
  ["--test", "--test-concurrency=1", "tests/simulador.test.mjs", "tests/api.test.mjs", "tests/foro.test.mjs"],
  {
    cwd: projectRoot,
    stdio: "inherit"
  }
);

cleanTestDbs();

if (result.status !== 0) {
  console.error("\n❌ Las pruebas fallaron.");
  process.exit(result.status || 1);
} else {
  console.log("\n✅ Todas las pruebas unitarias y de integración pasaron satisfactoriamente.");
  process.exit(0);
}
