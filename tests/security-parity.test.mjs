/**
 * Pruebas de seguridad y paridad entre runtimes.
 * Ejecuta los mismos casos contra server.js (desarrollo) y api/*.php (producción en Hostinger)
 * usando copias aisladas en un directorio temporal y un mock local del endpoint tokeninfo de Google.
 *
 * PHP se toma de PHP_BIN o del PATH. Si no está disponible, sus casos se omiten,
 * salvo con REQUIRE_PHP=1 o CI=true, donde la ausencia de PHP hace fallar la suite.
 */
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync, execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const PHP_BIN = process.env.PHP_BIN || "php";
const phpAvailable = spawnSync(PHP_BIN, ["-v"], { stdio: "ignore" }).status === 0;
const phpRequired = process.env.REQUIRE_PHP === "1" || process.env.CI === "true";
const skipPhp = phpAvailable ? false : "PHP no disponible (definí PHP_BIN o agregá php al PATH)";

const CLIENT_ID = "estudiantina-test.apps.googleusercontent.com";
const TEST_ADMIN_TOKEN = "dev_token_posadas_2026_master_safe_32chars!";
const TEST_ADMIN_SECRET = "dev_secret_estudiantina_posadas_2026_32bytes_safe!";

// ── Mock de https://oauth2.googleapis.com/tokeninfo ─────────────────────────
let tokeninfoHits = 0;
const nowSec = () => Math.floor(Date.now() / 1000);
const TOKENS = {
  "tok-valido": () => ({ sub: "g-valido", aud: CLIENT_ID, iss: "https://accounts.google.com", exp: String(nowSec() + 3600), email: "valido@example.com", name: "Hincha Válido" }),
  "tok-otra-app": () => ({ sub: "g-victima", aud: "otra-app.apps.googleusercontent.com", iss: "https://accounts.google.com", exp: String(nowSec() + 3600) }),
  "tok-iss-falso": () => ({ sub: "g-falso", aud: CLIENT_ID, iss: "https://evil.example", exp: String(nowSec() + 3600) })
};
const tokeninfo = http.createServer((req, res) => {
  tokeninfoHits++;
  const token = new URL(req.url, "http://localhost").searchParams.get("id_token");
  const claims = TOKENS[token];
  res.writeHead(claims ? 200 : 400, { "Content-Type": "application/json" });
  res.end(JSON.stringify(claims ? claims() : { error: "invalid_token" }));
});

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

// Copia aislada del backend: server.js + api/ + data/ vacío en un directorio temporal
function makeSandbox() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "estudiantina-test-"));
  fs.mkdirSync(path.join(dir, "api"));
  fs.mkdirSync(path.join(dir, "data"));
  fs.copyFileSync(path.join(projectRoot, "server.js"), path.join(dir, "server.js"));
  fs.copyFileSync(path.join(projectRoot, "index.html"), path.join(dir, "index.html"));
  for (const f of fs.readdirSync(path.join(projectRoot, "api"))) {
    if (f.endsWith(".php")) fs.copyFileSync(path.join(projectRoot, "api", f), path.join(dir, "api", f));
  }
  return dir;
}

async function waitForHttp(base, proc, logs) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (proc.exitCode !== null) throw new Error(`El servidor terminó antes de iniciar:\n${logs.join("")}`);
    try {
      await fetch(`${base}/robots.txt`);
      return;
    } catch {
      await new Promise(r => setTimeout(r, 100));
    }
  }
  throw new Error(`Timeout esperando ${base}:\n${logs.join("")}`);
}

async function startRuntime(kind, env) {
  const dir = makeSandbox();
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const childEnv = { ...process.env, NODE_ENV: "", APP_ENV: "", ADMIN_SECRET: "", ADMIN_TOKEN: "", GOOGLE_CLIENT_ID: "", GOOGLE_TOKENINFO_URL: "", ...env };
  const proc = kind === "node"
    ? spawn(process.execPath, [path.join(dir, "server.js")], { cwd: dir, env: { ...childEnv, PORT: String(port) }, stdio: ["ignore", "pipe", "pipe"] })
    : spawn(PHP_BIN, ["-S", `127.0.0.1:${port}`, "-t", dir], { cwd: dir, env: childEnv, stdio: ["ignore", "pipe", "pipe"] });
  const logs = [];
  proc.stdout.on("data", c => logs.push(c.toString()));
  proc.stderr.on("data", c => logs.push(c.toString()));
  await waitForHttp(base, proc, logs);
  return {
    base,
    dir,
    async stop() {
      proc.kill();
      await new Promise(r => (proc.exitCode !== null ? r() : proc.once("exit", r)));
      fs.rmSync(dir, { recursive: true, force: true });
    }
  };
}

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body)
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { status: res.status, text, json };
}

