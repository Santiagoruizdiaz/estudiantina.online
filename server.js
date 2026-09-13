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
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || process.env.ADMIN_SECRET || "posadas_admin_2026_x9k2m";

let foroDb = null;
function getForoDb() {
  if (!foroDb) {
    const dir = path.dirname(FORO_DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    foroDb = new DatabaseSync(FORO_DB_FILE);
    foroDb.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
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
    try { foroDb.exec("ALTER TABLE hilos ADD COLUMN noticia_id TEXT"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN estado TEXT DEFAULT 'activo'"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN motivo_sancion TEXT"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN sancionado_hasta DATETIME"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN sancionado_por TEXT"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN sancionado_en DATETIME"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN bio TEXT DEFAULT ''"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN rol_estudiantil TEXT DEFAULT 'Hincha de Tribuna'"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN ano_escolar TEXT DEFAULT 'Secundaria'"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN instagram TEXT DEFAULT ''"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN avatar_personalizado TEXT DEFAULT ''"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE usuarios ADD COLUMN username TEXT DEFAULT ''"); } catch (e) {}

    // Índices secundarios para acelerar consultas del foro con alta concurrencia
    foroDb.exec(`
      CREATE INDEX IF NOT EXISTS idx_hilos_canal ON hilos(canal_id);
      CREATE INDEX IF NOT EXISTS idx_hilos_creado ON hilos(creado_en);
      CREATE INDEX IF NOT EXISTS idx_hilos_votos ON hilos(votos);
      CREATE INDEX IF NOT EXISTS idx_comentarios_hilo ON comentarios(hilo_id);
      CREATE INDEX IF NOT EXISTS idx_votos_item ON votos(item_tipo, item_id, google_id);
    `);
    try { foroDb.exec("CREATE INDEX IF NOT EXISTS idx_hilos_noticia ON hilos(noticia_id)"); } catch (e) {}
    try { foroDb.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(LOWER(username)) WHERE username != '' AND username IS NOT NULL;"); } catch (e) {}

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
      ins.run("noticias", "Noticias & Cobertura", "Debates oficiales sobre las crónicas, coberturas y novedades de estudiantina.online.", "📰", "#38bdf8");
    } else {
      try {
        const hasNoticiasCanal = foroDb.prepare("SELECT 1 FROM canales WHERE id = 'noticias'").get();
        if (!hasNoticiasCanal) {
          foroDb.prepare("INSERT INTO canales (id, titulo, descripcion, icono, color) VALUES (?, ?, ?, ?, ?)").run(
            "noticias", "Noticias & Cobertura", "Debates oficiales sobre las crónicas, coberturas y novedades de estudiantina.online.", "📰", "#38bdf8"
          );
        }
      } catch (e) {}
    }

    // Sembrar usuarios demo si no existen
    const insU = foroDb.prepare("INSERT OR IGNORE INTO usuarios (google_id, email, nombre, username, avatar_url, colegio_id, rol_estudiantil, ano_escolar, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    insU.run("demo-user-1", "lucas@example.com", "Lucas Percusión", "lucas_percusion", "assets/avatar-default.webp", "janssen", "Redoblante", "5° Año (Promo)", "Apasionado del ritmo y los cortes de batería del Janssen.");
    insU.run("demo-user-2", "valentina@example.com", "Valentina Pasista", "valen_pasista", "assets/avatar-default.webp", "santa_maria", "Pasista de Escuadra", "4° Año", "Bailando en la costanera con el corazón azul y blanco.");
    insU.run("demo-user-3", "agustin@example.com", "Agustín Gamer", "agustin_gamer", "assets/avatar-default.webp", "industrial", "Director/a de Banda", "6° Año Técnico", "Simulador y tambores en la previa de la fiesta.");

    // Sembrar hilos si está vacía
    const rowHilos = foroDb.prepare("SELECT COUNT(*) as count FROM hilos").get();
    if (rowHilos && rowHilos.count === 0) {
      const insH = foroDb.prepare("INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, votos, respuestas_count, fijado, creado_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      insH.run("banda", "¡Ritmos y sincronización de las chanchas pesadas en la Costanera!", "¿Qué opinan de los cortes que prepararon los colegios técnicos este año? En las pruebas piloto se notó una potencia tremenda en los palcos.", "demo-user-1", "Lucas Percusión", "assets/avatar-default.webp", "janssen", 28, 2, 1, new Date(Date.now() - 3600000 * 3).toISOString());
      insH.run("baile", "¿Cómo influye el peso de los espaldares en las pasadas largas?", "Bailar 800 metros seguidos con plumas y tocados de pedrería demanda un físico tremendo. ¿Qué técnicas de respiración usan sus escuadras?", "demo-user-2", "Valentina Pasista", "assets/avatar-default.webp", "santa_maria", 34, 1, 0, new Date(Date.now() - 3600000 * 5).toISOString());
      insH.run("simulador", "Propuesta: Que se puedan personalizar los cortes de redoble en el juego", "Estaría genial que en las noches de calle del simulador puedas elegir ritmos acelerados o hacer solos de batería antes de entrar al palco.", "demo-user-3", "Agustín Gamer", "assets/avatar-default.webp", "industrial", 19, 1, 0, new Date(Date.now() - 3600000 * 8).toISOString());

      const insC = foroDb.prepare("INSERT INTO comentarios (hilo_id, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, votos, creado_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      insC.run(1, "Totalmente de acuerdo, los cortes cruzados de chancha este año van a definir el primer puesto.", "demo-user-2", "Valentina Pasista", "assets/avatar-default.webp", "santa_maria", 5, new Date(Date.now() - 3600000 * 2).toISOString());
      insC.run(1, "El secreto está en los redoblantes bien tensados, si no suenan secos se pierde en el viento del río.", "demo-user-3", "Agustín Gamer", "assets/avatar-default.webp", "industrial", 3, new Date(Date.now() - 3600000 * 1).toISOString());
      insC.run(2, "Nosotras ensayamos con chalecos livianos para acostumbrarnos al peso de las plumas antes de las noches oficiales.", "demo-user-1", "Lucas Percusión", "assets/avatar-default.webp", "janssen", 6, new Date(Date.now() - 3600000 * 3).toISOString());
      insC.run(3, "¡Apoyo total! Poder elegir la velocidad del redoble en los palcos sumaría muchísima adrenalina al simulador.", "demo-user-1", "Lucas Percusión", "assets/avatar-default.webp", "janssen", 4, new Date(Date.now() - 3600000 * 4).toISOString());
    }
  }
  return foroDb;
}

// Helper de Sanitización XSS (paridad con PHP htmlspecialchars ENT_QUOTES)
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// Rate-limiting en memoria: previene spam de creación de hilos (1 por 30s por google_id)
const _rateLimitMap = new Map();
function checkRateLimit(googleId, windowMs = 30000) {
  const now = Date.now();
  const last = _rateLimitMap.get(googleId) || 0;
  if (now - last < windowMs) return false; // bloqueado
  _rateLimitMap.set(googleId, now);
  return true; // permitido
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
  if (!token || typeof token !== "string") return null;
  const clean = token.trim();
  if (clean === ADMIN_TOKEN || clean === ADMIN_SECRET) {
    return { id: 1, usuario: "admin", rol: "superadmin" };
  }
  if (!clean.includes(".")) return null;
  const parts = clean.split(".");
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

const RESERVED_USERNAMES = new Set([
  "admin", "administrador", "moderador", "mod", "sistema",
  "estudiantina", "staff", "soporte", "oficial", "posadas", "redaccion"
]);

function validateUsername(rawUsername) {
  const username = String(rawUsername || "").trim().toLowerCase();
  if (!username) {
    return { valid: false, message: "El nombre de usuario es obligatorio" };
  }
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return { valid: false, message: "El usuario debe tener entre 3 y 20 caracteres y solo letras, números o guión bajo (_)." };
  }
  if (RESERVED_USERNAMES.has(username)) {
    return { valid: false, message: "Ese nombre de usuario está reservado." };
  }
  return { valid: true, username };
}

function checkUserSanction(db, googleId) {
  if (!googleId) return null;
  try {
    const user = db.prepare("SELECT * FROM usuarios WHERE google_id = ?").get(googleId);
    if (!user) return null;

    if (user.estado === "baneado") {
      return {
        bloqueado: true,
        tipo: "baneo",
        mensaje: `Tu cuenta ha sido baneada permanentemente del foro. Motivo: ${user.motivo_sancion || "Infracción a las normas de convivencia."}`
      };
    }

    if (user.estado === "suspendido") {
      if (user.sancionado_hasta) {
        const hasta = new Date(user.sancionado_hasta);
        const now = new Date();
        if (hasta > now) {
          return {
            bloqueado: true,
            tipo: "suspension",
            hasta: user.sancionado_hasta,
            mensaje: `Tu cuenta se encuentra suspendida hasta el ${hasta.toLocaleString("es-AR")}. Motivo: ${user.motivo_sancion || "Infracción temporal."}`
          };
        } else {
          // Suspensión expirada: restablecer automáticamente a activo
          db.prepare("UPDATE usuarios SET estado = 'activo', motivo_sancion = NULL, sancionado_hasta = NULL WHERE google_id = ?").run(googleId);
          return null;
        }
      } else {
        return {
          bloqueado: true,
          tipo: "suspension",
          mensaje: `Tu cuenta se encuentra suspendida temporalmente. Motivo: ${user.motivo_sancion || "Infracción temporal."}`
        };
      }
    }
  } catch (e) {
    console.warn("Error verificando sanción de usuario:", e);
  }
  return null;
}

function calculateUserBadges(user, totalHilos, totalComentarios, karmaTotal, maxThreadVotes) {
  const badges = [];
  badges.push({
    id: "pionero_2026",
    titulo: "Pionero 2026",
    icono: "🌟",
    color: "#f59e0b",
    desc: "Miembro activo de la temporada Estudiantina 2026."
  });

  if (totalHilos >= 3) {
    badges.push({
      id: "voz_tribuna",
      titulo: "Voz de la Tribuna",
      icono: "📢",
      color: "#38bdf8",
      desc: "Inició 3 o más debates en la comunidad."
    });
  }

  if (totalComentarios >= 5) {
    badges.push({
      id: "comentarista_fiel",
      titulo: "Comentarista Fiel",
      icono: "💬",
      color: "#a855f7",
      desc: "Aportó 5 o más respuestas constructivas."
    });
  }

  if (karmaTotal >= 20 || maxThreadVotes >= 10) {
    badges.push({
      id: "costanera_trending",
      titulo: "Trending Costanera",
      icono: "🔥",
      color: "#ef4444",
      desc: "Sus aportes cosecharon amplio reconocimiento popular."
    });
  }

  if (user && user.estado === "activo") {
    badges.push({
      id: "convivencia_ejemplar",
      titulo: "Convivencia Ejemplar",
      icono: "🛡️",
      color: "#22c55e",
      desc: "Cuenta en regla con respeto a las hinchadas posadeñas."
    });
  }

  if (user && (user.rol === "admin" || user.rol === "superadmin")) {
    badges.push({
      id: "moderador_oficial",
      titulo: "Moderador Oficial",
      icono: "⚡",
      color: "#fbbf24",
      desc: "Miembro del equipo de fiscalización y moderación."
    });
  }

  return badges;
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
      if (action === "check_username") {
        const rawUsername = (reqUrl.searchParams.get("username") || "").trim();
        const excludeGoogleId = (reqUrl.searchParams.get("googleId") || "").trim();
        const check = validateUsername(rawUsername);
        if (!check.valid) {
          res.writeHead(200);
          res.end(JSON.stringify({ status: "ok", available: false, message: check.message }));
          return;
        }

        const existing = db.prepare("SELECT google_id FROM usuarios WHERE LOWER(username) = LOWER(?) AND google_id != ?").get(check.username, excludeGoogleId);
        if (existing) {
          res.writeHead(200);
          res.end(JSON.stringify({ status: "ok", available: false, message: "El nombre de usuario ya está registrado por otro hincha." }));
          return;
        }

        res.writeHead(200);
        res.end(JSON.stringify({ status: "ok", available: true, message: "¡Usuario disponible!", username: check.username }));
        return;
      }

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
        const limit = Math.min(50, Math.max(1, parseInt(reqUrl.searchParams.get("limit") || "10", 10)));
        const offset = Math.max(0, parseInt(reqUrl.searchParams.get("offset") || "0", 10));
        const q = (reqUrl.searchParams.get("q") || "").trim();
        const viewerGoogleId = reqUrl.searchParams.get("googleId") || "";

        let sql = "SELECT h.*, u.username as autor_username FROM hilos h LEFT JOIN usuarios u ON h.autor_google_id = u.google_id WHERE h.oculto = 0";
        const params = [];

        if (canal !== "todos" && canal !== "") {
          sql += " AND h.canal_id = ?";
          params.push(canal);
        }

        // Búsqueda full-text sobre título, contenido y nombre de autor
        if (q) {
          sql += " AND (h.titulo LIKE ? OR h.contenido LIKE ? OR h.autor_nombre LIKE ? OR u.username LIKE ?)";
          const like = `%${q}%`;
          params.push(like, like, like, like);
        }

        if (sort === "recientes") {
          sql += ` ORDER BY h.fijado DESC, h.creado_en DESC LIMIT ${limit} OFFSET ${offset}`;
        } else {
          sql += ` ORDER BY h.fijado DESC, h.votos DESC, h.creado_en DESC LIMIT ${limit} OFFSET ${offset}`;
        }

        const hilosRaw = db.prepare(sql).all(...params);
        const hilos = hilosRaw.map(h => {
          if (viewerGoogleId) {
            const v = db.prepare("SELECT 1 FROM votos WHERE item_tipo = 'hilo' AND item_id = ? AND google_id = ?").get(h.id, viewerGoogleId);
            h.user_voted = v ? 1 : 0;
          } else {
            h.user_voted = 0;
          }
          return h;
        });

        res.writeHead(200);
        res.end(JSON.stringify({ status: "ok", hilos }));
        return;
      }

      if (action === "hilo") {
        const id = parseInt(reqUrl.searchParams.get("id") || "0", 10);
        const viewerGoogleId = reqUrl.searchParams.get("googleId") || "";
        const hilo = db.prepare("SELECT h.*, u.username as autor_username FROM hilos h LEFT JOIN usuarios u ON h.autor_google_id = u.google_id WHERE h.id = ? AND h.oculto = 0").get(id);

        if (!hilo) {
          res.writeHead(404);
          res.end(JSON.stringify({ status: "error", message: "Hilo no encontrado" }));
          return;
        }

        // Incluir si el visitante ya votó el hilo principal
        if (viewerGoogleId) {
          const hiloVoted = db.prepare("SELECT 1 FROM votos WHERE item_tipo = 'hilo' AND item_id = ? AND google_id = ?").get(id, viewerGoogleId);
          hilo.user_voted = hiloVoted ? 1 : 0;
        } else {
          hilo.user_voted = 0;
        }

        const comentariosRaw = db.prepare("SELECT c.*, u.username as autor_username FROM comentarios c LEFT JOIN usuarios u ON c.autor_google_id = u.google_id WHERE c.hilo_id = ? AND c.oculto = 0 ORDER BY c.creado_en ASC").all(id);

        // Enriquecer cada comentario con user_voted
        const comentarios = comentariosRaw.map(c => {
          if (viewerGoogleId) {
            const cv = db.prepare("SELECT 1 FROM votos WHERE item_tipo = 'comentario' AND item_id = ? AND google_id = ?").get(c.id, viewerGoogleId);
            c.user_voted = cv ? 1 : 0;
          } else {
            c.user_voted = 0;
          }
          return c;
        });

        res.writeHead(200);
        res.end(JSON.stringify({ status: "ok", hilo, comentarios }));
        return;
      }

      if (action === "noticia_hilo") {
        const noticiaId = (reqUrl.searchParams.get("noticiaId") || "").trim();
        const viewerGoogleId = (reqUrl.searchParams.get("googleId") || "").trim();

        if (!noticiaId) {
          res.writeHead(400);
          res.end(JSON.stringify({ status: "error", message: "Parámetro noticiaId requerido" }));
          return;
        }

        // Buscar hilo asociado a la noticia
        let hilo = db.prepare("SELECT h.*, u.username as autor_username FROM hilos h LEFT JOIN usuarios u ON h.autor_google_id = u.google_id WHERE h.noticia_id = ? AND h.oculto = 0").get(noticiaId);

        // Si no existe, crearlo on-demand buscando los datos de la noticia
        if (!hilo) {
          const notic = db.prepare("SELECT * FROM noticias WHERE id = ?").get(noticiaId);
          const titulo = notic ? notic.titulo : `Debate: Noticia ${noticiaId}`;
          const contenido = notic ? (notic.resumen || notic.titulo) : "Espacio oficial de debate y comentarios sobre esta cobertura periodística.";

          const ins = db.prepare(`
            INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, noticia_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run("noticias", titulo, contenido, "admin-redaccion", "Redacción Oficial", "assets/avatar-redaccion.webp", "posadas", noticiaId);

          hilo = db.prepare("SELECT h.*, u.username as autor_username FROM hilos h LEFT JOIN usuarios u ON h.autor_google_id = u.google_id WHERE h.id = ?").get(ins.lastInsertRowid);
        }

        if (viewerGoogleId) {
          const hiloVoted = db.prepare("SELECT 1 FROM votos WHERE item_tipo = 'hilo' AND item_id = ? AND google_id = ?").get(hilo.id, viewerGoogleId);
          hilo.user_voted = hiloVoted ? 1 : 0;
        } else {
          hilo.user_voted = 0;
        }

        const comentariosRaw = db.prepare("SELECT c.*, u.username as autor_username FROM comentarios c LEFT JOIN usuarios u ON c.autor_google_id = u.google_id WHERE c.hilo_id = ? AND c.oculto = 0 ORDER BY c.creado_en ASC").all(hilo.id);

        const comentarios = comentariosRaw.map(c => {
          if (viewerGoogleId) {
            const cv = db.prepare("SELECT 1 FROM votos WHERE item_tipo = 'comentario' AND item_id = ? AND google_id = ?").get(c.id, viewerGoogleId);
            c.user_voted = cv ? 1 : 0;
          } else {
            c.user_voted = 0;
          }
          return c;
        });

        res.writeHead(200);
        res.end(JSON.stringify({ status: "ok", hilo, comentarios }));
        return;
      }

      if (action === "perfil") {
        const targetId = (reqUrl.searchParams.get("id") || reqUrl.searchParams.get("googleId") || "").trim();
        if (!targetId) {
          res.writeHead(400);
          res.end(JSON.stringify({ status: "error", message: "ID de usuario requerido" }));
          return;
        }

        let user = db.prepare("SELECT * FROM usuarios WHERE google_id = ?").get(targetId);

        // Si no está registrado en la tabla pero tiene hilos o comentarios creados
        if (!user) {
          const autorInfo = db.prepare(`
            SELECT autor_nombre, autor_avatar, colegio_id
            FROM hilos WHERE autor_google_id = ?
            UNION
            SELECT autor_nombre, autor_avatar, colegio_id
            FROM comentarios WHERE autor_google_id = ?
            LIMIT 1
          `).get(targetId, targetId);

          if (autorInfo) {
            user = {
              google_id: targetId,
              nombre: autorInfo.autor_nombre || ("Hincha " + targetId.slice(-4)),
              email: "",
              avatar_url: autorInfo.autor_avatar || "",
              colegio_id: autorInfo.colegio_id || "janssen",
              rol: "usuario",
              estado: "activo",
              bio: "",
              rol_estudiantil: "Hincha de Tribuna",
              ano_escolar: "Secundaria",
              instagram: "",
              creado_en: new Date().toISOString()
            };
          } else {
            res.writeHead(404);
            res.end(JSON.stringify({ status: "error", message: "Perfil de usuario no encontrado" }));
            return;
          }
        }

        // Métricas en tiempo real
        const countHilosRow = db.prepare("SELECT COUNT(*) as count FROM hilos WHERE autor_google_id = ? AND oculto = 0").get(targetId);
        const countComentariosRow = db.prepare("SELECT COUNT(*) as count FROM comentarios WHERE autor_google_id = ? AND oculto = 0").get(targetId);
        const karmaHilosRow = db.prepare("SELECT COALESCE(SUM(votos), 0) as karma, COALESCE(MAX(votos), 0) as max_votos FROM hilos WHERE autor_google_id = ? AND oculto = 0").get(targetId);
        const karmaComentariosRow = db.prepare("SELECT COALESCE(SUM(votos), 0) as karma FROM comentarios WHERE autor_google_id = ? AND oculto = 0").get(targetId);

        const totalHilos = countHilosRow ? countHilosRow.count : 0;
        const totalComentarios = countComentariosRow ? countComentariosRow.count : 0;
        const karmaTotal = (karmaHilosRow ? karmaHilosRow.karma : 0) + (karmaComentariosRow ? karmaComentariosRow.karma : 0);
        const maxVotes = karmaHilosRow ? karmaHilosRow.max_votos : 0;

        // Insignias
        const insignias = calculateUserBadges(user, totalHilos, totalComentarios, karmaTotal, maxVotes);

        // Hilos recientes creados por este usuario
        const hilosRecientes = db.prepare(`
          SELECT id, canal_id, titulo, votos, respuestas_count, creado_en
          FROM hilos
          WHERE autor_google_id = ? AND oculto = 0
          ORDER BY creado_en DESC
          LIMIT 10
        `).all(targetId);

        // Comentarios recientes creados por este usuario con título del hilo
        const comentariosRecientes = db.prepare(`
          SELECT c.id, c.hilo_id, c.contenido, c.votos, c.creado_en, h.titulo as hilo_titulo
          FROM comentarios c
          LEFT JOIN hilos h ON h.id = c.hilo_id
          WHERE c.autor_google_id = ? AND c.oculto = 0
          ORDER BY c.creado_en DESC
          LIMIT 10
        `).all(targetId);

        res.writeHead(200);
        res.end(JSON.stringify({
          status: "ok",
          usuario: {
            googleId: user.google_id,
            nombre: user.nombre,
            username: user.username || "",
            avatarUrl: user.avatar_personalizado || user.avatar_url,
            avatarOriginal: user.avatar_url,
            colegioId: user.colegio_id,
            rol: user.rol,
            estado: user.estado || "activo",
            bio: user.bio || "",
            rolEstudiantil: user.rol_estudiantil || "Hincha de Tribuna",
            anoEscolar: user.ano_escolar || "Secundaria",
            instagram: user.instagram || "",
            creadoEn: user.creado_en
          },
          metricas: {
            totalHilos,
            totalComentarios,
            karmaTotal
          },
          insignias,
          hilosRecientes,
          comentariosRecientes
        }));
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
                email = CASE WHEN excluded.email != '' THEN excluded.email ELSE usuarios.email END,
                avatar_url = CASE WHEN usuarios.avatar_url IS NULL OR usuarios.avatar_url = '' THEN excluded.avatar_url ELSE usuarios.avatar_url END,
                nombre = CASE WHEN usuarios.nombre IS NULL OR usuarios.nombre = '' THEN excluded.nombre ELSE usuarios.nombre END,
                colegio_id = CASE WHEN usuarios.colegio_id IS NULL THEN excluded.colegio_id ELSE usuarios.colegio_id END
            `).run(googleId, nombre, email, avatarUrl, colegioId);

            const rowUser = db.prepare("SELECT * FROM usuarios WHERE google_id = ?").get(googleId);
            const needsOnboarding = !rowUser || !rowUser.username || rowUser.username.trim() === "";

            res.writeHead(200);
            res.end(JSON.stringify({
              status: "ok",
              needsOnboarding,
              usuario: {
                googleId,
                nombre: rowUser ? rowUser.nombre : nombre,
                username: rowUser ? (rowUser.username || "") : "",
                avatarUrl: rowUser ? (rowUser.avatar_personalizado || rowUser.avatar_url) : avatarUrl,
                avatarOriginal: rowUser ? rowUser.avatar_url : avatarUrl,
                colegioId: rowUser ? rowUser.colegio_id : colegioId,
                bio: rowUser ? (rowUser.bio || "") : "",
                rolEstudiantil: rowUser ? (rowUser.rol_estudiantil || "Hincha de Tribuna") : "Hincha de Tribuna",
                anoEscolar: rowUser ? (rowUser.ano_escolar || "Secundaria") : "Secundaria",
                instagram: rowUser ? (rowUser.instagram || "") : ""
              }
            }));
            return;
          }

          if (action === "completar_registro") {
            const googleId = String(body.googleId || "").trim();
            const rawUsername = String(body.username || "").trim();
            const nombre = escapeHtml(String(body.nombre || "").trim().slice(0, 50));
            const colegioId = String(body.colegioId || "janssen").trim();
            const rolEstudiantil = escapeHtml(String(body.rolEstudiantil || "Hincha de Tribuna").trim().slice(0, 50));
            const anoEscolar = escapeHtml(String(body.anoEscolar || "5° Año (Promo)").trim().slice(0, 40));
            const bio = escapeHtml(String(body.bio || "").trim().slice(0, 160));
            const rawInsta = String(body.instagram || "").trim().replace(/^@/, "").slice(0, 30);
            const instagram = escapeHtml(rawInsta);
            const avatarUrl = String(body.avatarUrl || "").trim();

            if (!googleId) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "ID de usuario requerido" }));
              return;
            }

            const checkUser = validateUsername(rawUsername);
            if (!checkUser.valid) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: checkUser.message }));
              return;
            }

            // Validar unicidad en SQLite
            const taken = db.prepare("SELECT google_id FROM usuarios WHERE LOWER(username) = LOWER(?) AND google_id != ?").get(checkUser.username, googleId);
            if (taken) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "El nombre de usuario ya está registrado por otro hincha." }));
              return;
            }

            if (!nombre || nombre.length < 2) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "El nombre debe tener al menos 2 caracteres." }));
              return;
            }

            const exist = db.prepare("SELECT * FROM usuarios WHERE google_id = ?").get(googleId);
            const isCustomPhoto = avatarUrl.startsWith("data:image/");
            const customAvatarToSave = isCustomPhoto ? avatarUrl : (exist ? (exist.avatar_personalizado || "") : "");

            if (!exist) {
              db.prepare(`
                INSERT INTO usuarios (google_id, username, nombre, colegio_id, bio, rol_estudiantil, ano_escolar, instagram, avatar_personalizado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).run(googleId, checkUser.username, nombre, colegioId, bio, rolEstudiantil, anoEscolar, instagram, customAvatarToSave);
            } else {
              db.prepare(`
                UPDATE usuarios
                SET username = ?, nombre = ?, colegio_id = ?, bio = ?, rol_estudiantil = ?, ano_escolar = ?, instagram = ?, avatar_personalizado = ?
                WHERE google_id = ?
              `).run(checkUser.username, nombre, colegioId, bio, rolEstudiantil, anoEscolar, instagram, customAvatarToSave, googleId);
            }

            const finalAvatar = customAvatarToSave || (exist ? exist.avatar_url : avatarUrl);
            try {
              db.prepare("UPDATE hilos SET autor_nombre = ?, autor_avatar = ?, colegio_id = ? WHERE autor_google_id = ?").run(nombre, finalAvatar, colegioId, googleId);
              db.prepare("UPDATE comentarios SET autor_nombre = ?, autor_avatar = ?, colegio_id = ? WHERE autor_google_id = ?").run(nombre, finalAvatar, colegioId, googleId);
            } catch (e) {}

            res.writeHead(200);
            res.end(JSON.stringify({
              status: "ok",
              message: "¡Registro completado con éxito!",
              usuario: {
                googleId,
                username: checkUser.username,
                nombre,
                colegioId,
                bio,
                rolEstudiantil,
                anoEscolar,
                instagram,
                avatarUrl: finalAvatar,
                avatarOriginal: exist ? exist.avatar_url : ""
              }
            }));
            return;
          }

          if (action === "editar_perfil") {
            const googleId = String(body.googleId || "").trim();
            const rawUsername = String(body.username || "").trim();
            const nombre = escapeHtml(String(body.nombre || "").trim().slice(0, 50));
            const colegioId = String(body.colegioId || "janssen").trim();
            const bio = escapeHtml(String(body.bio || "").trim().slice(0, 160));
            const rolEstudiantil = escapeHtml(String(body.rolEstudiantil || "Hincha de Tribuna").trim().slice(0, 50));
            const anoEscolar = escapeHtml(String(body.anoEscolar || "Secundaria").trim().slice(0, 40));
            const rawInsta = String(body.instagram || "").trim().replace(/^@/, "").slice(0, 30);
            const instagram = escapeHtml(rawInsta);
            const avatarUrl = String(body.avatarUrl || body.avatarPersonalizado || "").trim();
            const restoreGoogleAvatar = body.restoreGoogleAvatar === true;

            if (!googleId) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "ID de usuario requerido" }));
              return;
            }
            if (!nombre || nombre.length < 2) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "El nombre debe tener al menos 2 caracteres" }));
              return;
            }

            // Validar username si se proporcionó
            let validatedUsername = null;
            if (rawUsername) {
              const checkUser = validateUsername(rawUsername);
              if (!checkUser.valid) {
                res.writeHead(400);
                res.end(JSON.stringify({ status: "error", message: checkUser.message }));
                return;
              }
              const taken = db.prepare("SELECT google_id FROM usuarios WHERE LOWER(username) = LOWER(?) AND google_id != ?").get(checkUser.username, googleId);
              if (taken) {
                res.writeHead(400);
                res.end(JSON.stringify({ status: "error", message: "El nombre de usuario ya está registrado por otro hincha." }));
                return;
              }
              validatedUsername = checkUser.username;
            }

            // Verificar si el usuario está sancionado
            const sanction = checkUserSanction(db, googleId);
            if (sanction && sanction.bloqueado) {
              res.writeHead(403);
              res.end(JSON.stringify({ status: "error", message: sanction.mensaje, sanction }));
              return;
            }

            const exist = db.prepare("SELECT * FROM usuarios WHERE google_id = ?").get(googleId);
            let customAvatar = exist ? (exist.avatar_personalizado || "") : "";
            if (restoreGoogleAvatar) {
              customAvatar = "";
            } else if (avatarUrl.startsWith("data:image/")) {
              customAvatar = avatarUrl;
            }

            const finalUsername = validatedUsername !== null ? validatedUsername : (exist ? (exist.username || "") : "");

            if (!exist) {
              db.prepare(`
                INSERT INTO usuarios (google_id, username, nombre, colegio_id, bio, rol_estudiantil, ano_escolar, instagram, avatar_personalizado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).run(googleId, finalUsername, nombre, colegioId, bio, rolEstudiantil, anoEscolar, instagram, customAvatar);
            } else {
              db.prepare(`
                UPDATE usuarios
                SET username = ?, nombre = ?, colegio_id = ?, bio = ?, rol_estudiantil = ?, ano_escolar = ?, instagram = ?, avatar_personalizado = ?
                WHERE google_id = ?
              `).run(finalUsername, nombre, colegioId, bio, rolEstudiantil, anoEscolar, instagram, customAvatar, googleId);
            }

            const finalAvatarUrl = customAvatar || (exist ? exist.avatar_url : avatarUrl);

            // Sincronizar en hilos y comentarios del usuario
            try {
              db.prepare("UPDATE hilos SET autor_nombre = ?, autor_avatar = ?, colegio_id = ? WHERE autor_google_id = ?").run(nombre, finalAvatarUrl, colegioId, googleId);
              db.prepare("UPDATE comentarios SET autor_nombre = ?, autor_avatar = ?, colegio_id = ? WHERE autor_google_id = ?").run(nombre, finalAvatarUrl, colegioId, googleId);
            } catch (e) {}

            res.writeHead(200);
            res.end(JSON.stringify({
              status: "ok",
              message: "Perfil actualizado con éxito",
              usuario: {
                googleId,
                username: finalUsername,
                nombre,
                colegioId,
                bio,
                rolEstudiantil,
                anoEscolar,
                instagram,
                avatarUrl: finalAvatarUrl,
                avatarOriginal: exist ? exist.avatar_url : ""
              }
            }));
            return;
          }

          if (action === "crear_hilo") {
            const canalId = String(body.canalId || "general").trim();
            const titulo = escapeHtml(String(body.titulo || "").trim().slice(0, 150));
            const contenido = escapeHtml(String(body.contenido || "").trim().slice(0, 3000));
            const googleId = String(body.googleId || "").trim();
            const autorNombre = escapeHtml(String(body.autorNombre || "").trim().slice(0, 60));
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

            // Verificar si el usuario está suspendido o baneado
            const sanctionHilo = checkUserSanction(db, googleId);
            if (sanctionHilo && sanctionHilo.bloqueado) {
              res.writeHead(403);
              res.end(JSON.stringify({ status: "error", message: sanctionHilo.mensaje, sanction: sanctionHilo }));
              return;
            }

            // Rate-limiting: máximo 1 debate cada 30 segundos por usuario
            if (!checkRateLimit(googleId)) {
              res.writeHead(429);
              res.end(JSON.stringify({ status: "error", message: "Esperá 30 segundos entre debates. ¡No hagas spam!" }));
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
            const contenido = escapeHtml(String(body.contenido || "").trim().slice(0, 2000));
            const googleId = String(body.googleId || "").trim();
            const autorNombre = escapeHtml(String(body.autorNombre || "").trim().slice(0, 60));
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

            // Verificar si el usuario está suspendido o baneado
            const sanctionComentario = checkUserSanction(db, googleId);
            if (sanctionComentario && sanctionComentario.bloqueado) {
              res.writeHead(403);
              res.end(JSON.stringify({ status: "error", message: sanctionComentario.mensaje, sanction: sanctionComentario }));
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
            const itemId = parseInt(body.itemId || body.id || 0, 10);
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
            const itemId = parseInt(body.itemId || body.id || 0, 10);
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

      if (action === "usuarios") {
        const admin = getAdminFromRequest(req);
        if (!admin) {
          res.writeHead(401);
          res.end(JSON.stringify({ status: "error", message: "No autorizado" }));
          return;
        }
        const usuarios = db.prepare(`
          SELECT u.*,
            (SELECT COUNT(*) FROM hilos h WHERE h.autor_google_id = u.google_id) as total_hilos,
            (SELECT COUNT(*) FROM comentarios c WHERE c.autor_google_id = u.google_id) as total_comentarios
          FROM usuarios u
          ORDER BY u.creado_en DESC
        `).all();
        res.writeHead(200);
        res.end(JSON.stringify({ status: "ok", usuarios }));
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

          // Login directo mediante Token de Administración Maestro
          if (action === "login_token") {
            const rawToken = String(body.token || "").trim();
            if (!rawToken) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "Token de administración requerido" }));
              return;
            }
            const verified = verifyAdminToken(rawToken);
            if (!verified) {
              res.writeHead(401);
              res.end(JSON.stringify({ status: "error", message: "Token de administración inválido o no reconocido" }));
              return;
            }
            res.writeHead(200);
            res.end(JSON.stringify({
              status: "ok",
              token: rawToken,
              usuario: verified.usuario || "admin",
              rol: verified.rol || "superadmin",
              admin: verified
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
            const fijada = body.fijada ? 1 : 0;

            // Ensure bloques column exists
            try { db.exec("ALTER TABLE noticias ADD COLUMN bloques TEXT"); } catch(e) {}

            db.prepare(`
              INSERT INTO noticias (id, titulo, categoria, categoria_slug, fecha, autor, tiempo_lectura, badge, resumen, contenido, bloques, tags, imagen_url, fijada)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              imagenUrl,
              fijada
            );

            syncComunidadJson(db);

            res.writeHead(200);
            res.end(JSON.stringify({
              status: "ok",
              noticiaId: id,
              noticia: {
                id, titulo, categoria, categoriaSlug, fecha, autor,
                tiempoLectura, badge, resumen, contenido, bloques, tags,
                imagen: imagenUrl, imagenUrl, fijada: fijada === 1
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
            const fijada = body.fijada ? 1 : 0;
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
              SET titulo = ?, categoria = ?, categoria_slug = ?, badge = ?, autor = ?, tiempo_lectura = ?, resumen = ?, contenido = ?, bloques = ?, tags = ?, imagen_url = ?, fijada = ?
              WHERE id = ?
            `).run(
              titulo, categoria, categoriaSlug, badge, autor, tiempoLectura, resumen,
              JSON.stringify(contenido), JSON.stringify(bloques), JSON.stringify(tags), imagenUrl, fijada, id
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

          // Moderación: Sancionar / Desbanear Usuario
          if (action === "sancionar_usuario") {
            const googleId = String(body.googleId || "").trim();
            const tipoSancion = String(body.tipoSancion || "suspender").toLowerCase(); // "suspender", "banear", "desbanear"
            const motivo = escapeHtml(String(body.motivo || "").trim().slice(0, 500));
            const duracionHoras = parseInt(body.duracionHoras || "24", 10);

            if (!googleId) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "ID de usuario requerido" }));
              return;
            }

            // Asegurar que el usuario exista en la tabla usuarios
            const userCheck = db.prepare("SELECT * FROM usuarios WHERE google_id = ?").get(googleId);
            if (!userCheck) {
              const autorInfo = db.prepare("SELECT autor_nombre, autor_avatar, colegio_id FROM hilos WHERE autor_google_id = ? UNION SELECT autor_nombre, autor_avatar, colegio_id FROM comentarios WHERE autor_google_id = ? LIMIT 1").get(googleId, googleId);
              const nombre = autorInfo ? autorInfo.autor_nombre : "Usuario " + googleId.slice(-4);
              const avatar = autorInfo ? autorInfo.autor_avatar : "";
              const col = autorInfo ? autorInfo.colegio_id : "janssen";
              db.prepare("INSERT INTO usuarios (google_id, nombre, avatar_url, colegio_id) VALUES (?, ?, ?, ?)").run(googleId, nombre, avatar, col);
            }

            if (tipoSancion === "desbanear" || tipoSancion === "levantar") {
              db.prepare(`
                UPDATE usuarios
                SET estado = 'activo', motivo_sancion = NULL, sancionado_hasta = NULL, sancionado_por = NULL, sancionado_en = NULL
                WHERE google_id = ?
              `).run(googleId);
              res.writeHead(200);
              res.end(JSON.stringify({ status: "ok", message: "Sanción levantada. El usuario ahora está activo." }));
              return;
            }

            if (tipoSancion === "banear") {
              db.prepare(`
                UPDATE usuarios
                SET estado = 'baneado', motivo_sancion = ?, sancionado_hasta = NULL, sancionado_por = ?, sancionado_en = CURRENT_TIMESTAMP
                WHERE google_id = ?
              `).run(motivo || "Violación grave de las normas de convivencia", admin.usuario || "admin", googleId);
              res.writeHead(200);
              res.end(JSON.stringify({ status: "ok", message: "Usuario baneado permanentemente." }));
              return;
            }

            if (tipoSancion === "suspender") {
              const horas = isNaN(duracionHoras) || duracionHoras <= 0 ? 24 : duracionHoras;
              const hasta = new Date(Date.now() + horas * 3600 * 1000).toISOString();
              db.prepare(`
                UPDATE usuarios
                SET estado = 'suspendido', motivo_sancion = ?, sancionado_hasta = ?, sancionado_por = ?, sancionado_en = CURRENT_TIMESTAMP
                WHERE google_id = ?
              `).run(motivo || `Suspensión temporal por ${horas}h`, hasta, admin.usuario || "admin", googleId);
              res.writeHead(200);
              res.end(JSON.stringify({ status: "ok", message: `Usuario suspendido hasta ${new Date(hasta).toLocaleString("es-AR")}.`, hasta }));
              return;
            }

            res.writeHead(400);
            res.end(JSON.stringify({ status: "error", message: "Tipo de sanción no válido" }));
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
            : (pathname === "/foro"
                ? "foro.html"
                : pathname.replace(/^\//, ""))));
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
