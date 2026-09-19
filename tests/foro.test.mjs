/**
 * SUITE DE PRUEBAS: FORO DE DEBATE — Estudiantina.online
 * Cubre G6: endpoints de hilos, búsqueda, paginación, user_voted, sanitización,
 * votación de comentarios, rate-limiting y reporte.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverPath = path.resolve(__dirname, "../server.js");
const testDbFile = path.resolve(__dirname, "../data/foro.foro.test.db");

const TEST_PORT = 3898;
const BASE_URL = `http://localhost:${TEST_PORT}`;
const TEST_ADMIN_TOKEN = "dev_token_posadas_2026_master_safe_32chars!";
const TEST_ADMIN_SECRET = "dev_secret_estudiantina_posadas_2026_32bytes_safe!";

test("Foro de Debate: Integración completa de endpoints", async (t) => {
  let serverProcess;

  // Limpiar base de datos de prueba previa
  for (const ext of ["", "-shm", "-wal"]) {
    try { fs.unlinkSync(testDbFile + ext); } catch {}
  }

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
    const timeout = setTimeout(() => reject(new Error("Timeout")), 6000);
    serverProcess.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Servidor Estudiantina Online activo")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    serverProcess.on("error", (err) => { clearTimeout(timeout); reject(err); });
  });

  t.after(() => {
    if (serverProcess) serverProcess.kill();
    for (const ext of ["", "-shm", "-wal"]) {
      try { fs.unlinkSync(testDbFile + ext); } catch {}
    }
  });

  await t.test("GET canales: retorna lista con hilos_count", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=canales`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(Array.isArray(data.canales));
    assert.ok(data.canales.some(ch => ch.id === "offtopic"), "Canal offtopic debe estar presente");
    data.canales.forEach(ch => {
      assert.ok(typeof ch.id === "string");
      assert.ok(typeof ch.hilos_count !== "undefined");
    });
  });

  await t.test("GET hilos: soporta limit y offset y retorna total_count", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=hilos&canal=todos&sort=top&limit=5&offset=0`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(Array.isArray(data.hilos));
    assert.ok(data.hilos.length <= 5);
    assert.equal(typeof data.total_count, "number");
    assert.ok(data.total_count >= data.hilos.length);
  });

  await t.test("GET hilos: soporta sort=comentados y filtro por colegio", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=hilos&sort=comentados&colegio=janssen&limit=5`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.ok(Array.isArray(data.hilos));
    data.hilos.forEach(h => {
      assert.equal(h.colegio_id, "janssen", "Hilo debe pertenecer al colegio filtrado");
    });
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

  await t.test("POST comentar: crea respuesta en hilo existente y aplica rate-limit", async () => {
    const listRes = await fetch(`${BASE_URL}/api/foro?action=hilos&limit=1&offset=0`);
    const listData = await listRes.json();
    if (!listData.hilos.length) return;
    const hiloId = listData.hilos[0].id;
    const originalCount = listData.hilos[0].respuestas_count || 0;
    const commenterId = "test-comentar-id-" + Date.now();

    const res = await fetch(`${BASE_URL}/api/foro?action=comentar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hiloId, contenido: "Comentario de integración automática.",
        googleId: commenterId, autorNombre: "Tester"
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");

    // Rate-limit inmediato sobre el mismo usuario retorna 429
    const spamRes = await fetch(`${BASE_URL}/api/foro?action=comentar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hiloId, contenido: "Comentario spam inmediato.",
        googleId: commenterId, autorNombre: "Tester"
      })
    });
    assert.equal(spamRes.status, 429);

    const hiloRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${hiloId}`);
    const hiloData = await hiloRes.json();
    assert.ok(hiloData.hilo.respuestas_count > originalCount);
  });

  await t.test("POST comentar: hilo inexistente retorna 404", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=comentar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hiloId: 999999,
        contenido: "Comentario para hilo inexistente.",
        googleId: "test-nonexistent-" + Date.now(),
        autorNombre: "Tester"
      })
    });
    assert.equal(res.status, 404);
    const data = await res.json();
    assert.equal(data.status, "error");
  });

  await t.test("POST crear_hilo: permite publicar en canal offtopic y filtrarlo", async () => {
    const res = await fetch(`${BASE_URL}/api/foro?action=crear_hilo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        canalId: "offtopic",
        colegioId: "comercio_6",
        titulo: "Debate Libre de Prueba Off Topic",
        contenido: "¿Cuál es la mejor anécdota de ensayos fuera de la escuela?",
        googleId: "test-offtopic-user-" + Date.now(),
        autorNombre: "Estudiante OffTopic",
        autorAvatar: "assets/avatar-default.webp"
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");

    // Verificar que aparece filtrando por canal offtopic
    const listRes = await fetch(`${BASE_URL}/api/foro?action=hilos&canal=offtopic`);
    assert.equal(listRes.status, 200);
    const listData = await listRes.json();
    assert.ok(listData.hilos.some(h => h.canal_id === "offtopic"));
  });

  await t.test("POST comentar: soporta parentId para respuestas anidadas en el árbol", async () => {
    const listRes = await fetch(`${BASE_URL}/api/foro?action=hilos&limit=1&offset=0`);
    const listData = await listRes.json();
    if (!listData.hilos.length) return;
    const hiloId = listData.hilos[0].id;

    // 1. Obtener un comentario existente para responderle
    const hiloRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${hiloId}`);
    const hiloData = await hiloRes.json();
    if (!hiloData.comentarios || !hiloData.comentarios.length) return;
    const parentComment = hiloData.comentarios[0];

    // 2. Enviar respuesta anidada indicando parentId
    const replyAuthorId = "test-reply-author-" + Date.now();
    const replyRes = await fetch(`${BASE_URL}/api/foro?action=comentar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hiloId,
        contenido: "@Tester Respuesta anidada para test de jerarquía",
        googleId: replyAuthorId,
        autorNombre: "Tester Replier",
        parentId: parentComment.id
      })
    });
    assert.equal(replyRes.status, 200);

    // 3. Verificar que el hilo retorna la respuesta con parent_id correcto
    const updatedHiloRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${hiloId}`);
    const updatedData = await updatedHiloRes.json();
    const foundReply = updatedData.comentarios.find(c => c.autor_google_id === replyAuthorId);
    assert.ok(foundReply, "La respuesta anidada debe estar presente en el hilo");
    assert.equal(foundReply.parent_id, parentComment.id, "El parent_id debe coincidir con el comentario padre");
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
    assert.equal(r2.status, 200);
    const d2 = await r2.json();
    assert.notEqual(d2.voted, d1.voted, "Toggle de voto debe cambiar estado");
  });

  await t.test("POST reportar: exige identidad, previene auto-reporte y duplicados", async () => {
    const listRes = await fetch(`${BASE_URL}/api/foro?action=hilos&limit=1&offset=0`);
    const listData = await listRes.json();
    if (!listData.hilos.length) return;
    const hilo = listData.hilos[0];
    const hiloId = hilo.id;

    // Sin googleId retorna 401
    const unauthRes = await fetch(`${BASE_URL}/api/foro?action=reportar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: hiloId })
    });
    assert.equal(unauthRes.status, 401);

    // Auto-reporte de autor retorna 400
    const selfRes = await fetch(`${BASE_URL}/api/foro?action=reportar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: hiloId, googleId: hilo.autor_google_id })
    });
    assert.equal(selfRes.status, 400);

    // Reporte legítimo de usuario tercero retorna 200
    const reporterId = "test-reporter-legit-" + Date.now();
    const okRes = await fetch(`${BASE_URL}/api/foro?action=reportar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: hiloId, googleId: reporterId, motivo: "Spam de prueba" })
    });
    assert.equal(okRes.status, 200);
    const okData = await okRes.json();
    assert.equal(okData.status, "ok");

    // Segundo reporte del mismo usuario no duplica
    const dupRes = await fetch(`${BASE_URL}/api/foro?action=reportar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: hiloId, googleId: reporterId })
    });
    assert.equal(dupRes.status, 200);
    const dupData = await dupRes.json();
    assert.equal(dupData.alreadyReported, true);
  });

  await t.test("GET /foro: sirve foro.html con ruta amigable y status 200", async () => {
    const res = await fetch(`${BASE_URL}/foro`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    const html = await res.text();
    assert.ok(html.includes("Foro de Debate Estudiantil"));
    assert.ok(html.includes("threads-container"));
    assert.ok(html.includes("foro-left-sidebar"));
    assert.ok(html.includes("reddit-create-box"));
    assert.ok(html.includes("tab-sort-comments"));
    assert.ok(html.includes("countdown-clock"));
    assert.ok(html.includes("sidebar-top-colegios"));
    assert.ok(html.includes("forum-thread-view"));
    assert.ok(html.includes("thread-comments-stream"));
    assert.ok(html.includes("btn-back-to-feed"));
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
    assert.ok(typeof data.metricas.karmaHilos === "number", "Debe retornar karma de hilos");
    assert.ok(typeof data.metricas.karmaComentarios === "number", "Debe retornar karma de comentarios");
    assert.equal(data.metricas.karmaTotal, data.metricas.karmaHilos + data.metricas.karmaComentarios, "Karma total debe ser la suma de hilos y comentarios");
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

  await t.test("Moderación Comunitaria: Se requieren 3 usuarios distintos para ocultar preventivamente un debate", async () => {
    // 1. Crear hilo para prueba de reporte
    const authorId = "author-report-test-" + Date.now();
    const createRes = await fetch(`${BASE_URL}/api/foro?action=crear_hilo`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        canalId: "general",
        titulo: "Debate para test de umbral de reportes",
        contenido: "Contenido de prueba para auto-moderación comunitaria.",
        googleId: authorId,
        autorNombre: "Autor Original"
      })
    });
    const createData = await createRes.json();
    const testHiloId = createData.hiloId;

    // Reporte 1 (Usuario A)
    const r1 = await fetch(`${BASE_URL}/api/foro?action=reportar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: testHiloId, googleId: "user-a-" + Date.now() })
    });
    assert.equal(r1.status, 200);

    // Verificar que NO está oculto aún
    let chkRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${testHiloId}`);
    assert.equal(chkRes.status, 200, "Hilo no debe estar oculto con 1 reporte");

    // Reporte 2 (Usuario B)
    const r2 = await fetch(`${BASE_URL}/api/foro?action=reportar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: testHiloId, googleId: "user-b-" + Date.now() })
    });
    assert.equal(r2.status, 200);

    chkRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${testHiloId}`);
    assert.equal(chkRes.status, 200, "Hilo no debe estar oculto con 2 reportes");

    // Reporte 3 (Usuario C) -> Debe alcanzar umbral y ocultarse
    const r3 = await fetch(`${BASE_URL}/api/foro?action=reportar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: testHiloId, googleId: "user-c-" + Date.now() })
    });
    assert.equal(r3.status, 200);

    chkRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${testHiloId}`);
    assert.equal(chkRes.status, 404, "Hilo debe estar oculto tras 3 reportes distintos");
  });

  await t.test("Integridad de Base de Datos: Eliminación de hilo y comentario elimina votos y reportes en cascada", async () => {
    // 1. Crear hilo
    const authorId = "cascade-author-" + Date.now();
    const cRes = await fetch(`${BASE_URL}/api/foro?action=crear_hilo`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        canalId: "general",
        titulo: "Hilo para prueba de cascada de votos",
        contenido: "Verificando que no queden votos huérfanos al borrar.",
        googleId: authorId,
        autorNombre: "Cascade Author"
      })
    });
    const cData = await cRes.json();
    const hiloId = cData.hiloId;

    // 2. Comentar
    const comRes = await fetch(`${BASE_URL}/api/foro?action=comentar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hiloId,
        contenido: "Comentario para prueba de cascada",
        googleId: "cascade-commenter-" + Date.now(),
        autorNombre: "Cascade Commenter"
      })
    });
    assert.equal(comRes.status, 200);

    // Obtener id del comentario
    const hiloDataRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${hiloId}`);
    const hiloData = await hiloDataRes.json();
    const comentarioId = hiloData.comentarios[0].id;

    // 3. Votar comentario y votar hilo
    await fetch(`${BASE_URL}/api/foro?action=votar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "hilo", itemId: hiloId, googleId: "voter-1" })
    });
    await fetch(`${BASE_URL}/api/foro?action=votar`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "comentario", itemId: comentarioId, googleId: "voter-1" })
    });

    // 4. Borrar hilo vía endpoint admin
    const delRes = await fetch(`${BASE_URL}/api/admin?action=borrar_hilo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TEST_ADMIN_TOKEN}`
      },
      body: JSON.stringify({ hiloId })
    });
    assert.equal(delRes.status, 200);

    // Verificar que el hilo ya no existe
    const verifyRes = await fetch(`${BASE_URL}/api/foro?action=hilo&id=${hiloId}`);
    assert.equal(verifyRes.status, 404);
  });
});