async function getJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { status: res.status, text, json, contentType: res.headers.get("content-type") || "" };
}

const RUNTIMES = [
  { name: "Node", kind: "node", ext: "", skip: false },
  { name: "PHP", kind: "php", ext: ".php", skip: skipPhp }
];

test("Entorno: PHP disponible cuando la suite lo exige (REQUIRE_PHP=1 / CI)", { skip: !phpRequired }, () => {
  assert.ok(phpAvailable, `No se encontró PHP (${PHP_BIN}). Instalalo o definí PHP_BIN.`);
});

before(async () => {
  await new Promise(r => tokeninfo.listen(0, "127.0.0.1", r));
});

after(() => {
  tokeninfo.close();
});

for (const rt of RUNTIMES) {
  test(`[${rt.name}] seguridad y contrato de la API`, { skip: rt.skip }, async (t) => {
    const env = {
      NODE_ENV: rt.kind === "node" ? "test" : "development",
      ADMIN_TOKEN: TEST_ADMIN_TOKEN,
      ADMIN_SECRET: TEST_ADMIN_SECRET,
      GOOGLE_CLIENT_ID: CLIENT_ID,
      GOOGLE_TOKENINFO_URL: `http://127.0.0.1:${tokeninfo.address().port}/tokeninfo`
    };
    const server = await startRuntime(rt.kind, env);
    t.after(() => server.stop());
    const api = (name, qs = "") => `${server.base}/api/${name}${rt.ext}${qs}`;

    await t.test("Google: acepta un ID token emitido para este cliente", async () => {
      const r = await postJson(api("foro", "?action=auth_google"), { token: "tok-valido", nombre: "Hincha Válido" });
      assert.equal(r.status, 200, r.text);
      assert.equal(r.json.usuario.googleId, "g-valido");
    });

    await t.test("Google: rechaza un ID token emitido para otra aplicación (aud)", async () => {
      const r = await postJson(api("foro", "?action=auth_google"), { token: "tok-otra-app", nombre: "Atacante" });
      assert.equal(r.status, 401, r.text);
    });

    await t.test("Google: rechaza un ID token con emisor ajeno a Google (iss)", async () => {
      const r = await postJson(api("foro", "?action=auth_google"), { token: "tok-iss-falso", nombre: "Atacante" });
      assert.equal(r.status, 401, r.text);
    });

    await t.test("Login admin: rotar X-Forwarded-For no evita el bloqueo tras 5 intentos", async () => {
      for (let i = 1; i <= 5; i++) {
        const r = await postJson(api("admin", "?action=login"), { usuario: "no-existe", password: `mala-${i}` }, { "X-Forwarded-For": `203.0.113.${i}` });
        assert.equal(r.status, 401, `intento ${i}: ${r.text}`);
      }
      const blocked = await postJson(api("admin", "?action=login"), { usuario: "no-existe", password: "mala-6" }, { "X-Forwarded-For": "203.0.113.99" });
      assert.equal(blocked.status, 429, blocked.text);
    });

    await t.test("Payload: JSON malformado responde 400 con cuerpo JSON", async () => {
      for (const url of [api("foro", "?action=crear_hilo"), api("admin", "?action=login_token")]) {
        const r = await postJson(url, "{malformado");
        assert.equal(r.status, 400, `${url}: ${r.text}`);
        assert.equal(r.json?.status, "error", `${url}: ${r.text}`);
      }
    });

    await t.test("Payload: un campo con tipo inválido responde 400, no 500", async () => {
      const r = await postJson(api("foro", "?action=crear_hilo"), { titulo: ["x"], contenido: "Contenido suficientemente largo", googleId: "g-valido", autorNombre: "A", token: "tok-valido" });
      assert.equal(r.status, 400, r.text);
      assert.equal(r.json?.status, "error", r.text);
    });

    await t.test("Query: un parámetro array (?q[]=x) no provoca un 500", async () => {
      const r = await getJson(api("foro", "?action=hilos&q[]=x"));
      assert.ok(r.status < 500, `status ${r.status}: ${r.text}`);
      assert.ok(r.json && typeof r.json.status === "string", r.text);
    });

    await t.test("Ranking: textos con emojis y tildes no corrompen ni vacían ranking.json", async () => {
      const base = await postJson(api("ranking"), { action: "registrarEgresado", egresado: { colegioId: "janssen", nombre: "Ana", ovr: 60 } });
      assert.equal(base.status, 200, base.text);

      const nombre = "Ñandú Pérez Íñiguez Ávalos Güemes Ñeñeñé";
      const r = await postJson(api("ranking"), { action: "registrarEgresado", egresado: { colegioId: "janssen", nombre, escudo: "🥁🎺🥁", ovr: 95 } });
      assert.equal(r.status, 200, r.text);
      assert.equal(r.json?.status, "ok", r.text);
      assert.equal(r.json.registro.escudo, "🥁🎺🥁");
      assert.equal(r.json.registro.nombre, nombre.slice(0, 30));

      const raw = fs.readFileSync(path.join(server.dir, "data", "ranking.json"), "utf-8");
      const saved = JSON.parse(raw);
      assert.equal(saved.top10.length, 2, "El Top 10 previo debe conservarse");

      const list = await getJson(api("ranking"));
      assert.equal(list.json.top10.length, 2);
    });

    await t.test("Ranking: un nombre con tipo inválido no provoca un 500", async () => {
      const r = await postJson(api("ranking"), { action: "registrarEgresado", egresado: { colegioId: "janssen", nombre: ["x"], ovr: 50 } });
      assert.ok(r.status < 500, `status ${r.status}: ${r.text}`);
      assert.ok(r.json, r.text);
    });

    await t.test("Estático: /api/comunidad.php responde JSON y ningún .php expone su código", async () => {
      const com = await getJson(`${server.base}/api/comunidad.php`);
      assert.match(com.contentType, /application\/json/, com.text.slice(0, 80));
      assert.ok(com.json, com.text.slice(0, 80));

      const res = await fetch(`${server.base}/api/_common.php`);
      const body = await res.text();
      assert.notEqual(res.status, 200);
      assert.ok(!body.includes("<?php"), "No debe servirse el código fuente PHP");
    });
  });
}

