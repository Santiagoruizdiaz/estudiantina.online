import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverPath = path.resolve(__dirname, "../server.js");

const TEST_PORT = 3899;
const BASE_URL = `http://localhost:${TEST_PORT}`;

test("API & Servidor: Pruebas de integración sobre endpoints locales", async (t) => {
  let serverProcess;

  // Iniciar servidor de pruebas en puerto aislado
  await new Promise((resolve, reject) => {
    serverProcess = spawn(process.execPath, [serverPath], {
      env: { ...process.env, PORT: String(TEST_PORT) },
      stdio: ["ignore", "pipe", "pipe"]
    });

    const timeout = setTimeout(() => {
      reject(new Error("Timeout esperando inicio del servidor"));
    }, 5000);

    serverProcess.stdout.on("data", (chunk) => {
      const msg = chunk.toString();
      if (msg.includes("Servidor Estudiantina Online activo")) {
        clearTimeout(timeout);
        resolve();
      }
    });

    serverProcess.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });

  t.after(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  await t.test("GET /api/ranking retorna 200 y estructura JSON válida", async () => {
    const res = await fetch(`${BASE_URL}/api/ranking`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data !== null && typeof data === "object");
  });

  await t.test("GET /api/ranking.php alias retorna 200", async () => {
    const res = await fetch(`${BASE_URL}/api/ranking.php`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
  });

  await t.test("GET /api/comunidad retorna 200, JSON válido y bloques en noticias", async () => {
    const res = await fetch(`${BASE_URL}/api/comunidad`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data !== null && typeof data === "object");
    assert.ok(Array.isArray(data.noticias));
    if (data.noticias.length > 0) {
      assert.ok(Array.isArray(data.noticias[0].bloques), "Las noticias deben tener el campo bloques como array");
    }
  });

  await t.test("GET /api/noticias alias retorna 200 y JSON válido", async () => {
    const res = await fetch(`${BASE_URL}/api/noticias`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data !== null && typeof data === "object");
  });

  await t.test("CORS: Cabeceras permiten Authorization para admin", async () => {
    const res = await fetch(`${BASE_URL}/api/admin`, { method: "OPTIONS" });
    const allowHeaders = res.headers.get("access-control-allow-headers") || "";
    assert.ok(allowHeaders.includes("Authorization"), "CORS debe permitir la cabecera Authorization");
  });

  await t.test("GET /api/foro?action=canales retorna 200 y status ok", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=canales`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(Array.isArray(data.canales));
  });

  await t.test("Seguridad: Intento de acceso directo a /data/ bloqueado con 403", async () => {
    const res = await fetch(`${BASE_URL}/data/ranking.example.json`);
    assert.equal(res.status, 403, "El acceso directo a la carpeta /data/ debe retornar 403 Forbidden");
  });
});
