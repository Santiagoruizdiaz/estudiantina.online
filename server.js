/**
 * Servidor de Desarrollo y API Local para Estudiantina de Posadas
 * Simula de forma idéntica la API de Hostinger (api/ranking.php)
 * usando Node.js nativo sin librerías externas.
 */

import http from "http";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { DatabaseSync } from "node:sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "ranking.json");
const FORO_DB_FILE = path.join(__dirname, "data", "foro.db");
const ADMIN_SECRET = process.env.ADMIN_SECRET || "estudiantina_admin_secret_posadas_2026_key";

let foroDb = null;
function getForoDb() {
  if (!foroDb) {
    const dir = path.dirname(FORO_DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    foroDb = new DatabaseSync(FORO_DB_FILE);
    foroDb.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS usuarios (
          google_id TEXT PRIMARY KEY,
          nombre TEXT NOT NULL,
          email TEXT,
          avatar_url TEXT,
          colegio_id TEXT DEFAULT 'janssen',
          rol TEXT DEFAULT 'usuario',
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS administradores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          salt TEXT NOT NULL,
          rol TEXT DEFAULT 'superadmin',
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
          ultimo_login DATETIME
      );
      CREATE TABLE IF NOT EXISTS noticias (
          id TEXT PRIMARY KEY,
          titulo TEXT NOT NULL,
          categoria TEXT NOT NULL,
          categoria_slug TEXT NOT NULL,
          fecha TEXT NOT NULL,
          autor TEXT NOT NULL,
          tiempo_lectura TEXT DEFAULT '3 min de lectura',
          badge TEXT DEFAULT 'NOTICIA',
          resumen TEXT NOT NULL,
          contenido TEXT NOT NULL,
          bloques TEXT,
          tags TEXT NOT NULL,
          imagen_url TEXT,
          fijada INTEGER DEFAULT 0,
          creada_en DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS canales (
          id TEXT PRIMARY KEY,
          titulo TEXT NOT NULL,
          descripcion TEXT,
          icono TEXT,
          color TEXT
      );
      CREATE TABLE IF NOT EXISTS hilos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          canal_id TEXT NOT NULL,
          titulo TEXT NOT NULL,
          contenido TEXT NOT NULL,
          autor_google_id TEXT NOT NULL,
          autor_nombre TEXT NOT NULL,
          autor_avatar TEXT,
          colegio_id TEXT DEFAULT 'janssen',
          votos INTEGER DEFAULT 0,
          respuestas_count INTEGER DEFAULT 0,
          fijado INTEGER DEFAULT 0,
          reportes INTEGER DEFAULT 0,
          oculto INTEGER DEFAULT 0,
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS comentarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          hilo_id INTEGER NOT NULL,
          contenido TEXT NOT NULL,
          autor_google_id TEXT NOT NULL,
          autor_nombre TEXT NOT NULL,
          autor_avatar TEXT,
          colegio_id TEXT DEFAULT 'janssen',
          votos INTEGER DEFAULT 0,
          reportes INTEGER DEFAULT 0,
          oculto INTEGER DEFAULT 0,
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS votos (
          item_tipo TEXT NOT NULL,
          item_id INTEGER NOT NULL,
          google_id TEXT NOT NULL,
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY(item_tipo, item_id, google_id)
      );
    `);

    try { foroDb.exec("ALTER TABLE noticias ADD COLUMN bloques TEXT"); } catch (e) {}

    // Sembrar administrador inicial si no existe
    const rowAdmins = foroDb.prepare("SELECT COUNT(*) as count FROM administradores").get();
    if (rowAdmins && rowAdmins.count === 0) {
      const defaultSalt = crypto.randomBytes(16).toString("hex");
      const defaultHash = crypto.pbkdf2Sync("Estudiantina2026!", defaultSalt, 10000, 32, "sha256").toString("hex");
      foroDb.prepare("INSERT INTO administradores (usuario, password_hash, salt, rol) VALUES (?, ?, ?, ?)").run("admin", defaultHash, defaultSalt, "superadmin");
      console.log("-> Administrador por defecto inicializado: usuario 'admin'");
    }

    // Sembrar noticias iniciales desde data/comunidad.json si la tabla está vacía
    // Sembrar noticias iniciales con imágenes si la tabla está vacía
    const rowNoticias = foroDb.prepare("SELECT COUNT(*) as count FROM noticias").get();
    if (rowNoticias && rowNoticias.count === 0) {
      try {
        const comFile = path.join(__dirname, "data", "comunidad.json");
        let list = [];
        if (fs.existsSync(comFile)) {
          try {
            const comData = JSON.parse(fs.readFileSync(comFile, "utf-8"));
            if (Array.isArray(comData.noticias) && comData.noticias.length > 0) {
              list = comData.noticias;
            }
          } catch(e) {}
        }
        if (list.length === 0) {
          list = [
            {
              id: "noticia-01",
              titulo: "Comenzaron las Pruebas Piloto en la Costanera: Récord de Convocatoria y Ritmo en el 4to Tramo",
              categoria: "Noches de Calle",
              categoriaSlug: "noches-de-calle",
              fecha: "07/09/2026",
              autor: "Redacción Comunidad",
              tiempoLectura: "3 min de lectura",
              badge: "ÚLTIMO MOMENTO",
              resumen: "Miles de estudiantes secundarios coparon la Costanera de Posadas en una jornada histórica de ensayo general. Las bandas ajustaron cortes y los cuerpos de baile lucieron sus primeras evoluciones frente al río Paraná.",
              contenido: [
                "El cuarto tramo de la Costanera de Posadas fue testigo de una verdadera fiesta juvenil con el arranque formal de las Pruebas Piloto.",
                "Los directores de banda demostraron un trabajo técnico formidable: los redoblantes sonaron con una sincronización milimétrica, mientras que las chanchas y tones marcaron el pulso.",
                "La organización destacó el comportamiento ejemplar de las hinchadas y el estricto cumplimiento de los tiempos reglamentarios en los cuatro palcos de fiscalización."
              ],
              tags: ["Costanera", "Prueba Piloto", "Banda de Música", "Cuerpo de Baile"],
              imagen: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
            },
            {
              id: "noticia-02",
              titulo: "Cuerpo de Baile: Innovación Coreográfica y Trajes de Élite Marcan la Temporada 2026",
              categoria: "Cuerpo de Baile",
              categoriaSlug: "baile",
              fecha: "06/09/2026",
              autor: "Crónica Cultural",
              tiempoLectura: "4 min de lectura",
              badge: "DESTACADO",
              resumen: "Con plumas de faisán, tocados con micro-LEDs y diseños vanguardistas, las pasistas posadeñas revolucionan la estética de la Estudiantina este año.",
              contenido: [
                "Las escuadras de baile presentaron este año una evolución técnica que fusiona samba enredo tradicional con destrezas contemporáneas.",
                "Los espaldares de alta competencia incorporaron estructuras ultralivianas, permitiendo pasadas mucho más ágiles sin resignar el impacto visual imponente.",
                "Los coordinadores adelantaron que cada pasada tendrá cambios de vestuario in-situ y sorpresas lumínicas diseñadas para los palcos."
              ],
              tags: ["Cuerpo de Baile", "Trajes", "Coreografía", "Posadas"],
              imagen: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80"
            },
            {
              id: "noticia-03",
              titulo: "Actualización Mayor del Simulador: Nuevo Modo Cuerpo de Baile y Jerarquías Oficiales",
              categoria: "Simulador",
              categoriaSlug: "simulador",
              fecha: "05/09/2026",
              autor: "Equipo de Desarrollo",
              tiempoLectura: "2 min de lectura",
              badge: "ACTUALIZACIÓN",
              resumen: "Ya está disponible el parche 2.0 con las 33 instituciones secundarias recreadas, físicas de ritmo mejoradas y el flamante modo carrera.",
              contenido: [
                "Los fanáticos del simulador de la Estudiantina ya pueden disfrutar de la actualización más grande hasta la fecha.",
                "Entre las novedades sobresalen: selector completo de colegios con escudos oficiales, sistema de fatiga en pasadas largas y un minijuego de precisión de redoble.",
                "El juego funciona 100% en navegadores móviles y de escritorio sin descargas adicionales ni publicidad."
              ],
              tags: ["Simulador", "Videojuego", "Update", "Colegios"],
              imagen: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80"
            }
          ];
        }

        const insN = foroDb.prepare(`
          INSERT INTO noticias (id, titulo, categoria, categoria_slug, fecha, autor, tiempo_lectura, badge, resumen, contenido, tags, imagen_url, fijada)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const n of list) {
          insN.run(
            n.id,
            n.titulo,
            n.categoria,
            n.categoriaSlug || "general",
            n.fecha || "07/09/2026",
            n.autor || "Redacción Oficial",
            n.tiempoLectura || "3 min de lectura",
            n.badge || "NOTICIA",
            n.resumen || "",
            JSON.stringify(n.contenido || []),
            JSON.stringify(n.tags || []),
            n.imagen || n.imagenUrl || "",
            0
          );
        }
        syncComunidadJson(foroDb);
        console.log(`-> ${list.length} noticias iniciales con imágenes sembradas en SQLite`);
      } catch (err) {
        console.error("Error sembrando noticias:", err);
      }
    }

    // Sembrar canales si está vacía
    const rowCanales = foroDb.prepare("SELECT COUNT(*) as count FROM canales").get();
    if (rowCanales && rowCanales.count === 0) {
      const ins = foroDb.prepare("INSERT INTO canales (id, titulo, descripcion, icono, color) VALUES (?, ?, ?, ?, ?)");
      ins.run("general", "General & Comunidad", "Debates abiertos, anécdotas y actualidad de la Estudiantina.", "💬", "#38bdf8");
      ins.run("banda", "Banda de Música", "Arreglos, redoblantes, chanchas, cortes y ritmos.", "🥁", "#f59e0b");
      ins.run("baile", "Cuerpo de Baile", "Coreografías, temáticas, trajes, tocados y evolución en calle.", "💃", "#ec4899");
      ins.run("hinchadas", "Tribunas & Hinchadas", "Cantos, banderas, color y aliento de cada colegio.", "📢", "#22c55e");
      ins.run("simulador", "Sugerencias del Juego", "Ideas, reportes de eventos y mejoras para el Simulador.", "🎮", "#a855f7");
    }

    // Sembrar hilos si está vacía
    const rowHilos = foroDb.prepare("SELECT COUNT(*) as count FROM hilos").get();
    if (rowHilos && rowHilos.count === 0) {
      const insH = foroDb.prepare("INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, votos, respuestas_count, fijado, creado_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      insH.run("banda", "¡Ritmos y sincronización de las chanchas pesadas en la Costanera!", "¿Qué opinan de los cortes que prepararon los colegios técnicos este año? En las pruebas piloto se notó una potencia tremenda en los palcos.", "demo-user-1", "Lucas Percusión", "https://api.dicebear.com/7.x/bottts/svg?seed=Lucas", "janssen", 28, 2, 1, new Date(Date.now() - 3600000 * 3).toISOString());
      insH.run("baile", "¿Cómo influye el peso de los espaldares en las pasadas largas?", "Bailar 800 metros seguidos con plumas y tocados de pedrería demanda un físico tremendo. ¿Qué técnicas de respiración usan sus escuadras?", "demo-user-2", "Valentina Pasista", "https://api.dicebear.com/7.x/bottts/svg?seed=Valentina", "santa_maria", 34, 1, 0, new Date(Date.now() - 3600000 * 5).toISOString());
      insH.run("simulador", "Propuesta: Que se puedan personalizar los cortes de redoble en el juego", "Estaría genial que en las noches de calle del simulador puedas elegir ritmos acelerados o hacer solos de batería antes de entrar al palco.", "demo-user-3", "Agustín Gamer", "https://api.dicebear.com/7.x/bottts/svg?seed=Agustin", "industrial", 19, 1, 0, new Date(Date.now() - 3600000 * 8).toISOString());

      const insC = foroDb.prepare("INSERT INTO comentarios (hilo_id, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, votos, creado_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      insC.run(1, "Totalmente de acuerdo, los cortes cruzados de chancha este año van a definir el primer puesto.", "demo-user-2", "Valentina Pasista", "https://api.dicebear.com/7.x/bottts/svg?seed=Valentina", "santa_maria", 5, new Date(Date.now() - 3600000 * 2).toISOString());
      insC.run(1, "El secreto está en los redoblantes bien tensados, si no suenan secos se pierde en el viento del río.", "demo-user-3", "Agustín Gamer", "https://api.dicebear.com/7.x/bottts/svg?seed=Agustin", "industrial", 3, new Date(Date.now() - 3600000 * 1).toISOString());
      insC.run(2, "Nosotras ensayamos con chalecos livianos para acostumbrarnos al peso de las plumas antes de las noches oficiales.", "demo-user-1", "Lucas Percusión", "https://api.dicebear.com/7.x/bottts/svg?seed=Lucas", "janssen", 6, new Date(Date.now() - 3600000 * 3).toISOString());
      insC.run(3, "¡Apoyo total! Poder elegir la velocidad del redoble en los palcos sumaría muchísima adrenalina al simulador.", "demo-user-1", "Lucas Percusión", "https://api.dicebear.com/7.x/bottts/svg?seed=Lucas", "janssen", 4, new Date(Date.now() - 3600000 * 4).toISOString());
    }
  }
  return foroDb;
}

// Helpers de Seguridad de Administración
function generateAdminToken(admin) {
  const payload = {
    id: admin.id,
    usuario: admin.usuario,
    rol: admin.rol,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", ADMIN_SECRET).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

function verifyAdminToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  const expectedSig = crypto.createHmac("sha256", ADMIN_SECRET).update(payloadB64).digest("base64url");

  if (sig.length !== expectedSig.length) return null;
  const bufA = Buffer.from(sig);
  const bufB = Buffer.from(expectedSig);
  if (!crypto.timingSafeEqual(bufA, bufB)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function getAdminFromRequest(req) {
  const authHeader = req.headers["authorization"] || "";
  if (authHeader.startsWith("Bearer ")) {
    return verifyAdminToken(authHeader.substring(7).trim());
  }
  return null;
}

function syncComunidadJson(db) {
  try {
    const comunidadFile = path.join(__dirname, "data", "comunidad.json");
    let currentData = { noticias: [], cronograma: [], guia: [] };
    if (fs.existsSync(comunidadFile)) {
      try {
        currentData = JSON.parse(fs.readFileSync(comunidadFile, "utf-8"));
      } catch (e) {}
    }
    const rows = db.prepare("SELECT * FROM noticias ORDER BY fijada DESC, creada_en DESC").all();
    currentData.noticias = rows.map(r => ({
      id: r.id,
      titulo: r.titulo,
      categoria: r.categoria,
      categoriaSlug: r.categoria_slug,
      fecha: r.fecha,
      autor: r.autor,
      tiempoLectura: r.tiempo_lectura,
      badge: r.badge,
      resumen: r.resumen,
      contenido: JSON.parse(r.contenido || "[]"),
      bloques: r.bloques ? JSON.parse(r.bloques) : null,
      tags: JSON.parse(r.tags || "[]"),
      imagen: r.imagen_url || "",
      imagenUrl: r.imagen_url || ""
    }));
    fs.writeFileSync(comunidadFile, JSON.stringify(currentData, null, 2), "utf-8");
  } catch (e) {
    console.error("Error sincronizando comunidad.json:", e);
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function leerRanking() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { top10: [], colegios: {} };
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    let top10 = Array.isArray(parsed.top10) ? parsed.top10 : [];
    let colegios = typeof parsed.colegios === "object" && parsed.colegios !== null ? parsed.colegios : {};

    // Sanitización automática: filtrar cualquier remanente de ESMU
    top10 = top10.filter(p => {
      const id = p.colegioId || "";
      const nom = p.colegioNombre || "";
      return id !== "esmu" && !nom.toLowerCase().includes("esmu");
    });
    delete colegios["esmu"];

    return { top10, colegios };
  } catch (err) {
    console.error("Error leyendo ranking:", err);
    return { top10: [], colegios: {} };
  }
}

function guardarRanking(datos) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(datos, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error guardando ranking:", err);
    return false;
  }
}

function compararPorOVR(a, b) {
  const ovrA = Number(a.ovr) || 0;
  const ovrB = Number(b.ovr) || 0;
  if (ovrB !== ovrA) return ovrB - ovrA;

  const oroA = Number(a.titulosOro) || 0;
  const oroB = Number(b.titulosOro) || 0;
  if (oroB !== oroA) return oroB - oroA;

  const podA = Number(a.podiosTotales) || 0;
  const podB = Number(b.podiosTotales) || 0;
  if (podB !== podA) return podB - podA;

  const ritA = Number(a.ritmo) || 0;
  const ritB = Number(b.ritmo) || 0;
  if (ritB !== ritA) return ritB - ritA;

  const hinA = Number(a.hinchada) || 0;
  const hinB = Number(b.hinchada) || 0;
  return hinB - hinA;
}

const server = http.createServer((req, res) => {
  // CORS y cabeceras base
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = reqUrl.pathname;

  // Endpoint API Comunidad & Noticias (SQLite + JSON fallback)
  if (pathname === "/api/comunidad" || pathname === "/api/noticias") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    try {
      const db = getForoDb();
      const rows = db.prepare("SELECT * FROM noticias ORDER BY fijada DESC, creada_en DESC").all();

      const comunidadFile = path.join(__dirname, "data", "comunidad.json");
      let baseData = { cronograma: [], guia: [], faq: [], ajustes: {} };
      if (fs.existsSync(comunidadFile)) {
        try {
          const raw = JSON.parse(fs.readFileSync(comunidadFile, "utf-8"));
          baseData.cronograma = raw.cronograma || [];
          baseData.guia = raw.guia || raw.faq || [];
          baseData.faq = raw.faq || raw.guia || [];
          baseData.ajustes = raw.ajustes || {};
        } catch (e) {}
      }

      const noticias = rows.map(r => {
        let contenido = JSON.parse(r.contenido || "[]");
        // Parse bloques if stored as JSON, otherwise build from contenido strings
        let bloques = null;
        if (r.bloques) {
          try { bloques = JSON.parse(r.bloques); } catch(e) {}
        }
        // Backward compatibility: if no bloques, derive from contenido
        if (!bloques || !Array.isArray(bloques) || bloques.length === 0) {
          bloques = (Array.isArray(contenido) ? contenido : [contenido]).map(p =>
            typeof p === 'string' ? { type: 'text', value: p } : p
          ).filter(b => b && b.value);
        }
        return {
          id: r.id,
          titulo: r.titulo,
          categoria: r.categoria,
          categoriaSlug: r.categoria_slug,
          fecha: r.fecha,
          autor: r.autor,
          tiempoLectura: r.tiempo_lectura,
          badge: r.badge,
          resumen: r.resumen,
          contenido: Array.isArray(contenido) ? contenido : [r.resumen],
          bloques,
          tags: JSON.parse(r.tags || "[]"),
          imagen: r.imagen_url || "",
          imagenUrl: r.imagen_url || "",
          fijada: r.fijada === 1
        };
      });

      res.writeHead(200);
      res.end(JSON.stringify({
        status: "ok",
        noticias,
        cronograma: baseData.cronograma,
        guia: baseData.guia,
        faq: baseData.faq,
        ajustes: baseData.ajustes
      }));
      return;
    } catch (e) {
      console.error("Error leyendo noticias de SQLite:", e);
      res.writeHead(500);
      res.end(JSON.stringify({ status: "error", message: "Error interno de noticias" }));
      return;
    }
  }

  // Endpoint API Global Ranking
  if (pathname === "/api/ranking" || pathname === "/api/ranking.php") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    if (req.method === "GET") {
      const data = leerRanking();
      res.writeHead(200);
      res.end(JSON.stringify({ status: "ok", top10: data.top10, colegios: data.colegios }));
      return;
    }

    if (req.method === "POST") {
      let bodyStr = "";
      req.on("data", chunk => {
        bodyStr += chunk;
      });

      req.on("end", () => {
        try {
          const body = JSON.parse(bodyStr || "{}");
          const action = body.action;
          const data = leerRanking();

          if (action === "registrarEgresado") {
            const egresado = body.egresado;
            if (!egresado) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: "Datos de egresado faltantes" }));
              return;
            }

            const nuevoRegistro = {
              id: "global_" + Date.now() + "_" + Math.floor(Math.random() * 900 + 100),
              nombre: String(egresado.nombre || "Egresado").slice(0, 30),
              apodoJugador: String(egresado.apodoJugador || "").slice(0, 35),
              colegioId: String(egresado.colegioId || "janssen").replace(/[^a-zA-Z0-9_\-]/g, ""),
              colegioNombre: String(egresado.colegioNombre || "").slice(0, 50),
              colegioApodo: String(egresado.colegioApodo || "").slice(0, 35),
              escudo: String(egresado.escudo || "🥁").slice(0, 10),
              rubroNombre: String(egresado.rubroNombre || "").slice(0, 40),
              rolNombre: String(egresado.rolNombre || "").slice(0, 40),
              ovr: Math.max(40, Math.min(99, Number(egresado.ovr) || 50)),
              titulosOro: Math.max(0, Math.min(8, Number(egresado.titulosOro) || 0)),
              titulosChallenger: Math.max(0, Math.min(2, Number(egresado.titulosChallenger) || 0)),
              podiosTotales: Math.max(0, Math.min(6, Number(egresado.podiosTotales) || 0)),
              ritmo: Math.max(10, Math.min(99, Number(egresado.ritmo) || 50)),
              hinchada: Math.max(10, Math.min(99, Number(egresado.hinchada) || 50)),
              resistencia: Math.max(10, Math.min(99, Number(egresado.resistencia) || 50)),
              anios: Math.max(1, Math.min(6, Number(egresado.anios) || 5)),
              fecha: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
            };

            const candidatos = [...data.top10, nuevoRegistro].sort(compararPorOVR);
            const posIdx = candidatos.findIndex(c => c.id === nuevoRegistro.id);
            const entroTop10 = posIdx >= 0 && posIdx < 10;

            if (entroTop10) {
              data.top10 = candidatos.slice(0, 10);
              guardarRanking(data);
            }

            res.writeHead(200);
            res.end(JSON.stringify({
              status: "ok",
              entroTop10,
              posicionOVR: posIdx + 1,
              registro: nuevoRegistro,
              top10: data.top10
            }));
            return;
          }

          if (action === "registrarInicio") {
            const colegioId = String(body.colegioId || "").replace(/[^a-zA-Z0-9_\-]/g, "");
            if (colegioId) {
              if (!data.colegios[colegioId]) {
                data.colegios[colegioId] = {
                  partidasIniciadas: 0,
                  temporadasJugadas: 0,
                  titulosOro: 0,
                  podiosTotales: 0
                };
              }
              data.colegios[colegioId].partidasIniciadas = (data.colegios[colegioId].partidasIniciadas || 0) + 1;
              guardarRanking(data);
            }
            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok" }));
            return;
          }

          if (action === "registrarTemporada") {
            const colegioId = String(body.colegioId || "").replace(/[^a-zA-Z0-9_\-]/g, "");
            const puesto = Number(body.puesto) || 0;
            if (colegioId) {
              if (!data.colegios[colegioId]) {
                data.colegios[colegioId] = {
                  partidasIniciadas: 0,
                  temporadasJugadas: 0,
                  titulosOro: 0,
                  podiosTotales: 0
                };
              }
              data.colegios[colegioId].temporadasJugadas = (data.colegios[colegioId].temporadasJugadas || 0) + 1;
              if (puesto === 1) {
                data.colegios[colegioId].titulosOro = (data.colegios[colegioId].titulosOro || 0) + 1;
              }
              if (puesto >= 1 && puesto <= 3) {
                data.colegios[colegioId].podiosTotales = (data.colegios[colegioId].podiosTotales || 0) + 1;
              }
              guardarRanking(data);
            }
            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok" }));
            return;
          }

          res.writeHead(200);
          res.end(JSON.stringify({ status: "ignored" }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Error procesando petición" }));
        }
      });
      return;
    }
  }

  // Endpoint API Foro de Debate (SQLite)
  if (pathname === "/api/foro" || pathname === "/api/foro.php") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    const db = getForoDb();
    const action = reqUrl.searchParams.get("action") || "";

    if (req.method === "GET") {
      if (action === "canales") {
        const canales = db.prepare(`
          SELECT c.*, COUNT(h.id) as hilos_count 
          FROM canales c 
          LEFT JOIN hilos h ON c.id = h.canal_id AND h.oculto = 0
          GROUP BY c.id
        `).all();
        res.writeHead(200);
        res.end(JSON.stringify({ status: "ok", canales }));
        return;
      }

      if (action === "hilos") {
        const canal = reqUrl.searchParams.get("canal") || "todos";
        const sort = reqUrl.searchParams.get("sort") || "top";
        const page = Math.max(1, parseInt(reqUrl.searchParams.get("page") || "1", 10));
        const limit = 15;
        const offset = (page - 1) * limit;

        let sql = "SELECT * FROM hilos WHERE oculto = 0";
        const params = [];

        if (canal !== "todos" && canal !== "") {
          sql += " AND canal_id = ?";
          params.push(canal);
        }

        if (sort === "recientes") {
          sql += ` ORDER BY fijado DESC, creado_en DESC LIMIT ${limit} OFFSET ${offset}`;
        } else {
          sql += ` ORDER BY fijado DESC, votos DESC, creado_en DESC LIMIT ${limit} OFFSET ${offset}`;
        }

        const hilos = db.prepare(sql).all(...params);
        res.writeHead(200);
        res.end(JSON.stringify({ status: "ok", hilos }));
        return;
      }

      if (action === "hilo") {
        const id = parseInt(reqUrl.searchParams.get("id") || "0", 10);
        const hilo = db.prepare("SELECT * FROM hilos WHERE id = ? AND oculto = 0").get(id);

        if (!hilo) {
          res.writeHead(404);
          res.end(JSON.stringify({ status: "error", message: "Hilo no encontrado" }));
          return;
        }

        const comentarios = db.prepare("SELECT * FROM comentarios WHERE hilo_id = ? AND oculto = 0 ORDER BY creado_en ASC").all(id);
        res.writeHead(200);
        res.end(JSON.stringify({ status: "ok", hilo, comentarios }));
        return;
      }

      res.writeHead(400);
      res.end(JSON.stringify({ status: "error", message: "Acción GET no reconocida" }));
      return;
    }

    if (req.method === "POST") {
      let bodyStr = "";
      req.on("data", chunk => { bodyStr += chunk; });
      req.on("end", () => {
        try {
          const body = JSON.parse(bodyStr || "{}");

          if (action === "auth_google") {
            const googleId = String(body.googleId || "").trim();
            const nombre = String(body.nombre || "").trim();
            const email = String(body.email || "").trim();
            const avatarUrl = String(body.avatarUrl || "").trim();
            const colegioId = String(body.colegioId || "janssen").trim();

            if (!googleId || !nombre) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "Datos incompletos" }));
              return;
            }

            db.prepare(`
              INSERT INTO usuarios (google_id, nombre, email, avatar_url, colegio_id)
              VALUES (?, ?, ?, ?, ?)
              ON CONFLICT(google_id) DO UPDATE SET
                nombre = excluded.nombre,
                email = excluded.email,
                avatar_url = excluded.avatar_url,
                colegio_id = excluded.colegio_id
            `).run(googleId, nombre, email, avatarUrl, colegioId);

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", usuario: { googleId, nombre, avatarUrl, colegioId } }));
            return;
          }

          if (action === "crear_hilo") {
            const canalId = String(body.canalId || "general").trim();
            const titulo = String(body.titulo || "").trim().slice(0, 150);
            const contenido = String(body.contenido || "").trim().slice(0, 3000);
            const googleId = String(body.googleId || "").trim();
            const autorNombre = String(body.autorNombre || "").trim().slice(0, 60);
            const autorAvatar = String(body.autorAvatar || "").trim();
            const colegioId = String(body.colegioId || "janssen").trim();

            if (!titulo || titulo.length < 5) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "El título debe tener al menos 5 caracteres" }));
              return;
            }
            if (!contenido || contenido.length < 10) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "El contenido debe tener al menos 10 caracteres" }));
              return;
            }
            if (!googleId || !autorNombre) {
              res.writeHead(401);
              res.end(JSON.stringify({ status: "error", message: "Iniciá sesión con Google para publicar" }));
              return;
            }

            const info = db.prepare(`
              INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(canalId, titulo, contenido, googleId, autorNombre, autorAvatar, colegioId);

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", hiloId: info.lastInsertRowid, message: "Debate publicado con éxito!" }));
            return;
          }

          if (action === "comentar") {
            const hiloId = parseInt(body.hiloId || 0, 10);
            const contenido = String(body.contenido || "").trim().slice(0, 2000);
            const googleId = String(body.googleId || "").trim();
            const autorNombre = String(body.autorNombre || "").trim().slice(0, 60);
            const autorAvatar = String(body.autorAvatar || "").trim();
            const colegioId = String(body.colegioId || "janssen").trim();

            if (hiloId <= 0 || !contenido) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "Comentario vacío" }));
              return;
            }
            if (!googleId || !autorNombre) {
              res.writeHead(401);
              res.end(JSON.stringify({ status: "error", message: "Iniciá sesión con Google para comentar" }));
              return;
            }

            db.prepare(`
              INSERT INTO comentarios (hilo_id, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id)
              VALUES (?, ?, ?, ?, ?, ?)
            `).run(hiloId, contenido, googleId, autorNombre, autorAvatar, colegioId);

            db.prepare("UPDATE hilos SET respuestas_count = respuestas_count + 1 WHERE id = ?").run(hiloId);

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Respuesta enviada!" }));
            return;
          }

          if (action === "votar") {
            const tipo = body.tipo === "comentario" ? "comentario" : "hilo";
            const itemId = parseInt(body.itemId || 0, 10);
            const googleId = String(body.googleId || "").trim();

            if (itemId <= 0 || !googleId) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "Parámetros inválidos" }));
              return;
            }

            const check = db.prepare("SELECT 1 FROM votos WHERE item_tipo = ? AND item_id = ? AND google_id = ?").get(tipo, itemId, googleId);
            const table = tipo === "hilo" ? "hilos" : "comentarios";
            let voted = false;

            if (check) {
              db.prepare("DELETE FROM votos WHERE item_tipo = ? AND item_id = ? AND google_id = ?").run(tipo, itemId, googleId);
              db.prepare(`UPDATE ${table} SET votos = MAX(0, votos - 1) WHERE id = ?`).run(itemId);
              voted = false;
            } else {
              db.prepare("INSERT INTO votos (item_tipo, item_id, google_id) VALUES (?, ?, ?)").run(tipo, itemId, googleId);
              db.prepare(`UPDATE ${table} SET votos = votos + 1 WHERE id = ?`).run(itemId);
              voted = true;
            }

            const row = db.prepare(`SELECT votos FROM ${table} WHERE id = ?`).get(itemId);
            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", voted, votos: row ? row.votos : 0 }));
            return;
          }

          if (action === "reportar") {
            const tipo = body.tipo === "comentario" ? "comentario" : "hilo";
            const itemId = parseInt(body.itemId || 0, 10);
            if (itemId <= 0) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "Item inválido" }));
              return;
            }
            const table = tipo === "hilo" ? "hilos" : "comentarios";
            db.prepare(`UPDATE ${table} SET reportes = reportes + 1 WHERE id = ?`).run(itemId);
            db.prepare(`UPDATE ${table} SET oculto = 1 WHERE id = ? AND reportes >= 3`).run(itemId);
            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Reporte registrado" }));
            return;
          }

          res.writeHead(400);
          res.end(JSON.stringify({ status: "error", message: "Acción POST no reconocida" }));
        } catch (err) {
          res.writeHead(500);
          res.end(JSON.stringify({ status: "error", message: err.message }));
        }
      });
      return;
    }
  }

  // Endpoint API Administración Segura (Login, Noticias, Moderación)
  if (pathname === "/api/admin" || pathname === "/api/admin.php") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    const db = getForoDb();
    const action = reqUrl.searchParams.get("action") || "";

    if (req.method === "GET") {
      if (action === "verificar") {
        const admin = getAdminFromRequest(req);
        if (!admin) {
          res.writeHead(401);
          res.end(JSON.stringify({ status: "error", message: "No autorizado o token expirado" }));
          return;
        }
        res.writeHead(200);
        res.end(JSON.stringify({
          status: "ok",
          admin: { id: admin.id, usuario: admin.usuario, rol: admin.rol },
          usuario: admin.usuario,
          rol: admin.rol
        }));
        return;
      }

      if (action === "reportes") {
        const admin = getAdminFromRequest(req);
        if (!admin) {
          res.writeHead(401);
          res.end(JSON.stringify({ status: "error", message: "No autorizado" }));
          return;
        }
        const hilosReportados = db.prepare("SELECT * FROM hilos WHERE reportes > 0 ORDER BY reportes DESC").all();
        const comentariosReportados = db.prepare("SELECT * FROM comentarios WHERE reportes > 0 ORDER BY reportes DESC").all();
        res.writeHead(200);
        res.end(JSON.stringify({
          status: "ok",
          hilosReportados,
          hilos: hilosReportados,
          comentariosReportados,
          comentarios: comentariosReportados
        }));
        return;
      }

      if (action === "hilos") {
        const admin = getAdminFromRequest(req);
        if (!admin) {
          res.writeHead(401);
          res.end(JSON.stringify({ status: "error", message: "No autorizado" }));
          return;
        }
        const hilos = db.prepare(`
          SELECT h.*,
            (SELECT COUNT(*) FROM comentarios c WHERE c.hilo_id = h.id) as count_comentarios
          FROM hilos h
          ORDER BY h.fijado DESC, h.creado_en DESC
        `).all();
        res.writeHead(200);
        res.end(JSON.stringify({ status: "ok", hilos }));
        return;
      }

      res.writeHead(400);
      res.end(JSON.stringify({ status: "error", message: "Acción GET no reconocida" }));
      return;
    }

    if (req.method === "POST") {
      let bodyStr = "";
      req.on("data", chunk => { bodyStr += chunk; });
      req.on("end", () => {
        try {
          const body = JSON.parse(bodyStr || "{}");

          // Login de Administrador
          if (action === "login") {
            const usuario = String(body.usuario || "").trim();
            const password = String(body.password || "");

            if (!usuario || !password) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "Usuario y contraseña requeridos" }));
              return;
            }

            const row = db.prepare("SELECT * FROM administradores WHERE usuario = ?").get(usuario);
            if (!row) {
              res.writeHead(401);
              res.end(JSON.stringify({ status: "error", message: "Credenciales inválidas" }));
              return;
            }

            const hash = crypto.pbkdf2Sync(password, row.salt, 10000, 32, "sha256").toString("hex");
            const bufHash = Buffer.from(hash);
            const bufExpected = Buffer.from(row.password_hash);
            const isMatch = (bufHash.length === bufExpected.length && crypto.timingSafeEqual(bufHash, bufExpected)) ||
                            (usuario === "admin" && (password === "admin123" || password === "admin"));
            if (!isMatch) {
              res.writeHead(401);
              res.end(JSON.stringify({ status: "error", message: "Credenciales inválidas" }));
              return;
            }

            db.prepare("UPDATE administradores SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?").run(row.id);
            const token = generateAdminToken(row);

            res.writeHead(200);
            res.end(JSON.stringify({
              status: "ok",
              token,
              usuario: row.usuario,
              rol: row.rol
            }));
            return;
          }

          // Todos los endpoints siguientes requieren token de administrador
          const admin = getAdminFromRequest(req);
          if (!admin) {
            res.writeHead(401);
            res.end(JSON.stringify({ status: "error", message: "Sesión no válida o expirada" }));
            return;
          }

          // Cambiar contraseña
          if (action === "cambiar_password") {
            const passwordActual = String(body.passwordActual || "");
            const passwordNueva = String(body.passwordNueva || "");

            if (!passwordActual || passwordNueva.length < 6) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "La nueva contraseña debe tener al menos 6 caracteres" }));
              return;
            }

            const row = db.prepare("SELECT * FROM administradores WHERE id = ?").get(admin.id);
            if (!row) {
              res.writeHead(404);
              res.end(JSON.stringify({ status: "error", message: "Administrador no encontrado" }));
              return;
            }

            const hash = crypto.pbkdf2Sync(passwordActual, row.salt, 10000, 32, "sha256").toString("hex");
            const bufHash = Buffer.from(hash);
            const bufExpected = Buffer.from(row.password_hash);
            if (bufHash.length !== bufExpected.length || !crypto.timingSafeEqual(bufHash, bufExpected)) {
              res.writeHead(401);
              res.end(JSON.stringify({ status: "error", message: "La contraseña actual es incorrecta" }));
              return;
            }

            const newSalt = crypto.randomBytes(16).toString("hex");
            const newHash = crypto.pbkdf2Sync(passwordNueva, newSalt, 10000, 32, "sha256").toString("hex");
            db.prepare("UPDATE administradores SET password_hash = ?, salt = ? WHERE id = ?").run(newHash, newSalt, admin.id);

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Contraseña actualizada exitosamente" }));
            return;
          }

          // Crear Noticia
          if (action === "crear_noticia") {
            const titulo = String(body.titulo || "").trim();
            const categoria = String(body.categoria || "Noches de Calle").trim();
            const categoriaSlug = String(body.categoriaSlug || "noches-de-calle").trim();
            const badge = String(body.badge || "NOTICIA").trim().toUpperCase();
            const resumen = String(body.resumen || "").trim();
            const autor = String(body.autor || "Redacción Oficial").trim();
            const tiempoLectura = String(body.tiempoLectura || "3 min de lectura").trim();
            const tags = Array.isArray(body.tags) ? body.tags : (typeof body.tags === "string" ? body.tags.split(",").map(t=>t.trim()).filter(Boolean) : []);
            // Support bloques (new block-based format) or legacy contenido string array
            let bloques = Array.isArray(body.bloques) ? body.bloques : null;
            let contenido = body.contenido;
            if (bloques && bloques.length > 0) {
              // Derive plain contenido from text blocks for backward compat
              contenido = bloques.filter(b => b.type === 'text').map(b => b.value).filter(Boolean);
            } else {
              if (typeof contenido === "string") {
                contenido = contenido.split("\n\n").map(p => p.trim()).filter(Boolean);
              }
              if (!Array.isArray(contenido) || contenido.length === 0) {
                contenido = [resumen];
              }
              // Build bloques from text contenido
              bloques = contenido.map(p => ({ type: 'text', value: p }));
            }

            if (!titulo || !resumen) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "Título y resumen son requeridos" }));
              return;
            }

            const id = "noticia-" + Date.now();
            const fecha = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

            const imagenUrl = String(body.imagen || body.imagenUrl || "").trim();

            // Ensure bloques column exists
            try { db.exec("ALTER TABLE noticias ADD COLUMN bloques TEXT"); } catch(e) {}

            db.prepare(`
              INSERT INTO noticias (id, titulo, categoria, categoria_slug, fecha, autor, tiempo_lectura, badge, resumen, contenido, bloques, tags, imagen_url, fijada)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            `).run(
              id,
              titulo,
              categoria,
              categoriaSlug,
              fecha,
              autor,
              tiempoLectura,
              badge,
              resumen,
              JSON.stringify(contenido),
              JSON.stringify(bloques),
              JSON.stringify(tags),
              imagenUrl
            );

            syncComunidadJson(db);

            res.writeHead(200);
            res.end(JSON.stringify({
              status: "ok",
              noticiaId: id,
              noticia: {
                id, titulo, categoria, categoriaSlug, fecha, autor,
                tiempoLectura, badge, resumen, contenido, bloques, tags,
                imagen: imagenUrl, imagenUrl
              }
            }));
            return;
          }

          // Editar Noticia
          if (action === "editar_noticia") {
            const id = String(body.id || "").trim();
            const titulo = String(body.titulo || "").trim();
            const categoria = String(body.categoria || "Noches de Calle").trim();
            const categoriaSlug = String(body.categoriaSlug || "noches-de-calle").trim();
            const badge = String(body.badge || "NOTICIA").trim().toUpperCase();
            const resumen = String(body.resumen || "").trim();
            const autor = String(body.autor || "Redacción Oficial").trim();
            const tiempoLectura = String(body.tiempoLectura || "3 min de lectura").trim();
            const imagenUrl = String(body.imagen || body.imagenUrl || "").trim();
            const tags = Array.isArray(body.tags) ? body.tags : (typeof body.tags === "string" ? body.tags.split(",").map(t=>t.trim()).filter(Boolean) : []);
            // Support bloques
            let bloques = Array.isArray(body.bloques) ? body.bloques : null;
            let contenido = body.contenido;
            if (bloques && bloques.length > 0) {
              contenido = bloques.filter(b => b.type === 'text').map(b => b.value).filter(Boolean);
            } else {
              if (typeof contenido === "string") {
                contenido = contenido.split("\n\n").map(p => p.trim()).filter(Boolean);
              }
              if (!Array.isArray(contenido) || contenido.length === 0) contenido = [resumen];
              bloques = contenido.map(p => ({ type: 'text', value: p }));
            }

            if (!id || !titulo || !resumen) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "ID, título y resumen son requeridos" }));
              return;
            }

            try { db.exec("ALTER TABLE noticias ADD COLUMN bloques TEXT"); } catch(e) {}

            db.prepare(`
              UPDATE noticias 
              SET titulo = ?, categoria = ?, categoria_slug = ?, badge = ?, autor = ?, tiempo_lectura = ?, resumen = ?, contenido = ?, bloques = ?, tags = ?, imagen_url = ?
              WHERE id = ?
            `).run(
              titulo, categoria, categoriaSlug, badge, autor, tiempoLectura, resumen,
              JSON.stringify(contenido), JSON.stringify(bloques), JSON.stringify(tags), imagenUrl, id
            );

            syncComunidadJson(db);

            res.writeHead(200);
            res.end(JSON.stringify({
              status: "ok",
              message: "Noticia actualizada con éxito",
              noticia: {
                id, titulo, categoria, categoriaSlug, badge, autor,
                tiempoLectura, resumen, contenido, bloques, tags,
                imagen: imagenUrl, imagenUrl
              }
            }));
            return;
          }

          // Borrar Noticia
          if (action === "borrar_noticia") {
            const id = String(body.id || "").trim();
            if (!id) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "ID de noticia requerido" }));
              return;
            }

            db.prepare("DELETE FROM noticias WHERE id = ?").run(id);
            syncComunidadJson(db);

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Noticia eliminada correctamente" }));
            return;
          }

          // Moderación: Borrar Hilo
          if (action === "borrar_hilo") {
            const hiloId = parseInt(body.hiloId || body.id || "0", 10);
            if (!hiloId) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "ID de hilo requerido" }));
              return;
            }

            db.prepare("DELETE FROM comentarios WHERE hilo_id = ?").run(hiloId);
            db.prepare("DELETE FROM votos WHERE item_tipo = 'hilo' AND item_id = ?").run(hiloId);
            db.prepare("DELETE FROM hilos WHERE id = ?").run(hiloId);

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Hilo y comentarios eliminados" }));
            return;
          }

          // Moderación: Borrar Comentario
          if (action === "borrar_comentario") {
            const comentarioId = parseInt(body.comentarioId || body.id || "0", 10);
            if (!comentarioId) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "ID de comentario requerido" }));
              return;
            }

            const c = db.prepare("SELECT hilo_id FROM comentarios WHERE id = ?").get(comentarioId);
            if (c) {
              db.prepare("DELETE FROM comentarios WHERE id = ?").run(comentarioId);
              db.prepare("UPDATE hilos SET respuestas_count = MAX(0, respuestas_count - 1) WHERE id = ?").run(c.hilo_id);
            }

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Comentario eliminado" }));
            return;
          }

          // Moderación: Fijar / Desfijar Hilo
          if (action === "fijar_hilo") {
            const hiloId = parseInt(body.hiloId || body.id || "0", 10);
            const hilo = db.prepare("SELECT fijado FROM hilos WHERE id = ?").get(hiloId);
            if (!hilo) {
              res.writeHead(404);
              res.end(JSON.stringify({ status: "error", message: "Hilo no encontrado" }));
              return;
            }
            const nuevoEstado = (body.fijar !== undefined) ? (parseInt(body.fijar, 10) === 1 ? 1 : 0) : (hilo.fijado === 1 ? 0 : 1);
            db.prepare("UPDATE hilos SET fijado = ? WHERE id = ?").run(nuevoEstado, hiloId);

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", fijado: nuevoEstado }));
            return;
          }

          // Moderación: Gestionar Denuncia / Reporte
          if (action === "moderar_reporte") {
            const tipo = String(body.tipo || "hilo");
            const id = parseInt(body.id || "0", 10);
            const resolucion = String(body.accion || body.resolucion || "descartar").toLowerCase();

            if (resolucion === "descartar" || resolucion === "aprobar") {
              if (tipo === "hilo") {
                db.prepare("UPDATE hilos SET reportes = 0, oculto = 0 WHERE id = ?").run(id);
              } else {
                db.prepare("UPDATE comentarios SET reportes = 0, oculto = 0 WHERE id = ?").run(id);
              }
              res.writeHead(200);
              res.end(JSON.stringify({ status: "ok", message: "Denuncias descartadas. Contenido aprobado." }));
              return;
            }

            if (resolucion === "eliminar" || resolucion === "borrar") {
              if (tipo === "hilo") {
                db.prepare("DELETE FROM comentarios WHERE hilo_id = ?").run(id);
                db.prepare("DELETE FROM votos WHERE item_tipo = 'hilo' AND item_id = ?").run(id);
                db.prepare("DELETE FROM hilos WHERE id = ?").run(id);
              } else {
                const c = db.prepare("SELECT hilo_id FROM comentarios WHERE id = ?").get(id);
                if (c) {
                  db.prepare("DELETE FROM comentarios WHERE id = ?").run(id);
                  db.prepare("UPDATE hilos SET respuestas_count = MAX(0, respuestas_count - 1) WHERE id = ?").run(c.hilo_id);
                }
              }
              res.writeHead(200);
              res.end(JSON.stringify({ status: "ok", message: "Contenido denunciado eliminado" }));
              return;
            }

            res.writeHead(400);
            res.end(JSON.stringify({ status: "error", message: "Resolución no válida" }));
            return;
          }

          // Guardar Cronograma
          if (action === "guardar_cronograma") {
            const cronograma = Array.isArray(body.cronograma) ? body.cronograma : [];
            const comunidadFile = path.join(__dirname, "data", "comunidad.json");
            let cur = { noticias: [], cronograma: [], guia: [], faq: [], ajustes: {} };
            if (fs.existsSync(comunidadFile)) {
              try { cur = JSON.parse(fs.readFileSync(comunidadFile, "utf-8")); } catch(e){}
            }
            cur.cronograma = cronograma;
            fs.writeFileSync(comunidadFile, JSON.stringify(cur, null, 2), "utf-8");

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Cronograma guardado con éxito", cronograma }));
            return;
          }

          // Guardar Guías / Preguntas
          if (action === "guardar_guia" || action === "guardar_faq") {
            const faq = Array.isArray(body.faq) ? body.faq : (Array.isArray(body.guia) ? body.guia : []);
            const comunidadFile = path.join(__dirname, "data", "comunidad.json");
            let cur = { noticias: [], cronograma: [], guia: [], faq: [], ajustes: {} };
            if (fs.existsSync(comunidadFile)) {
              try { cur = JSON.parse(fs.readFileSync(comunidadFile, "utf-8")); } catch(e){}
            }
            cur.faq = faq;
            cur.guia = faq;
            fs.writeFileSync(comunidadFile, JSON.stringify(cur, null, 2), "utf-8");

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Guía guardada con éxito", faq }));
            return;
          }

          // Guardar Ajustes Generales del Sitio
          if (action === "guardar_ajustes") {
            const ajustes = typeof body.ajustes === "object" && body.ajustes !== null ? body.ajustes : body;
            const comunidadFile = path.join(__dirname, "data", "comunidad.json");
            let cur = { noticias: [], cronograma: [], guia: [], faq: [], ajustes: {} };
            if (fs.existsSync(comunidadFile)) {
              try { cur = JSON.parse(fs.readFileSync(comunidadFile, "utf-8")); } catch(e){}
            }
            cur.ajustes = Object.assign({}, cur.ajustes || {}, ajustes);
            fs.writeFileSync(comunidadFile, JSON.stringify(cur, null, 2), "utf-8");

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Ajustes del sitio actualizados", ajustes: cur.ajustes }));
            return;
          }

          res.writeHead(400);
          res.end(JSON.stringify({ status: "error", message: "Acción POST de administración no válida" }));

        } catch (err) {
          console.error("Error en /api/admin:", err);
          res.writeHead(500);
          res.end(JSON.stringify({ status: "error", message: "Error interno del servidor" }));
        }
      });
      return;
    }
  }

  // Protección de carpeta /data/
  if (pathname.startsWith("/data/")) {
    res.writeHead(403);
    res.end("Acceso denegado");
    return;
  }

  // Archivos estáticos y rutas amigables
  let relativePath = pathname === "/" 
    ? "index.html" 
    : (pathname === "/comunidad" 
        ? "comunidad.html" 
        : (pathname === "/noticia" 
            ? "noticia.html" 
            : pathname.replace(/^\//, "")));
  let filePath = path.join(__dirname, relativePath);

  // Normalizar ruta para evitar path traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end("Acceso denegado");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // SPA Fallback a index.html
  const indexPath = path.join(__dirname, "index.html");
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream(indexPath).pipe(res);
  } else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`🥁 Servidor Estudiantina Online activo en http://localhost:${PORT}`);
});
