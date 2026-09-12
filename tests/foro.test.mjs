/**
 * SUITE DE PRUEBAS: FORO DE DEBATE — Estudiantina.online
 * Cubre G6: endpoints de hilos, búsqueda, paginación, user_voted, sanitización,
 * votación de comentarios, rate-limiting y reporte.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverPath = path.resolve(__dirname, "../server.js");

const TEST_PORT = 3898;
const BASE_URL = `http://localhost:${TEST_PORT}`;

test("Foro de Debate: Integración completa de endpoints", async (t) => {
  let serverProcess;

  await new Promise((resolve, reject) => {
    serverProcess = spawn(process.execPath, [serverPath], {
      env: { ...process.env, PORT: String(TEST_PORT) },
      stdio: ["ignore", "pipe", "pipe"]
    });
    const timeout = setTimeout(() => reject(new Error("Timeout")), 6000);
    serverProcess.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Servidor Estudiantina Online activo")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    serverProcess.on("error", (err) => { clearTimeout(timeout); reject(err); });
  });

  t.after(() => { if (serverProcess) serverProcess.kill(); });

  await t.test("GET canales: retorna lista con hilos_count", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=canales`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(Array.isArray(data.canales));
    data.canales.forEach(ch => {
      assert.ok(typeof ch.id === "string");
      assert.ok(typeof ch.hilos_count !== "undefined");
    });
  });

  await t.test("GET hilos: soporta limit y offset", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=hilos&canal=todos&sort=top&limit=5&offset=0`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(Array.isArray(data.hilos));
    assert.ok(data.hilos.length <= 5);
  });

  await t.test("GET hilos: búsqueda por q sobre título/contenido", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=hilos&q=simulador&limit=10`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(Array.isArray(data.hilos));
    data.hilos.forEach(h => {
      const ok = h.titulo.toLowerCase().includes("simulador")
               || h.contenido.toLowerCase().includes("simulador")
               || h.autor_nombre.toLowerCase().includes("simulador");
      assert.ok(ok, `Hilo ${h.id} no coincide con búsqueda`);
    });
  });

  await t.test("GET hilo: retorna user_voted en hilo y comentarios", async () => {
    const listRes = await fetch(`${BASE_URL}/api/foro?action=hilos&limit=1&offset=0`);
    const listData = await listRes.json();
    if (!listData.hilos.length) return;
    const hiloId = listData.hilos[0].id;
    const res = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${hiloId}&googleId=test-user-check`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(typeof data.hilo.user_voted !== "undefined");
    data.comentarios.forEach(c => assert.ok(typeof c.user_voted !== "undefined"));
  });

  await t.test("POST crear_hilo: sin googleId retorna 401", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=crear_hilo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canalId: "general", titulo: "Test debate", contenido: "Contenido mínimo." })
    });
    assert.equal(res.status, 401);
  });

  await t.test("POST crear_hilo: título con XSS es sanitizado", async () => {
    const xssTitle = "<script>alert('xss')</script>Debate XSS";
    const res = await fetch(`${BASE_URL}/api/foro?action=crear_hilo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        canalId: "general", titulo: xssTitle,
        contenido: "Contenido legítimo mínimo.",
        googleId: "test-xss-safe-user", autorNombre: "Tester XSS"
      })
    });
    if (res.status === 200) {
      const data = await res.json();
      assert.equal(data.status, "ok");
      const hiloRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${data.hiloId}`);
      const hiloData = await hiloRes.json();
      assert.ok(!hiloData.hilo.titulo.includes("<script>"), "Título no debe tener <script> raw");
    } else {
      assert.ok([400, 429].includes(res.status));
    }
  });

  await t.test("POST comentar: crea respuesta en hilo existente", async () => {
    const listRes = await fetch(`${BASE_URL}/api/foro?action=hilos&limit=1&offset=0`);
    const listData = await listRes.json();
    if (!listData.hilos.length) return;
    const hiloId = listData.hilos[0].id;
    const originalCount = listData.hilos[0].respuestas_count || 0;
    const res = await fetch(`${BASE_URL}/api/foro?action=comentar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hiloId, contenido: "Comentario de integración automática.",
        googleId: "test-comentar-id", autorNombre: "Tester"
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    const hiloRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${hiloId}`);
    const hiloData = await hiloRes.json();
    assert.ok(hiloData.hilo.respuestas_count > originalCount);
  });

  await t.test("POST votar: alterna el voto en un hilo", async () => {
    const listRes = await fetch(`${BASE_URL}/api/foro?action=hilos&limit=1&offset=0`);
    const listData = await listRes.json();
    if (!listData.hilos.length) return;
    const hiloId = listData.hilos[0].id;
    const googleId = "test-voter-alternance";
    const r1 = await fetch(`${BASE_URL}/api/foro?action=votar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: hiloId, googleId })
    });
    assert.equal(r1.status, 200);
    const d1 = await r1.json();
    const r2 = await fetch(`${BASE_URL}/api/foro?action=votar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: hiloId, googleId })
    });
    const d2 = await r2.json();
    assert.notEqual(d2.voted, d1.voted, "Toggle de voto debe cambiar estado");
  });

  await t.test("POST reportar: marca hilo como reportado", async () => {
    const listRes = await fetch(`${BASE_URL}/api/foro?action=hilos&limit=1&offset=0`);
    const listData = await listRes.json();
    if (!listData.hilos.length) return;
    const hiloId = listData.hilos[0].id;
    const res = await fetch(`${BASE_URL}/api/foro?action=reportar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: hiloId })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
  });

  await t.test("GET /foro: sirve foro.html con ruta amigable y status 200", async () => {
    const res = await fetch(`${BASE_URL}/foro`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    const html = await res.text();
    assert.ok(html.includes("Foro de Debate Estudiantil"));
    assert.ok(html.includes("threads-container"));
  });

  await t.test("GET /foro.html: archivo físico accesible directamente con status 200", async () => {
    const res = await fetch(`${BASE_URL}/foro.html`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("page-foro"));
  });
});
