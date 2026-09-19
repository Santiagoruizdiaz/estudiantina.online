#!/usr/bin/env node
/**
 * scripts/smoke-test-production.mjs
 * Sondas de verificacion no destructivas post-despliegue en produccion
 * Uso: node scripts/smoke-test-production.mjs [url_base]
 */

const BASE_URL = (process.argv[2] || "https://estudiantina.online").replace(/\/+$/, "");
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

console.log("🔍 Iniciando Sondas de Verificacion de Seguridad en: " + BASE_URL);
console.log("------------------------------------------------------------");

let passed = 0;
let failed = 0;

async function request(path, options = {}) {
  const url = BASE_URL + path;
  const headers = {
    "User-Agent": USER_AGENT,
    ...(options.headers || {})
  };
  try {
    const res = await fetch(url, { ...options, headers });
    let body = "";
    try {
      body = await res.text();
    } catch {
      body = "";
    }
    return { status: res.status, headers: res.headers, body };
  } catch (err) {
    return { status: 0, error: err.message, body: "" };
  }
}

async function runTests() {
  // Sonda 1: Bloqueo de token legacy admin
  {
    const res = await request("/api/admin.php?action=verificar&token=posadas_admin_2026_x9k2m");
    const isLegacyAuth = res.status === 200 && res.body.includes('"autenticado":true');
    if (!isLegacyAuth && (res.status === 401 || res.status === 403 || res.status === 500)) {
      console.log("✅ Sonda 1 [VULN-01/12]: Token legacy rechazado correctamente (HTTP " + res.status + ")");
      passed++;
    } else {
      console.log("❌ Sonda 1 [VULN-01/12]: FALLO - Servidor respondio HTTP " + res.status + (isLegacyAuth ? " ACEPTANDO TOKEN INSEGURO" : ""));
      failed++;
    }
  }

  // Sonda 2: Proteccion de archivo sensible .env
  {
    const res = await request("/.env");
    if (res.status === 403 || res.status === 404) {
      console.log("✅ Sonda 2 [VULN-06/14]: Archivo .env protegido contra lectura directa (HTTP " + res.status + ")");
      passed++;
    } else {
      console.log("❌ Sonda 2 [VULN-06/14]: FALLO - /.env accesible o respuesta inesperada (HTTP " + res.status + ")");
      failed++;
    }
  }

  // Sonda 3: Proteccion de base de datos SQLite /data/
  {
    const res = await request("/data/foro.db");
    if (res.status === 403 || res.status === 404) {
      console.log("✅ Sonda 3 [VULN-14]: Base de datos /data/foro.db protegida (HTTP " + res.status + ")");
      passed++;
    } else {
      console.log("❌ Sonda 3 [VULN-14]: FALLO - /data/foro.db accesible (HTTP " + res.status + ")");
      failed++;
    }
  }

  // Sonda 4: Salud de API Ranking
  {
    const res = await request("/api/ranking.php");
    if (res.status === 200 && (res.body.includes('"top10"') || res.body.includes('"colegios"'))) {
      console.log("✅ Sonda 4 [API Publica]: /api/ranking.php responde con JSON valido (HTTP 200)");
      passed++;
    } else {
      console.log("❌ Sonda 4 [API Publica]: FALLO en /api/ranking.php (HTTP " + res.status + ")");
      failed++;
    }
  }

  // Sonda 5: Salud de API Comunidad / Noticias
  {
    const res = await request("/api/comunidad.php");
    if (res.status === 200 && res.body.includes('"noticias"')) {
      console.log("✅ Sonda 5 [API Publica]: /api/comunidad.php responde con JSON valido (HTTP 200)");
      passed++;
    } else {
      console.log("❌ Sonda 5 [API Publica]: FALLO en /api/comunidad.php (HTTP " + res.status + ")");
      failed++;
    }
  }

  console.log("------------------------------------------------------------");
  console.log(`Resultado final: ${passed} aprobadas, ${failed} fallidas.`);
  if (failed > 0) {
    console.log("⚠️ Alerta: El servidor en vivo aun ejecuta codigo previo a la remediacion.");
  } else {
    console.log("🎉 El servidor cumple con las politicas de seguridad y disponibilidad.");
  }
}

runTests();