test("[Node] sin GOOGLE_CLIENT_ID se rechazan los ID tokens sin consultar a Google", async (t) => {
  const server = await startRuntime("node", {
    NODE_ENV: "test",
    ADMIN_TOKEN: TEST_ADMIN_TOKEN,
    ADMIN_SECRET: TEST_ADMIN_SECRET,
    GOOGLE_TOKENINFO_URL: `http://127.0.0.1:${tokeninfo.address().port}/tokeninfo`
  });
  t.after(() => server.stop());
  const hitsBefore = tokeninfoHits;
  const r = await postJson(`${server.base}/api/foro?action=auth_google`, { token: "tok-valido", nombre: "Hincha" });
  assert.equal(r.status, 401, r.text);
  assert.equal(tokeninfoHits, hitsBefore, "No debe consultarse tokeninfo sin GOOGLE_CLIENT_ID");
});

test("[PHP] producción falla cerrado: sin secretos ni GOOGLE_CLIENT_ID", { skip: skipPhp }, async (t) => {
  const server = await startRuntime("php", { NODE_ENV: "production" });
  t.after(() => server.stop());

  const admin = await getJson(`${server.base}/api/admin.php?action=verificar`);
  assert.equal(admin.status, 500, admin.text);
  assert.match(admin.json.message, /Configuración crítica/);

  const foro = await postJson(`${server.base}/api/foro.php?action=auth_google`, { token: "tok-valido", nombre: "Hincha" });
  assert.equal(foro.status, 401, foro.text);
});

test("[PHP] el entorno no se deduce de cabeceras del cliente (Host / SERVER_NAME)", { skip: skipPhp }, () => {
  const dir = makeSandbox();
  try {
    const common = path.join(dir, "api", "_common.php");
    const probe = (server, nodeEnv = "") => {
      const assigns = Object.entries(server).map(([k, v]) => `$_SERVER[${JSON.stringify(k)}] = ${JSON.stringify(v)};`).join(" ");
      const out = execFileSync(PHP_BIN, ["-r", `${assigns} require ${JSON.stringify(common)}; echo json_encode(["env" => api_env_name(), "prod" => api_is_production()]);`], {
        env: { ...process.env, NODE_ENV: nodeEnv, APP_ENV: "" }
      }).toString();
      return JSON.parse(out);
    };

    // Antes: Host: localhost desde una IP pública desactivaba el modo producción
    assert.deepEqual(probe({ REMOTE_ADDR: "203.0.113.7", HTTP_HOST: "localhost", SERVER_NAME: "localhost" }), { env: "production", prod: true });
    // Un .env de producción con NODE_ENV=development (copiado de .env.example) sigue fallando cerrado
    assert.deepEqual(probe({ REMOTE_ADDR: "203.0.113.7", HTTP_HOST: "estudiantina.online" }, "development"), { env: "development", prod: true });
    // Desarrollo local real (WAMP / php -S)
    assert.deepEqual(probe({ REMOTE_ADDR: "127.0.0.1", HTTP_HOST: "localhost" }), { env: "development", prod: false });
    assert.deepEqual(probe({ REMOTE_ADDR: "::1", HTTP_HOST: "localhost" }, "test"), { env: "test", prod: false });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
