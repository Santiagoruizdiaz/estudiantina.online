import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverPath = path.resolve(__dirname, "../server.js");
const testDbFile = path.resolve(__dirname, "../data/foro.api.test.db");

const TEST_PORT = 3899;
const BASE_URL = `http://localhost:${TEST_PORT}`;
const TEST_ADMIN_TOKEN = "dev_token_posadas_2026_master_safe_32chars!";
const TEST_ADMIN_SECRET = "dev_secret_estudiantina_posadas_2026_32bytes_safe!";

test("API & Servidor: Pruebas de integración sobre endpoints locales", async (t) => {
  let serverProcess;

  // Limpiar base de datos de prueba previa
  for (const ext of ["", "-shm", "-wal"]) {
    try { fs.unlinkSync(testDbFile + ext); } catch {}
  }

  // Iniciar servidor de pruebas en puerto aislado con base de datos temporal
  await new Promise((resolve, reject) => {
    serverProcess = spawn(process.execPath, [serverPath], {
      env: {
        ...process.env,
        PORT: String(TEST_PORT),
        DATABASE_PATH: testDbFile,
        NODE_ENV: "test",
        ADMIN_TOKEN: TEST_ADMIN_TOKEN,
        ADMIN_SECRET: TEST_ADMIN_SECRET
      },
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

    serverProcess.stderr.on("data", (chunk) => {
      console.error("TEST SERVER STDERR:", chunk.toString());
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
    for (const ext of ["", "-shm", "-wal"]) {
      try { fs.unlinkSync(testDbFile + ext); } catch {}
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

  await t.test("Admin: Validación con Token Maestro retorna 200 y status ok", async () => {
    const masterToken = process.env.ADMIN_TOKEN || TEST_ADMIN_TOKEN;
    const res = await fetch(`${BASE_URL}/api/admin?action=verificar`, {
      headers: { "Authorization": `Bearer ${masterToken}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.equal(data.usuario, "admin");
  });

  await t.test("Admin: POST login_token valida token maestro y rechaza tokens inválidos", async () => {
    const masterToken = process.env.ADMIN_TOKEN || TEST_ADMIN_TOKEN;
    const resOk = await fetch(`${BASE_URL}/api/admin?action=login_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: masterToken })
    });
    assert.equal(resOk.status, 200);
    const dataOk = await resOk.json();
    assert.equal(dataOk.status, "ok");

    const resBad = await fetch(`${BASE_URL}/api/admin?action=login_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "token_falso_invalido" })
    });
    assert.equal(resBad.status, 401);
  });

  await t.test("Moderación Foro: Sancionar usuario y verificar bloqueo 403 al crear hilo/comentar", async () => {
    const masterToken = process.env.ADMIN_TOKEN || TEST_ADMIN_TOKEN;
    const testBadUser = "bad_user_test_999";

    // 1. Sancionar usuario (suspender por 24 horas)
    const resSancion = await fetch(`${BASE_URL}/api/admin?action=sancionar_usuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterToken}`
      },
      body: JSON.stringify({
        googleId: testBadUser,
        tipoSancion: "suspender",
        duracionHoras: 24,
        motivo: "Comportamiento hostil reiterado"
      })
    });
    assert.equal(resSancion.status, 200);
    const dataSancion = await resSancion.json();
    assert.equal(dataSancion.status, "ok");

    // 2. Intentar crear hilo con el usuario suspendido debe dar 403 Forbidden
    const resHiloBlocked = await fetch(`${BASE_URL}/api/foro?action=crear_hilo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        canalId: "general",
        titulo: "Intento de debate de usuario suspendido",
        contenido: "Este contenido no debería publicarse porque el usuario está suspendido",
        googleId: testBadUser,
        autorNombre: "Usuario Bloqueado",
        colegioId: "janssen"
      })
    });
    assert.equal(resHiloBlocked.status, 403, "El usuario suspendido debe recibir 403 Forbidden al crear debate");
    const dataBlocked = await resHiloBlocked.json();
    assert.ok(dataBlocked.message.includes("suspendida"), "El mensaje de error debe explicar la suspensión");

    // 3. Levantar la sanción (rehabilitar usuario)
    const resLevantar = await fetch(`${BASE_URL}/api/admin?action=sancionar_usuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterToken}`
      },
      body: JSON.stringify({
        googleId: testBadUser,
        tipoSancion: "desbanear"
      })
    });
    assert.equal(resLevantar.status, 200);
    const dataLevantar = await resLevantar.json();
    assert.equal(dataLevantar.status, "ok");

    // 4. Banear permanentemente y comprobar bloqueo
    const resBan = await fetch(`${BASE_URL}/api/admin?action=sancionar_usuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterToken}`
      },
      body: JSON.stringify({
        googleId: testBadUser,
        tipoSancion: "banear",
        motivo: "Infracción grave"
      })
    });
    assert.equal(resBan.status, 200);

    const resComentarioBlocked = await fetch(`${BASE_URL}/api/foro?action=comentar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hiloId: 1,
        contenido: "Comentario de usuario baneado",
        googleId: testBadUser,
        autorNombre: "Usuario Baneado",
        colegioId: "janssen"
      })
    });
    assert.equal(resComentarioBlocked.status, 403, "El usuario baneado debe recibir 403 Forbidden al comentar");
  });

  await t.test("Moderación Foro: GET usuarios y fijar/borrar hilos", async () => {
    const masterToken = process.env.ADMIN_TOKEN || TEST_ADMIN_TOKEN;

    // 1. Obtener lista de usuarios
    const resUsers = await fetch(`${BASE_URL}/api/admin?action=usuarios`, {
      headers: { "Authorization": `Bearer ${masterToken}` }
    });
    assert.equal(resUsers.status, 200);
    const dataUsers = await resUsers.json();
    assert.equal(dataUsers.status, "ok");
    assert.ok(Array.isArray(dataUsers.usuarios));

    // 2. Crear un debate de prueba para probar fijar y borrar
    const resCreate = await fetch(`${BASE_URL}/api/foro?action=crear_hilo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        canalId: "general",
        titulo: "Debate dinámico para probar moderación",
        contenido: "Descripción de prueba para verificar fijar_hilo y borrar_hilo por admin",
        googleId: "admin_tester_user_456",
        autorNombre: "Tester Moderador",
        colegioId: "janssen"
      })
    });
    assert.equal(resCreate.status, 200);
    const dataCreate = await resCreate.json();
    const targetHiloId = dataCreate.hiloId;

    // 3. Fijar el debate
    const resFijar = await fetch(`${BASE_URL}/api/admin?action=fijar_hilo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterToken}`
      },
      body: JSON.stringify({ hiloId: targetHiloId, fijar: 1 })
    });
    assert.equal(resFijar.status, 200);
    const dataFijar = await resFijar.json();
    assert.equal(dataFijar.status, "ok");
    assert.equal(dataFijar.fijado, 1);

    // 4. Borrar el debate con token admin
    const resBorrar = await fetch(`${BASE_URL}/api/admin?action=borrar_hilo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterToken}`
      },
      body: JSON.stringify({ hiloId: targetHiloId })
    });
    assert.equal(resBorrar.status, 200);
    const dataBorrar = await resBorrar.json();
    assert.equal(dataBorrar.status, "ok");
  });

  await t.test("Páginas Dual-Runtime: GET / sirve index.html como hub principal", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    const html = await res.text();
    assert.ok(html.includes("Estudiantina"));
    assert.ok(html.includes("simulador.html"));
    assert.ok(html.includes("comunidad.html"));
    assert.ok(html.includes("foro.html"));
  });

  await t.test("Páginas Dual-Runtime: GET /simulador sirve simulador.html con status 200", async () => {
    const res = await fetch(`${BASE_URL}/simulador`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    const html = await res.text();
    assert.ok(html.includes("Simulador de Carrera"));
    assert.ok(html.includes("confetti-canvas"));
  });

  await t.test("Páginas Dual-Runtime: GET /comunidad alias sirve portal con status 200", async () => {
    const res = await fetch(`${BASE_URL}/comunidad`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    const html = await res.text();
    assert.ok(html.includes("hero-article"));
  });

  await t.test("VULN-02: Backdoor eliminado en server.js (admin/admin123 rechazado con 401)", async () => {
    const res = await fetch(`${BASE_URL}/api/admin?action=login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": "198.51.100." + Date.now()
      },
      body: JSON.stringify({ usuario: "admin", password: "admin123" })
    });
    assert.equal(res.status, 401, "El backdoor admin/admin123 debe ser rechazado con 401");
  });

  await t.test("VULN-12: ADMIN_SECRET rechazado como Bearer token", async () => {
    const res = await fetch(`${BASE_URL}/api/admin?action=verificar`, {
      headers: { "Authorization": `Bearer ${TEST_ADMIN_SECRET}` }
    });
    assert.equal(res.status, 401, "ADMIN_SECRET directo no debe ser aceptado como Bearer token");
  });

  await t.test("VULN-06 & VULN-14: Bloqueo de dotfiles, extensiones sensibles y path traversal con 403", async () => {
    const resEnv = await fetch(`${BASE_URL}/.env`);
    assert.equal(resEnv.status, 403, "Acceso a .env debe dar 403");

    const resDb = await fetch(`${BASE_URL}/data/foro.db`);
    assert.equal(resDb.status, 403, "Acceso a archivo .db debe dar 403");

    const resTraversal = await fetch(`${BASE_URL}/..%2fpackage.json`);
    assert.equal(resTraversal.status, 403, "Path traversal debe dar 403");
  });

  await t.test("VULN-23: guardar_ajustes rechaza arrays o no-objetos con 400", async () => {
    const res = await fetch(`${BASE_URL}/api/admin?action=guardar_ajustes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TEST_ADMIN_TOKEN}`
      },
      body: JSON.stringify({ ajustes: ["no", "es", "un", "objeto"] })
    });
    assert.equal(res.status, 400, "ajustes como array debe retornar 400");
  });

  await t.test("VULN-10: Ranking rechaza colegioId fuera de whitelist con 400", async () => {
    const res = await fetch(`${BASE_URL}/api/ranking?action=registrarInicio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colegioId: "colegio_fantasma_invalido" })
    });
    assert.equal(res.status, 400, "Colegio inválido debe retornar 400");
  });

  await t.test("VULN-13: Rate limit en login bloquea temporalmente tras 5 intentos fallidos con 429", async () => {
    const testIp = `198.51.100.${Date.now() % 200 + 10}`;
    for (let i = 0; i < 5; i++) {
      const res = await fetch(`${BASE_URL}/api/admin?action=login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": testIp
        },
        body: JSON.stringify({ usuario: "admin", password: `wrong-pass-${i}` })
      });
      assert.equal(res.status, 401);
    }

    // El 6to intento debe recibir 429 Too Many Requests
    const resBlocked = await fetch(`${BASE_URL}/api/admin?action=login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": testIp
      },
      body: JSON.stringify({ usuario: "admin", password: "wrong-pass-again" })
    });
    assert.equal(resBlocked.status, 429, "Debe responder 429 tras 5 intentos fallidos");
  });

  await t.test("VULN-05 & VULN-24: crear_noticia sanitiza HTML y genera ID criptoseguro", async () => {
    const res = await fetch(`${BASE_URL}/api/admin?action=crear_noticia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TEST_ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        titulo: "<script>alert('xss')</script>Título Seguro",
        resumen: "<img src=x onerror=alert(1)>Resumen Seguro",
        autor: "<b>Autor</b>",
        badge: "<i>Urgente</i>",
        categoria: "Noches <marquee>calle</marquee>",
        bloques: [
          { type: "text", value: "<script>dangerous()</script>Texto en bloque" }
        ]
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(data.noticiaId.startsWith("noticia-"));
    // ID criptoseguro de 16 caracteres hexadecimales después de 'noticia-'
    assert.match(data.noticiaId, /^noticia-[0-9a-f]{16}$/);
    assert.ok(!data.noticia.titulo.includes("<script>"));
    assert.ok(data.noticia.titulo.includes("&lt;script&gt;"));
    assert.ok(!data.noticia.resumen.includes("<img"));
    assert.ok(data.noticia.bloques[0].value.includes("&lt;script&gt;"));

    // Cleanup: borrar la noticia de prueba
    await fetch(`${BASE_URL}/api/admin?action=borrar_noticia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TEST_ADMIN_TOKEN}`
      },
      body: JSON.stringify({ id: data.noticiaId })
    });
  });

  await t.test("VULN-10: noticia_hilo con noticia inexistente retorna 404", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=noticia_hilo&noticia_id=noticia-fantasma-inexistente-12345`);
    assert.equal(res.status, 404, "Debate de noticia inexistente debe responder 404");
  });

  await t.test("VULN-15: Avatar mayor a 300.000 caracteres retorna 400", async () => {
    const hugeAvatar = "data:image/png;base64," + "A".repeat(300001);
    const res = await fetch(`${BASE_URL}/api/foro?action=completar_registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleId: "test-huge-avatar-user",
        username: "test_huge_av",
        nombre: "Test Huge",
        avatarUrl: hugeAvatar
      })
    });
    assert.equal(res.status, 400, "Avatar > 300k chars debe retornar 400");
  });
});
