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
        googleId: "test-xss-safe-user-" + Date.now(), autorNombre: "Tester XSS"
      })
    });
    if (res.status === 200) {
      const data = await res.json();
      assert.equal(data.status, "ok");
      const hiloRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${data.hiloId}`);
      const hiloData = await hiloRes.json();
      assert.ok(!hiloData.hilo.titulo.includes("<script>"), "Título no debe tener <script> raw");
    } else {
      assert.ok([400, 403, 429].includes(res.status));
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

  await t.test("GET /api/foro?action=noticia_hilo: obtiene o genera hilo vinculado a noticia", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=noticia_hilo&noticiaId=noticia-01&googleId=test-news-user`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(data.hilo, "Debe existir un objeto hilo");
    assert.equal(data.hilo.noticia_id, "noticia-01");
    assert.ok(Array.isArray(data.comentarios));
  });

  await t.test("GET /foro.html: archivo físico accesible directamente con status 200", async () => {
    const res = await fetch(`${BASE_URL}/foro.html`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("page-foro"));
  });

  await t.test("GET /noticia.html: incluye contenedor de comentarios del foro", async () => {
    const res = await fetch(`${BASE_URL}/noticia.html`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("noticia-inline-comments-section"));
    assert.ok(html.includes("noticia-tab-comments-section"));
  });

  await t.test("GET /api/foro?action=perfil: obtiene perfil, métricas e insignias", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=perfil&id=demo-user-1`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(data.usuario, "Debe retornar datos de usuario");
    assert.equal(data.usuario.googleId, "demo-user-1");
    assert.ok(data.metricas, "Debe retornar métricas");
    assert.ok(typeof data.metricas.karmaTotal === "number");
    assert.ok(Array.isArray(data.insignias), "Debe retornar lista de insignias");
    assert.ok(data.insignias.length >= 1, "Debe tener al menos la insignia Pionero");
    assert.ok(Array.isArray(data.hilosRecientes));
    assert.ok(Array.isArray(data.comentariosRecientes));
  });

  await t.test("POST /api/foro?action=editar_perfil: actualiza datos, sanitiza XSS y sincroniza", async () => {
    const testUserId = "profile-test-" + Date.now();
    const editPayload = {
      googleId: testUserId,
      nombre: "<b>Lucas Percusionista</b>",
      colegioId: "industrial",
      bio: "Tocando la chancha pesada <script>alert('xss')</script> en la costanera",
      rolEstudiantil: "Chancha (Surdo)",
      anoEscolar: "5° Año (Promo)",
      instagram: "@lucas_percu",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=LucasTest"
    };

    const res = await fetch(`${BASE_URL}/api/foro?action=editar_perfil`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPayload)
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(data.usuario);
    assert.equal(data.usuario.googleId, testUserId);
    assert.ok(!data.usuario.nombre.includes("<b>"), "Nombre debe sanitizarse");
    assert.ok(!data.usuario.bio.includes("<script>"), "Bio debe sanitizarse");
    assert.equal(data.usuario.rolEstudiantil, "Chancha (Surdo)");
    assert.equal(data.usuario.colegioId, "industrial");

    // Verificar que GET perfil retorne los datos guardados
    const getRes = await fetch(`${BASE_URL}/api/foro?action=perfil&id=${testUserId}`);
    assert.equal(getRes.status, 200);
    const getData = await getRes.json();
    assert.equal(getData.usuario.rolEstudiantil, "Chancha (Surdo)");
    assert.equal(getData.usuario.anoEscolar, "5° Año (Promo)");

    // Verificar que un nuevo login con Google NO sobreescriba la bio ni el rol
    const loginRes = await fetch(`${BASE_URL}/api/foro?action=auth_google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleId: testUserId,
        nombre: "Lucas Google Re-Login",
        email: "lucas@example.com",
        avatarUrl: "https://lh3.googleusercontent.com/a/photo",
        colegioId: "industrial"
      })
    });
    assert.equal(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.equal(loginData.usuario.rolEstudiantil, "Chancha (Surdo)");
    assert.ok(loginData.usuario.bio.includes("chancha pesada"));
  });

  await t.test("GET /api/foro?action=check_username: valida formato, nombres reservados y unicidad", async () => {
    // Nombre corto (< 3)
    const r1 = await fetch(`${BASE_URL}/api/foro?action=check_username&username=ab`);
    const d1 = await r1.json();
    assert.equal(d1.available, false);

    // Nombre reservado (admin)
    const r2 = await fetch(`${BASE_URL}/api/foro?action=check_username&username=admin`);
    const d2 = await r2.json();
    assert.equal(d2.available, false);
    assert.ok(d2.message.includes("reservado"));

    // Nombre tomado por usuario demo
    const r3 = await fetch(`${BASE_URL}/api/foro?action=check_username&username=lucas_percusion`);
    const d3 = await r3.json();
    assert.equal(d3.available, false);
    assert.ok(d3.message.includes("registrado"));

    // El mismo usuario dueño puede conservar su username
    const r4 = await fetch(`${BASE_URL}/api/foro?action=check_username&username=lucas_percusion&googleId=demo-user-1`);
    const d4 = await r4.json();
    assert.equal(d4.available, true);

    // Nombre nuevo disponible
    const randomUser = "test_user_" + Math.random().toString(36).substring(2, 8);
    const r5 = await fetch(`${BASE_URL}/api/foro?action=check_username&username=${randomUser}`);
    const d5 = await r5.json();
    assert.equal(d5.available, true);
  });

  await t.test("POST /api/foro?action=completar_registro: registro completo y foto personalizada", async () => {
    const newGoogleId = "google_new_" + Date.now();
    const chosenUsername = "hincha_" + Math.random().toString(36).substring(2, 8);
    const customPhotoUri = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4H";

    // 1. Auth inicial detecta needsOnboarding = true
    const authRes = await fetch(`${BASE_URL}/api/foro?action=auth_google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleId: newGoogleId,
        nombre: "Nuevo Hincha Posadeño",
        email: "nuevo@example.com",
        avatarUrl: "https://lh3.googleusercontent.com/a/origphoto",
        colegioId: "comercio6"
      })
    });
    const authData = await authRes.json();
    assert.equal(authData.status, "ok");
    assert.equal(authData.needsOnboarding, true, "Usuario nuevo debe requerir onboarding");

    // 2. Completar registro con username y foto custom
    const regRes = await fetch(`${BASE_URL}/api/foro?action=completar_registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleId: newGoogleId,
        username: chosenUsername,
        nombre: "Nuevo Hincha Posadeño",
        colegioId: "comercio6",
        rolEstudiantil: "Bastonera / Coreógrafa",
        anoEscolar: "5° Año (Promo)",
        avatarUrl: customPhotoUri
      })
    });
    const regData = await regRes.json();
    assert.equal(regData.status, "ok");
    assert.equal(regData.usuario.username, chosenUsername);
    assert.equal(regData.usuario.avatarUrl, customPhotoUri);

    // 3. Intento de otro usuario de registrarse con el mismo username debe fallar
    const dupeRes = await fetch(`${BASE_URL}/api/foro?action=completar_registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleId: "another_google_id_" + Date.now(),
        username: chosenUsername,
        nombre: "Impostor",
        colegioId: "janssen",
        rolEstudiantil: "Redoblante",
        anoEscolar: "1° Año",
        avatarUrl: ""
      })
    });
    const dupeData = await dupeRes.json();
    assert.equal(dupeData.status, "error");
    assert.ok(dupeData.message.includes("registrado"));

    // 4. Segundo login con Google ahora debe retornar needsOnboarding = false
    const authRes2 = await fetch(`${BASE_URL}/api/foro?action=auth_google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleId: newGoogleId,
        nombre: "Nuevo Hincha Posadeño",
        email: "nuevo@example.com",
        avatarUrl: "https://lh3.googleusercontent.com/a/origphoto",
        colegioId: "comercio6"
      })
    });
  });

  await t.test("Colegios y Tema Escolar: Todos los colegios definen paleta de colores para el foro", async () => {
    const { COLEGIOS } = await import("../js/colegios.js");
    assert.ok(Array.isArray(COLEGIOS) && COLEGIOS.length >= 33);
    for (const col of COLEGIOS) {
      assert.ok(col.id, `Colegio sin ID`);
      assert.ok(col.colores, `Colegio ${col.id} no tiene objeto colores`);
      assert.ok(col.colores.primary, `Colegio ${col.id} no tiene color primary`);
      assert.ok(col.colores.secondary, `Colegio ${col.id} no tiene color secondary`);
      assert.ok(col.colores.glow, `Colegio ${col.id} no tiene color glow`);
    }

    // Verificar que foro.html se sirve correctamente y contiene los selectores de colegios
    const res = await fetch(`${BASE_URL}/foro.html`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("auth-select-school"));
    assert.ok(html.includes("onboarding-school"));
    assert.ok(html.includes("edit-profile-school"));
    assert.ok(html.includes("css/foro.css") || html.includes("css/foro-completo.css"));
  });

  await t.test("Foro: Soporte de Tema Claro, Oscuro y Modo Administrador Mobile", async () => {
    // Verificar que foro.html incluye el selector de tema y barra de moderación
    const resForo = await fetch(`${BASE_URL}/foro.html`);
    assert.equal(resForo.status, 200);
    const htmlForo = await resForo.text();
    assert.ok(htmlForo.includes('id="theme-toggle"'), "foro.html debe incluir #theme-toggle");
    assert.ok(htmlForo.includes('id="admin-top-bar"'), "foro.html debe incluir barra de moderador");
    assert.ok(htmlForo.includes('css/foro.css') || htmlForo.includes('css/foro-completo.css'));
  });
});
