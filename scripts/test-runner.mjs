import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("🧪 Ejecutando suite de pruebas automatizadas en Estudiantina.online...\n");

const result = spawnSync(
  process.execPath,
  ["--test", "tests/simulador.test.mjs", "tests/api.test.mjs"],
  {
    cwd: projectRoot,
    stdio: "inherit"
  }
);

if (result.status !== 0) {
  console.error("\n❌ Las pruebas fallaron.");
  process.exit(result.status || 1);
} else {
  console.log("\n✅ Todas las pruebas unitarias y de integración pasaron satisfactoriamente.");
  process.exit(0);
}
