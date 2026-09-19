/**
 * Servidor de Desarrollo y API Local para Estudiantina de Posadas
 * Simula de forma idéntica la API de Hostinger (api/ranking.php)
 * usando Node.js nativo sin librerías externas.
 */

import http from "http";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import zlib from "node:zlib";
import { fileURLToPath } from "url";
let DatabaseSync = null;
try {
  const sqliteModule = await import("node:sqlite");
  DatabaseSync = sqliteModule.DatabaseSync;
} catch (e) {
  console.warn("[SQLite] node:sqlite no disponible en este entorno Node.js. Funcionando con persistencia JSON.");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carga nativa de variables desde .env si existe (sin dependencias externas)
const envFilePath = path.join(__dirname, ".env");
if (fs.existsSync(envFilePath)) {
  try {
    const lines = fs.readFileSync(envFilePath, "utf-8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const k = trimmed.slice(0, eqIdx).trim();
        const v = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, "");
        if (typeof process.env[k] === "undefined") {
          process.env[k] = v;
        }
      }
    }
  } catch (err) {
    console.warn("Aviso al procesar archivo .env local:", err.message);
  }
}

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "ranking.json");
const FORO_DB_FILE = process.env.DATABASE_PATH ? path.resolve(__dirname, process.env.DATABASE_PATH) : path.join(__dirname, "data", "foro.db");

// VULN-01: Fail-Closed Secrets. Prohibir secretos por defecto inseguros
const INSECURE_DEFAULTS = [
  "estudiantina_admin_secret_posadas_2026_key",
  "posadas_admin_2026_x9k2m"
];
const SAFE_DEV_SECRET = "dev_secret_estudiantina_posadas_2026_32bytes_safe!";
const SAFE_DEV_TOKEN = "dev_token_posadas_2026_master_safe_32chars!";

const isProduction = NODE_ENV === "production";
let rawAdminSecret = process.env.ADMIN_SECRET;
let rawAdminToken = process.env.ADMIN_TOKEN;

if (!isProduction) {
  if (!rawAdminSecret) rawAdminSecret = SAFE_DEV_SECRET;
  if (!rawAdminToken) rawAdminToken = SAFE_DEV_TOKEN;
}

const ADMIN_SECRET = rawAdminSecret || "";
const ADMIN_TOKEN = rawAdminToken || "";

const isSecretsInvalid = !ADMIN_SECRET ||
  ADMIN_SECRET.length < 32 ||
  INSECURE_DEFAULTS.includes(ADMIN_SECRET) ||
  !ADMIN_TOKEN ||
  ADMIN_TOKEN.length < 16 ||
  INSECURE_DEFAULTS.includes(ADMIN_TOKEN);

if (isProduction && isSecretsInvalid) {
  console.error("FATAL [Seguridad]: En producción (NODE_ENV=production) es obligatorio definir ADMIN_SECRET (>= 32 chars) y ADMIN_TOKEN (>= 16 chars) seguros.");
  process.exit(1);
}

let foroDb = null;
function getForoDb() {
  if (!DatabaseSync) return null;
  if (!foroDb) {
    const dir = path.dirname(FORO_DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    foroDb = new DatabaseSync(FORO_DB_FILE);
    foroDb.exec(`
      PRAGMA busy_timeout = 5000;
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      PRAGMA cache_size = -64000;
      PRAGMA foreign_keys = ON;
      PRAGMA temp_store = MEMORY;
      PRAGMA mmap_size = 268435456;
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
      CREATE TABLE IF NOT EXISTS admin_login_rate_limit (
          ip TEXT PRIMARY KEY,
          intentos INTEGER DEFAULT 0,
          bloqueado_hasta INTEGER DEFAULT 0,
          ultimo_intento INTEGER DEFAULT 0
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
          icono TEXT DEFAULT '💬',
          color TEXT DEFAULT '#38bdf8'
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
          reportes INTEGER DEFAULT 0,
          respuestas_count INTEGER DEFAULT 0,
          fijado INTEGER DEFAULT 0,
          oculto INTEGER DEFAULT 0,
          en_revision INTEGER DEFAULT 0,
          noticia_id TEXT,
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
          parent_id INTEGER DEFAULT NULL,
          votos INTEGER DEFAULT 0,
          reportes INTEGER DEFAULT 0,
          oculto INTEGER DEFAULT 0,
          en_revision INTEGER DEFAULT 0,
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS votos (
          item_tipo TEXT NOT NULL,
          item_id INTEGER NOT NULL,
          google_id TEXT NOT NULL,
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY(item_tipo, item_id, google_id)
      );
      CREATE TABLE IF NOT EXISTS reportes (
          item_tipo TEXT NOT NULL,
          item_id INTEGER NOT NULL,
          reporter_google_id TEXT NOT NULL,
          motivo TEXT DEFAULT '',
          creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY(item_tipo, item_id, reporter_google_id)
      );
    `);

    try { foroDb.exec("ALTER TABLE noticias ADD COLUMN bloques TEXT"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE hilos ADD COLUMN noticia_id TEXT"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE hilos ADD COLUMN reportes INTEGER DEFAULT 0"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE hilos ADD COLUMN en_revision INTEGER DEFAULT 0"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE comentarios ADD COLUMN parent_id INTEGER DEFAULT NULL"); } catch (e) {}
    try { foroDb.exec("ALTER TABLE comentarios ADD COLUMN en_revision INTEGER DEFAULT 0"); } catch (e) {}
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

    // Índices secundarios y compuestos para acelerar consultas del foro con alta concurrencia
    foroDb.exec(`
      CREATE INDEX IF NOT EXISTS idx_hilos_canal ON hilos(canal_id);
      CREATE INDEX IF NOT EXISTS idx_hilos_creado ON hilos(creado_en);
      CREATE INDEX IF NOT EXISTS idx_hilos_votos ON hilos(votos);
      CREATE INDEX IF NOT EXISTS idx_comentarios_hilo ON comentarios(hilo_id);
      CREATE INDEX IF NOT EXISTS idx_comentarios_parent ON comentarios(parent_id);
      CREATE INDEX IF NOT EXISTS idx_votos_item ON votos(item_tipo, item_id, google_id);
      CREATE INDEX IF NOT EXISTS idx_reportes_item ON reportes(item_tipo, item_id);
      CREATE INDEX IF NOT EXISTS idx_hilos_canal_compuesto ON hilos(canal_id, oculto, fijado, creado_en);
      CREATE INDEX IF NOT EXISTS idx_comentarios_hilo_compuesto ON comentarios(hilo_id, oculto, creado_en);
      CREATE INDEX IF NOT EXISTS idx_hilos_colegio_compuesto ON hilos(colegio_id, oculto);
    `);
    try { foroDb.exec("CREATE INDEX IF NOT EXISTS idx_hilos_noticia ON hilos(noticia_id)"); } catch (e) {}
    try { foroDb.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(LOWER(username)) WHERE username != '' AND username IS NOT NULL;"); } catch (e) {}

    // VULN-04 & VULN-21: Sembrar administrador inicial con PBKDF2 600.000 iteraciones y contraseña aleatoria segura
    const rowAdmins = foroDb.prepare("SELECT COUNT(*) as count FROM administradores").get();
    if (rowAdmins && rowAdmins.count === 0) {
      const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || crypto.randomBytes(16).toString("hex");
      const defaultSalt = crypto.randomBytes(16).toString("hex");
      const defaultHash = crypto.pbkdf2Sync(initialPassword, defaultSalt, 600000, 32, "sha256").toString("hex");
      foroDb.prepare("INSERT INTO administradores (usuario, password_hash, salt, rol) VALUES (?, ?, ?, ?)").run("admin", defaultHash, defaultSalt, "superadmin");
      if (!process.env.ADMIN_INITIAL_PASSWORD) {
        console.log("-> Administrador generado con contraseña inicial segura aleatoria (32 hex chars):", initialPassword);
      } else {
        console.log("-> Administrador por defecto inicializado desde ADMIN_INITIAL_PASSWORD");
      }
    }

    if (NODE_ENV === "test") {
      try {
        foroDb.prepare("DELETE FROM admin_login_rate_limit WHERE ip IN ('::1', '127.0.0.1', '::ffff:127.0.0.1', 'unknown')").run();
      } catch (e) {}
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

    // Sincronizar noticias oficiales de data/comunidad.json en SQLite
    try {
      const comFile = path.join(__dirname, "data", "comunidad.json");
      if (fs.existsSync(comFile)) {
        const comData = JSON.parse(fs.readFileSync(comFile, "utf-8"));
        if (Array.isArray(comData.noticias) && comData.noticias.length > 0) {
          const upsertNoticia = foroDb.prepare(`
            INSERT INTO noticias (id, titulo, categoria, categoria_slug, fecha, autor, tiempo_lectura, badge, resumen, contenido, bloques, tags, imagen_url, fijada)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              titulo=excluded.titulo,
              categoria=excluded.categoria,
              categoria_slug=excluded.categoria_slug,
              fecha=excluded.fecha,
              autor=excluded.autor,
              tiempo_lectura=excluded.tiempo_lectura,
              badge=excluded.badge,
              resumen=excluded.resumen,
              contenido=excluded.contenido,
              bloques=excluded.bloques,
              tags=excluded.tags,
              imagen_url=excluded.imagen_url,
              fijada=excluded.fijada
          `);
          for (const n of comData.noticias) {
            upsertNoticia.run(
              n.id,
              n.titulo,
              n.categoria,
              n.categoriaSlug || "general",
              n.fecha || "16/09/2026",
              n.autor || "Redacción Estudiantina.online",
              n.tiempoLectura || "3 min de lectura",
              n.badge || "LANZAMIENTO",
              n.resumen || "",
              JSON.stringify(n.contenido || []),
              JSON.stringify(n.bloques || []),
              JSON.stringify(n.tags || []),
              n.imagen || n.imagenUrl || "assets/logo.png",
              n.fijada ? 1 : 0
            );
          }
        }
      }
    } catch(e) {
      console.error("Error sincronizando noticias de comunidad.json:", e);
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
      ins.run("offtopic", "Off Topic", "Charlas libres, memes, debates abiertos y anécdotas fuera de competencia.", "☕", "#f43f5e");
    } else {
      try {
        const hasNoticiasCanal = foroDb.prepare("SELECT 1 FROM canales WHERE id = 'noticias'").get();
        if (!hasNoticiasCanal) {
          foroDb.prepare("INSERT INTO canales (id, titulo, descripcion, icono, color) VALUES (?, ?, ?, ?, ?)").run(
            "noticias", "Noticias & Cobertura", "Debates oficiales sobre las crónicas, coberturas y novedades de estudiantina.online.", "📰", "#38bdf8"
          );
        }
        const hasOfftopicCanal = foroDb.prepare("SELECT 1 FROM canales WHERE id = 'offtopic'").get();
        if (!hasOfftopicCanal) {
          foroDb.prepare("INSERT INTO canales (id, titulo, descripcion, icono, color) VALUES (?, ?, ?, ?, ?)").run(
            "offtopic", "Off Topic", "Charlas libres, memes, debates abiertos y anécdotas fuera de competencia.", "☕", "#f43f5e"
          );
        }
      } catch (e) {}
    }

    // Sembrar usuarios demo y autores del sistema con nombres de usuario únicos
    const insU = foroDb.prepare("INSERT OR IGNORE INTO usuarios (google_id, email, nombre, username, avatar_url, colegio_id, rol_estudiantil, ano_escolar, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    insU.run("admin-redaccion", "redaccion@estudiantina.online", "Redacción Oficial", "redaccion", "assets/avatar-redaccion.webp", "posadas", "Redacción Oficial", "Equipo Editorial", "Cobertura oficial y crónica minuto a minuto de la Estudiantina.");
    insU.run("demo-user-1", "lucas@example.com", "Lucas Percusión", "lucas_percusion", "assets/avatar-default.webp", "janssen", "Redoblante", "5° Año (Promo)", "Apasionado del ritmo y los cortes de batería del Janssen.");
    insU.run("demo-user-2", "valentina@example.com", "Valentina Pasista", "valen_pasista", "assets/avatar-default.webp", "santa_maria", "Pasista de Escuadra", "4° Año", "Bailando en la costanera con el corazón azul y blanco.");
    insU.run("demo-user-3", "agustin@example.com", "Agustín Gamer", "agustin_gamer", "assets/avatar-default.webp", "industrial", "Director/a de Banda", "6° Año Técnico", "Simulador y tambores en la previa de la fiesta.");
    insU.run("seed-roque-1", "bautista@example.com", "Bautista Roque", "bauti_roque", "assets/avatar-default.webp", "roque", "Chanchero Mayor", "5° Año (Promo)", "Dejando la piel en cada golpe de chancha por el Roque.");
    insU.run("seed-roque-2", "camila@example.com", "Camila Pasista", "camila_pasista", "assets/avatar-default.webp", "roque", "Pasista Principal", "4° Año", "Brillo y sincronización en la Costanera.");
    insU.run("seed-santa-1", "valen_sm@example.com", "Valentina Pasista", "valentina_sm", "assets/avatar-default.webp", "santa_maria", "Bastonera", "5° Año (Promo)", "Orgullo y pasión albiazul en cada pasada.");
    insU.run("seed-santa-2", "sofi@example.com", "Sofi Santa", "sofi_santa", "assets/avatar-default.webp", "santa_maria", "Hincha de Tribuna", "3° Año", "La tribuna del Santa copando el cuarto tramo.");
    insU.run("seed-sanba-1", "mateo@example.com", "Mateo Sanba", "mateo_sanba", "assets/avatar-default.webp", "san_basilio", "Redoblante", "4° Año", "El compás dinámico del San Basilio.");
    insU.run("seed-madre-1", "lucia@example.com", "Lucía Pasista", "lucia_madre", "assets/avatar-default.webp", "madre_misericordia", "Cuerpo de Baile", "5° Año (Promo)", "Coreografía y elegancia en la pista.");
    insU.run("seed-indu-2", "franco@example.com", "Franco Indu", "franco_indu", "assets/avatar-default.webp", "industrial", "Banda de Música", "6° Año Técnico", "Potencia pesada de la EPET 1.");
    insU.run("seed-janssen-1", "lucas_j@example.com", "Lucas Percusión", "lucas_janssen", "assets/avatar-default.webp", "janssen", "Caja / Redoble", "5° Año", "Tradición y cortes precisos en los palcos.");
    insU.run("seed-34-1", "santy@example.com", "Santy Ruiz Diaz", "sonta", "assets/avatar-default.webp", "epet_34", "Director/a de Banda", "6° Año Técnico", "Liderando los parches y el simulador.");
    insU.run("seed-goyena-1", "julieta@example.com", "Julieta Goyena", "juli_goyena", "assets/avatar-default.webp", "goyena", "Cuerpo de Baile", "4° Año", "Alegría y ritmo del Goyena.");
    insU.run("seed-nacional-1", "rodrigo@example.com", "Rodrigo Nacional", "rodrigo_nacional", "assets/avatar-default.webp", "nacional", "Banda de Música", "5° Año", "Aliento sin pausa del Martín de Moussy.");
    insU.run("seed-normal-1", "nahuel@example.com", "Nahuel Normal", "nahuel_normal", "assets/avatar-default.webp", "normal_estados_unidos", "Banda de Música", "5° Año", "Fuerza histórica de la Normal.");
    insU.run("seed-c6-1", "joaquin@example.com", "Joaquín C6", "joaquin_c6", "assets/avatar-default.webp", "comercio_6", "Banda de Música", "5° Año", "Los cortes del Comercio 6 en el anfiteatro.");
    insU.run("seed-c18-1", "belen@example.com", "Belén C18", "belen_c18", "assets/avatar-default.webp", "comercio_18", "Cuerpo de Baile", "4° Año", "La magia y color del Comercio 18.");
    insU.run("seed-bachi-1", "clara@example.com", "Clara Bachi", "clara_bachi", "assets/avatar-default.webp", "humanista", "Estandarte Alegórico", "5° Año (Promo)", "Fineza conceptual del Bachillerato Humanista.");

    // Auto-reparación: Asegurar que TODO autor en hilos o comentarios tenga su usuario único
    try {
      const autoresSinUsuario = foroDb.prepare(`
        SELECT DISTINCT autor_google_id, autor_nombre, autor_avatar, colegio_id
        FROM (
          SELECT autor_google_id, autor_nombre, autor_avatar, colegio_id FROM hilos
          UNION
          SELECT autor_google_id, autor_nombre, autor_avatar, colegio_id FROM comentarios
        ) a
        WHERE a.autor_google_id NOT IN (SELECT google_id FROM usuarios)
      `).all();

      for (const a of autoresSinUsuario) {
        if (!a.autor_google_id) continue;
        const cleanName = (a.autor_nombre || "Hincha").trim();
        let baseUser = cleanName.toLowerCase().replace(/[^a-z0-9_]/g, "");
        if (!baseUser || baseUser.length < 3) baseUser = "hincha_" + a.autor_google_id.slice(-4);
        baseUser = baseUser.slice(0, 16);

        // Verificar unicidad
        const existU = foroDb.prepare("SELECT 1 FROM usuarios WHERE LOWER(username) = LOWER(?)").get(baseUser);
        const finalUser = existU ? `${baseUser}_${a.autor_google_id.slice(-4)}` : baseUser;

        insU.run(
          a.autor_google_id,
          `${finalUser}@estudiantina.online`,
          cleanName,
          finalUser,
          a.autor_avatar || "assets/avatar-default.webp",
          a.colegio_id || "janssen",
          "Hincha de Tribuna",
          "Secundaria",
          "Hincha posadeño de la fiesta estudiantil."
        );
      }

      // Auto-reparación: usuarios con username vacío o nulo
      const sinUsername = foroDb.prepare("SELECT google_id, nombre FROM usuarios WHERE username IS NULL OR username = ''").all();
      for (const u of sinUsername) {
        let base = (u.nombre || "hincha").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 12);
        if (!base || base.length < 3) base = "hincha";
        const unique = `${base}_${u.google_id.slice(-4)}`;
        foroDb.prepare("UPDATE usuarios SET username = ? WHERE google_id = ?").run(unique, u.google_id);
      }
    } catch (e) {
      console.warn("Auto-reparación de usuarios:", e.message);
    }

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

// Pool de Sentencias Preparadas SQLite (elimina costo de compilación repetida)
const _stmtCache = new Map();
function getStmt(db, sql) {
  let stmt = _stmtCache.get(sql);
  if (!stmt) {
    stmt = db.prepare(sql);
    _stmtCache.set(sql, stmt);
  }
  return stmt;
}

// Rate-limiting en memoria con poda periódica O(1)
const _rateLimitMap = new Map();
const _rateLimitComentarioMap = new Map();

const _rateLimitCleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of _rateLimitMap.entries()) {
    if (now - timestamp > 60000) _rateLimitMap.delete(key);
  }
  for (const [key, timestamp] of _rateLimitComentarioMap.entries()) {
    if (now - timestamp > 30000) _rateLimitComentarioMap.delete(key);
  }
}, 60000);
_rateLimitCleanup.unref();

function checkRateLimit(googleId, windowMs = 30000) {
  if (!googleId) return false;
  const now = Date.now();
  const last = _rateLimitMap.get(googleId) || 0;
  if (now - last < windowMs) return false;
  _rateLimitMap.set(googleId, now);
  return true;
}

function checkCommentRateLimit(googleId, windowMs = 5000) {
  if (!googleId) return false;
  const now = Date.now();
  const last = _rateLimitComentarioMap.get(googleId) || 0;
  if (now - last < windowMs) return false;
  _rateLimitComentarioMap.set(googleId, now);
  return true;
}

// Helper de alto throughput para respuestas JSON con compresión nativa (Gzip) y ETag condicional
function sendOptimizedJson(req, res, statusCode, payload, { cacheable = false, maxAge = 15 } = {}) {
  const jsonStr = typeof payload === "string" ? payload : JSON.stringify(payload);
  const jsonBuffer = Buffer.from(jsonStr, "utf-8");

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  if (cacheable && statusCode === 200) {
    const etag = `"${crypto.createHash("md5").update(jsonBuffer).digest("hex")}"`;
    headers["ETag"] = etag;
    headers["Cache-Control"] = `public, max-age=${maxAge}, stale-while-revalidate=60`;

    if (req.headers["if-none-match"] === etag) {
      res.writeHead(304, headers);
      res.end();
      return;
    }
  } else {
    headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
  }

  const acceptEncoding = req.headers["accept-encoding"] || "";
  if (acceptEncoding.includes("gzip") && jsonBuffer.length > 1024) {
    zlib.gzip(jsonBuffer, (err, gzipped) => {
      if (err) {
        headers["Content-Length"] = jsonBuffer.length;
        res.writeHead(statusCode, headers);
        res.end(jsonBuffer);
        return;
      }
      headers["Content-Encoding"] = "gzip";
      headers["Content-Length"] = gzipped.length;
      res.writeHead(statusCode, headers);
      res.end(gzipped);
    });
  } else {
    headers["Content-Length"] = jsonBuffer.length;
    res.writeHead(statusCode, headers);
    res.end(jsonBuffer);
  }
}

// Helpers de Seguridad de Administración
function generateAdminToken(admin) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    id: admin.id,
    usuario: admin.usuario,
    rol: admin.rol,
    iat: now,
    exp: now + 24 * 60 * 60 // 24 horas
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", ADMIN_SECRET).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return null;
  const clean = token.trim();

  // VULN-12: Reject ADMIN_SECRET as Bearer token. Solo ADMIN_TOKEN maestro o HMAC firmado
  if (ADMIN_TOKEN && clean.length === ADMIN_TOKEN.length && crypto.timingSafeEqual(Buffer.from(clean), Buffer.from(ADMIN_TOKEN))) {
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
    const now = Math.floor(Date.now() / 1000);
    if (!payload || typeof payload.exp !== "number" || typeof payload.iat !== "number") return null;
    const expSec = payload.exp > 10000000000 ? Math.floor(payload.exp / 1000) : payload.exp;
    const iatSec = payload.iat > 10000000000 ? Math.floor(payload.iat / 1000) : payload.iat;
    if (expSec < now) return null;
    if (iatSec > now + 60) return null;
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

// VULN-03: Google ID Token verification
async function verifyGoogleToken(token, explicitGoogleId = null, req = null) {
  const isTest = (NODE_ENV === "test");

  if (req) {
    const testHeader = req.headers["x-test-google-id"];
    if (isTest && testHeader) {
      return { googleId: String(testHeader).trim(), email: "", name: "", avatar: "" };
    }
    if (!token) {
      const auth = req.headers["authorization"] || "";
      if (auth.startsWith("Bearer ")) {
        token = auth.substring(7).trim();
      }
    }
  }

  if (isTest && token && (token.startsWith("test-") || token.startsWith("test_") || token === "test-token")) {
    return { googleId: token, email: "", name: "", avatar: "" };
  }

  if (isTest && explicitGoogleId && !token) {
    return { googleId: explicitGoogleId, email: "", name: "", avatar: "" };
  }

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`, {
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const info = await res.json();
    if (!info || !info.sub) return null;

    if (info.exp && Number(info.exp) * 1000 < Date.now()) {
      return null;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && info.aud && info.aud !== clientId) {
      return null;
    }

    return {
      googleId: info.sub,
      email: info.email || "",
      name: info.name || "",
      avatar: info.picture || ""
    };
  } catch (e) {
    return null;
  }
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
    guardarComunidad(currentData);
  } catch (e) {
    console.error("Error sincronizando comunidad.json:", e);
  }
}

function guardarComunidad(datos) {
  try {
    const comunidadFile = path.join(__dirname, "data", "comunidad.json");
    const dir = path.dirname(comunidadFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = path.join(dir, `comunidad.${Date.now()}.${crypto.randomBytes(4).toString("hex")}.tmp`);
    fs.writeFileSync(tempFile, JSON.stringify(datos, null, 2), "utf-8");
    fs.renameSync(tempFile, comunidadFile);
    return true;
  } catch (err) {
    console.error("Error guardando comunidad.json:", err);
    return false;
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

// VULN-10: Whitelist estricta de 33 colegios oficiales de Posadas (alineado 100% con js/colegios.js y api/ranking.php)
const COLEGIOS_WHITELIST = new Set([
  "janssen", "industrial", "santa_maria", "roque", "san_basilio",
  "madre_misericordia", "pedro_goyena", "nacional", "normal_mixta",
  "humanista", "cep_4", "virgen_itati", "comercio_6", "mborore",
  "san_alberto", "del_carmen", "jesus_nino", "inmaculada", "epet_2",
  "jesus_nazareth", "comercio_8", "lisandro_torre", "epet_34", "bop_9",
  "estrada", "san_jorge", "san_miguel", "verbo_divino", "normal_10",
  "comercio_18", "santa_catalina", "bop_1", "epet_37"
]);

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

// VULN-09: Escritura atómica vía archivo temporal + renombre
function guardarRanking(datos) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = path.join(dir, `ranking.${Date.now()}.${crypto.randomBytes(4).toString("hex")}.tmp`);
    fs.writeFileSync(tempFile, JSON.stringify(datos, null, 2), "utf-8");
    fs.renameSync(tempFile, DATA_FILE);
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
  res.setHeader("Vary", "Origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

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

      sendOptimizedJson(req, res, 200, {
        status: "ok",
        noticias,
        cronograma: baseData.cronograma,
        guia: baseData.guia,
        faq: baseData.faq,
        ajustes: baseData.ajustes
      }, { cacheable: true, maxAge: 30 });
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
    if (req.method === "GET") {
      const data = leerRanking();
      sendOptimizedJson(req, res, 200, { status: "ok", top10: data.top10, colegios: data.colegios }, { cacheable: true, maxAge: 15 });
      return;
    }

    if (req.method === "POST") {
      let bodyStr = "";
      let totalBytes = 0;
      let payloadTooLarge = false;
      const MAX_PAYLOAD = 2 * 1024 * 1024;

      req.on("data", chunk => {
        if (payloadTooLarge) return;
        totalBytes += chunk.length;
        if (totalBytes > MAX_PAYLOAD) {
          payloadTooLarge = true;
          res.writeHead(413, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", message: "Payload demasiado grande" }));
          req.destroy();
          return;
        }
        bodyStr += chunk;
      });

      req.on("end", () => {
        if (payloadTooLarge) return;
        try {
          const body = JSON.parse(bodyStr || "{}");
          const action = body.action || reqUrl.searchParams.get("action") || "";
          const data = leerRanking();

          if (action === "registrarEgresado") {
            const egresado = body.egresado;
            if (!egresado) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Datos de egresado faltantes" }));
              return;
            }

            const colegioId = String(egresado.colegioId || "").trim().toLowerCase();
            if (!colegioId || !COLEGIOS_WHITELIST.has(colegioId)) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Colegio no válido o no autorizado" }));
              return;
            }

            const nuevoRegistro = {
              id: "global_" + Date.now() + "_" + crypto.randomBytes(4).toString("hex"),
              nombre: String(egresado.nombre || "Egresado").slice(0, 30),
              apodoJugador: String(egresado.apodoJugador || "").slice(0, 35),
              colegioId,
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

            res.writeHead(200, { "Content-Type": "application/json" });
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
            const colegioId = String(body.colegioId || "").trim().toLowerCase();
            if (!colegioId || !COLEGIOS_WHITELIST.has(colegioId)) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Colegio no válido o no autorizado" }));
              return;
            }

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

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok" }));
            return;
          }

          if (action === "registrarTemporada") {
            const colegioId = String(body.colegioId || "").trim().toLowerCase();
            if (!colegioId || !COLEGIOS_WHITELIST.has(colegioId)) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Colegio no válido o no autorizado" }));
              return;
            }

            const puesto = Number(body.puesto) || 0;
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

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok" }));
            return;
          }

          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", message: "Acción POST no válida" }));
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", message: "Error procesando petición" }));
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
        const canales = getStmt(db, `
          SELECT c.*, COUNT(h.id) as hilos_count
          FROM canales c
          LEFT JOIN hilos h ON c.id = h.canal_id AND h.oculto = 0
          GROUP BY c.id
        `).all();

        const colegiosCountsRaw = getStmt(db, `
          SELECT colegio_id, COUNT(id) as count
          FROM hilos
          WHERE oculto = 0
          GROUP BY colegio_id
        `).all();
        const colegiosCounts = {};
        colegiosCountsRaw.forEach(r => {
          if (r.colegio_id) colegiosCounts[r.colegio_id] = r.count;
        });

        const usersRow = getStmt(db, `SELECT COUNT(*) as count FROM usuarios`).get();
        const totalUsuarios = usersRow ? Number(usersRow.count) : 0;

        sendOptimizedJson(req, res, 200, { status: "ok", canales, colegiosCounts, totalUsuarios }, { cacheable: true, maxAge: 20 });
        return;
      }

      if (action === "hilos") {
        const canal = reqUrl.searchParams.get("canal") || "todos";
        const colegio = (reqUrl.searchParams.get("colegio") || "").trim();
        const sort = reqUrl.searchParams.get("sort") || "top";
        const limit = Math.min(50, Math.max(1, parseInt(reqUrl.searchParams.get("limit") || "10", 10)));
        const offset = Math.max(0, parseInt(reqUrl.searchParams.get("offset") || "0", 10));
        const q = (reqUrl.searchParams.get("q") || "").trim();
        const viewerGoogleId = reqUrl.searchParams.get("googleId") || "";

        let sql = `
          SELECT
            h.*,
            COALESCE(NULLIF(u.username, ''), '') as autor_username,
            COALESCE(NULLIF(u.nombre, ''), h.autor_nombre) as autor_nombre,
            COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), h.autor_avatar) as autor_avatar,
            COALESCE(NULLIF(u.colegio_id, ''), h.colegio_id) as colegio_id,
            COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
          FROM hilos h
          LEFT JOIN usuarios u ON h.autor_google_id = u.google_id
          WHERE h.oculto = 0 AND (h.en_revision = 0 OR h.en_revision IS NULL)
        `;
        const params = [];

        if (canal !== "todos" && canal !== "") {
          sql += " AND h.canal_id = ?";
          params.push(canal);
        }

        if (colegio !== "" && colegio !== "todos") {
          sql += " AND h.colegio_id = ?";
          params.push(colegio);
        }

        // VULN-22: Búsqueda full-text escapando caracteres comodín LIKE (% y _)
        if (q) {
          const escapedQ = q.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
          sql += " AND (h.titulo LIKE ? ESCAPE '\\' OR h.contenido LIKE ? ESCAPE '\\' OR h.autor_nombre LIKE ? ESCAPE '\\' OR u.username LIKE ? ESCAPE '\\')";
          const like = `%${escapedQ}%`;
          params.push(like, like, like, like);
        }

        if (sort === "recientes") {
          sql += ` ORDER BY h.fijado DESC, h.creado_en DESC LIMIT ${limit} OFFSET ${offset}`;
        } else if (sort === "comentados") {
          sql += ` ORDER BY h.fijado DESC, h.respuestas_count DESC, h.votos DESC, h.creado_en DESC LIMIT ${limit} OFFSET ${offset}`;
        } else {
          sql += ` ORDER BY h.fijado DESC, h.votos DESC, h.creado_en DESC LIMIT ${limit} OFFSET ${offset}`;
        }

        const hilosRaw = db.prepare(sql).all(...params);
        let votedHilosSet = new Set();
        if (viewerGoogleId && hilosRaw.length > 0) {
          const ids = hilosRaw.map(h => h.id);
          const placeholders = ids.map(() => "?").join(",");
          const vRows = db.prepare(`SELECT item_id FROM votos WHERE item_tipo = 'hilo' AND google_id = ? AND item_id IN (${placeholders})`).all(viewerGoogleId, ...ids);
          for (const r of vRows) votedHilosSet.add(r.item_id);
        }
        const hilos = hilosRaw.map(h => {
          h.user_voted = votedHilosSet.has(h.id) ? 1 : 0;
          return h;
        });

        // Conteo total para métricas y paginación en frontend
        let countSql = "SELECT COUNT(*) as total FROM hilos h LEFT JOIN usuarios u ON h.autor_google_id = u.google_id WHERE h.oculto = 0 AND (h.en_revision = 0 OR h.en_revision IS NULL)";
        const countParams = [];
        if (canal !== "todos" && canal !== "") {
          countSql += " AND h.canal_id = ?";
          countParams.push(canal);
        }
        if (colegio !== "" && colegio !== "todos") {
          countSql += " AND h.colegio_id = ?";
          countParams.push(colegio);
        }
        if (q) {
          const escapedQ = q.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
          countSql += " AND (h.titulo LIKE ? ESCAPE '\\' OR h.contenido LIKE ? ESCAPE '\\' OR h.autor_nombre LIKE ? ESCAPE '\\' OR u.username LIKE ? ESCAPE '\\')";
          const like = `%${escapedQ}%`;
          countParams.push(like, like, like, like);
        }
        const countRow = db.prepare(countSql).get(...countParams);
        const totalCount = countRow ? countRow.total : hilosRaw.length;
        const usersRow = getStmt(db, `SELECT COUNT(*) as count FROM usuarios`).get();
        const totalUsuarios = usersRow ? Number(usersRow.count) : 0;

        sendOptimizedJson(req, res, 200, { status: "ok", total_count: totalCount, total_usuarios: totalUsuarios, totalUsuarios, hilos }, { cacheable: !viewerGoogleId && !q, maxAge: 15 });
        return;
      }

      if (action === "hilo") {
        const id = parseInt(reqUrl.searchParams.get("id") || "0", 10);
        const viewerGoogleId = reqUrl.searchParams.get("googleId") || "";
        const hilo = db.prepare(`
          SELECT
            h.*,
            COALESCE(NULLIF(u.username, ''), '') as autor_username,
            COALESCE(NULLIF(u.nombre, ''), h.autor_nombre) as autor_nombre,
            COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), h.autor_avatar) as autor_avatar,
            COALESCE(NULLIF(u.colegio_id, ''), h.colegio_id) as colegio_id,
            COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
          FROM hilos h
          LEFT JOIN usuarios u ON h.autor_google_id = u.google_id
          WHERE h.id = ? AND h.oculto = 0 AND (h.en_revision = 0 OR h.en_revision IS NULL)
        `).get(id);

        if (!hilo) {
          res.writeHead(404);
          res.end(JSON.stringify({ status: "error", message: "Hilo no encontrado o eliminado" }));
          return;
        }

        // Incluir si el visitante ya votó el hilo principal
        if (viewerGoogleId) {
          const hiloVoted = getStmt(db, "SELECT 1 FROM votos WHERE item_tipo = 'hilo' AND item_id = ? AND google_id = ?").get(id, viewerGoogleId);
          hilo.user_voted = hiloVoted ? 1 : 0;
        } else {
          hilo.user_voted = 0;
        }

        const comentariosRaw = db.prepare(`
          SELECT
            c.*,
            COALESCE(NULLIF(u.username, ''), '') as autor_username,
            COALESCE(NULLIF(u.nombre, ''), c.autor_nombre) as autor_nombre,
            COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), c.autor_avatar) as autor_avatar,
            COALESCE(NULLIF(u.colegio_id, ''), c.colegio_id) as colegio_id,
            COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
          FROM comentarios c
          LEFT JOIN usuarios u ON c.autor_google_id = u.google_id
          WHERE c.hilo_id = ? AND c.oculto = 0 AND (c.en_revision = 0 OR c.en_revision IS NULL)
          ORDER BY c.creado_en ASC
        `).all(id);

        let votedComentariosSet = new Set();
        if (viewerGoogleId && comentariosRaw.length > 0) {
          const cIds = comentariosRaw.map(c => c.id);
          const placeholders = cIds.map(() => "?").join(",");
          const vRows = db.prepare(`SELECT item_id FROM votos WHERE item_tipo = 'comentario' AND google_id = ? AND item_id IN (${placeholders})`).all(viewerGoogleId, ...cIds);
          for (const r of vRows) votedComentariosSet.add(r.item_id);
        }

        // Enriquecer cada comentario con user_voted
        const comentarios = comentariosRaw.map(c => {
          c.user_voted = votedComentariosSet.has(c.id) ? 1 : 0;
          return c;
        });

        sendOptimizedJson(req, res, 200, { status: "ok", hilo, comentarios });
        return;
      }

      if (action === "noticia_hilo") {
        const noticiaId = (reqUrl.searchParams.get("noticiaId") || reqUrl.searchParams.get("noticia_id") || "").trim();
        const viewerGoogleId = (reqUrl.searchParams.get("googleId") || "").trim();

        if (!noticiaId) {
          res.writeHead(400);
          res.end(JSON.stringify({ status: "error", message: "Parámetro noticiaId requerido" }));
          return;
        }

        // VULN-10: Verificar existencia de la noticia antes de crear hilo
        const notic = db.prepare("SELECT * FROM noticias WHERE id = ?").get(noticiaId);
        if (!notic) {
          res.writeHead(404);
          res.end(JSON.stringify({ status: "error", message: "Noticia no encontrada" }));
          return;
        }

        // Buscar hilo asociado a la noticia
        let hilo = db.prepare(`
          SELECT
            h.*,
            COALESCE(NULLIF(u.username, ''), '') as autor_username,
            COALESCE(NULLIF(u.nombre, ''), h.autor_nombre) as autor_nombre,
            COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), h.autor_avatar) as autor_avatar,
            COALESCE(NULLIF(u.colegio_id, ''), h.colegio_id) as colegio_id,
            COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
          FROM hilos h
          LEFT JOIN usuarios u ON h.autor_google_id = u.google_id
          WHERE h.noticia_id = ? AND h.oculto = 0 AND (h.en_revision = 0 OR h.en_revision IS NULL)
        `).get(noticiaId);

        // Si no existe, crearlo on-demand buscando los datos de la noticia
        if (!hilo) {
          const titulo = notic.titulo || `Debate: Noticia ${noticiaId}`;
          const contenido = notic.resumen || (notic.titulo || "Espacio oficial de debate y comentarios sobre esta cobertura periodística.");

          const ins = db.prepare(`
            INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, noticia_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run("noticias", titulo, contenido, "admin-redaccion", "Redacción Oficial", "assets/avatar-redaccion.webp", "posadas", noticiaId);

          hilo = db.prepare(`
            SELECT
              h.*,
              COALESCE(NULLIF(u.username, ''), '') as autor_username,
              COALESCE(NULLIF(u.nombre, ''), h.autor_nombre) as autor_nombre,
              COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), h.autor_avatar) as autor_avatar,
              COALESCE(NULLIF(u.colegio_id, ''), h.colegio_id) as colegio_id,
              COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
            FROM hilos h
            LEFT JOIN usuarios u ON h.autor_google_id = u.google_id
            WHERE h.id = ?
          `).get(ins.lastInsertRowid);
        }

        if (viewerGoogleId) {
          const hiloVoted = db.prepare("SELECT 1 FROM votos WHERE item_tipo = 'hilo' AND item_id = ? AND google_id = ?").get(hilo.id, viewerGoogleId);
          hilo.user_voted = hiloVoted ? 1 : 0;
        } else {
          hilo.user_voted = 0;
        }

        const comentariosRaw = db.prepare(`
          SELECT
            c.*,
            COALESCE(NULLIF(u.username, ''), '') as autor_username,
            COALESCE(NULLIF(u.nombre, ''), c.autor_nombre) as autor_nombre,
            COALESCE(NULLIF(u.avatar_personalizado, ''), NULLIF(u.avatar_url, ''), c.autor_avatar) as autor_avatar,
            COALESCE(NULLIF(u.colegio_id, ''), c.colegio_id) as colegio_id,
            COALESCE(u.rol_estudiantil, 'Hincha de Tribuna') as autor_rol
          FROM comentarios c
          LEFT JOIN usuarios u ON c.autor_google_id = u.google_id
          WHERE c.hilo_id = ? AND c.oculto = 0 AND (c.en_revision = 0 OR c.en_revision IS NULL)
          ORDER BY c.creado_en ASC
        `).all(hilo.id);

        let votedNoticiaComentariosSet = new Set();
        if (viewerGoogleId && comentariosRaw.length > 0) {
          const cIds = comentariosRaw.map(c => c.id);
          const placeholders = cIds.map(() => "?").join(",");
          const vRows = db.prepare(`SELECT item_id FROM votos WHERE item_tipo = 'comentario' AND google_id = ? AND item_id IN (${placeholders})`).all(viewerGoogleId, ...cIds);
          for (const r of vRows) votedNoticiaComentariosSet.add(r.item_id);
        }

        const comentarios = comentariosRaw.map(c => {
          c.user_voted = votedNoticiaComentariosSet.has(c.id) ? 1 : 0;
          return c;
        });

        sendOptimizedJson(req, res, 200, { status: "ok", hilo, comentarios });
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
        const karmaHilos = karmaHilosRow ? karmaHilosRow.karma : 0;
        const karmaComentarios = karmaComentariosRow ? karmaComentariosRow.karma : 0;
        const karmaTotal = karmaHilos + karmaComentarios;
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
            karmaTotal,
            karmaHilos,
            karmaComentarios
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
      let totalBytes = 0;
      let payloadTooLarge = false;
      const MAX_PAYLOAD = 2 * 1024 * 1024;

      req.on("data", chunk => {
        if (payloadTooLarge) return;
        totalBytes += chunk.length;
        if (totalBytes > MAX_PAYLOAD) {
          payloadTooLarge = true;
          res.writeHead(413, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", message: "Payload demasiado grande" }));
          req.destroy();
          return;
        }
        bodyStr += chunk;
      });

      req.on("end", async () => {
        if (payloadTooLarge) return;
        try {
          const body = JSON.parse(bodyStr || "{}");

          if (action === "auth_google") {
            const rawGoogleId = String(body.googleId || "").trim();
            const auth = await verifyGoogleToken(body.token, rawGoogleId, req);
            if (!auth) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Token de autenticación no válido" }));
              return;
            }
            const googleId = auth.googleId;
            const nombre = escapeHtml(String(body.nombre || auth.name || "").trim().slice(0, 50));
            const email = String(body.email || auth.email || "").trim();
            const avatarUrl = String(body.avatarUrl || auth.avatar || "").trim();
            const colegioId = String(body.colegioId || "janssen").trim();

            if (!googleId || !nombre) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Datos incompletos" }));
              return;
            }

            // VULN-15: Limitar tamaño de avatar
            if (avatarUrl && avatarUrl.length > 300000) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Avatar supera el tamaño máximo permitido (300KB)" }));
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

            res.writeHead(200, { "Content-Type": "application/json" });
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
            const rawGoogleId = String(body.googleId || "").trim();
            const auth = await verifyGoogleToken(body.token, rawGoogleId, req);
            if (!auth) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "No autorizado. Token de Google inválido." }));
              return;
            }
            const googleId = auth.googleId;
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
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "ID de usuario requerido" }));
              return;
            }

            // VULN-15: Limitar tamaño de avatar
            if (avatarUrl && avatarUrl.length > 300000) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "El avatar supera el tamaño máximo permitido (300KB)" }));
              return;
            }

            const checkUser = validateUsername(rawUsername);
            if (!checkUser.valid) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: checkUser.message }));
              return;
            }

            // Validar unicidad en SQLite
            const taken = db.prepare("SELECT google_id FROM usuarios WHERE LOWER(username) = LOWER(?) AND google_id != ?").get(checkUser.username, googleId);
            if (taken) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "El nombre de usuario ya está registrado por otro hincha." }));
              return;
            }

            if (!nombre || nombre.length < 2) {
              res.writeHead(400, { "Content-Type": "application/json" });
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

            res.writeHead(200, { "Content-Type": "application/json" });
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
            const rawGoogleId = String(body.googleId || "").trim();
            const auth = await verifyGoogleToken(body.token, rawGoogleId, req);
            if (!auth) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "No autorizado. Token de Google inválido." }));
              return;
            }
            const googleId = auth.googleId;
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
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "ID de usuario requerido" }));
              return;
            }

            // VULN-15: Limitar tamaño de avatar
            if (avatarUrl && avatarUrl.length > 300000) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "El avatar supera el tamaño máximo permitido (300KB)" }));
              return;
            }

            if (!nombre || nombre.length < 2) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "El nombre debe tener al menos 2 caracteres" }));
              return;
            }

            // Validar username si se proporcionó
            let validatedUsername = null;
            if (rawUsername) {
              const checkUser = validateUsername(rawUsername);
              if (!checkUser.valid) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ status: "error", message: checkUser.message }));
                return;
              }
              const taken = db.prepare("SELECT google_id FROM usuarios WHERE LOWER(username) = LOWER(?) AND google_id != ?").get(checkUser.username, googleId);
              if (taken) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ status: "error", message: "El nombre de usuario ya está registrado por otro hincha." }));
                return;
              }
              validatedUsername = checkUser.username;
            }

            // Verificar si el usuario está sancionado
            const sanction = checkUserSanction(db, googleId);
            if (sanction && sanction.bloqueado) {
              res.writeHead(403, { "Content-Type": "application/json" });
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

            res.writeHead(200, { "Content-Type": "application/json" });
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
            const rawGoogleId = String(body.googleId || "").trim();
            const autorNombre = escapeHtml(String(body.autorNombre || "").trim().slice(0, 60));
            const autorAvatar = String(body.autorAvatar || "").trim();
            const colegioId = String(body.colegioId || "janssen").trim();

            if (!titulo || titulo.length < 5) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "El título debe tener al menos 5 caracteres" }));
              return;
            }
            if (!contenido || contenido.length < 10) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "El contenido debe tener al menos 10 caracteres" }));
              return;
            }
            if (!rawGoogleId || !autorNombre) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Iniciá sesión con Google para publicar" }));
              return;
            }

            const auth = await verifyGoogleToken(body.token, rawGoogleId, req);
            if (!auth) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Debés identificarte con tu cuenta de Google para publicar." }));
              return;
            }
            const googleId = auth.googleId;

            // VULN-15: Limitar tamaño de avatar
            if (autorAvatar && autorAvatar.length > 300000) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "El avatar supera el tamaño máximo permitido (300KB)" }));
              return;
            }

            // Verificar si el usuario está suspendido o baneado
            const sanctionHilo = checkUserSanction(db, googleId);
            if (sanctionHilo && sanctionHilo.bloqueado) {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: sanctionHilo.mensaje, sanction: sanctionHilo }));
              return;
            }

            // Rate-limiting: máximo 1 debate cada 30 segundos por usuario
            if (!checkRateLimit(googleId)) {
              res.writeHead(429, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Esperá 30 segundos entre debates. ¡No hagas spam!" }));
              return;
            }

            const info = db.prepare(`
              INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(canalId, titulo, contenido, googleId, autorNombre, autorAvatar, colegioId);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok", hiloId: info.lastInsertRowid, message: "Debate publicado con éxito!" }));
            return;
          }

          if (action === "comentar") {
            const hiloId = parseInt(body.hiloId || 0, 10);
            const contenido = escapeHtml(String(body.contenido || "").trim().slice(0, 2000));
            const rawGoogleId = String(body.googleId || "").trim();
            const autorNombre = escapeHtml(String(body.autorNombre || "").trim().slice(0, 60));
            const autorAvatar = String(body.autorAvatar || "").trim();
            const colegioId = String(body.colegioId || "janssen").trim();

            if (hiloId <= 0 || !contenido) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Comentario vacío" }));
              return;
            }
            if (!rawGoogleId || !autorNombre) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Iniciá sesión con Google para comentar" }));
              return;
            }

            const auth = await verifyGoogleToken(body.token, rawGoogleId, req);
            if (!auth) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Iniciá sesión con Google para responder." }));
              return;
            }
            const googleId = auth.googleId;

            // VULN-15: Limitar tamaño de avatar
            if (autorAvatar && autorAvatar.length > 300000) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "El avatar supera el tamaño máximo permitido (300KB)" }));
              return;
            }

            // Rate-limiting de comentarios: máximo 1 comentario cada 5s por usuario
            if (!checkCommentRateLimit(googleId)) {
              res.writeHead(429, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Esperá unos segundos entre comentarios. ¡No hagas spam!" }));
              return;
            }

            // Verificar si el usuario está suspendido o baneado
            const sanctionComentario = checkUserSanction(db, googleId);
            if (sanctionComentario && sanctionComentario.bloqueado) {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: sanctionComentario.mensaje, sanction: sanctionComentario }));
              return;
            }

            // Validar que el hilo exista y no esté oculto ni en revisión
            const hiloExist = db.prepare("SELECT id FROM hilos WHERE id = ? AND oculto = 0 AND (en_revision = 0 OR en_revision IS NULL)").get(hiloId);
            if (!hiloExist) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "El debate no existe o fue eliminado" }));
              return;
            }

            const parentId = body.parentId ? parseInt(body.parentId, 10) : null;

            db.prepare(`
              INSERT INTO comentarios (hilo_id, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, parent_id)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(hiloId, contenido, googleId, autorNombre, autorAvatar, colegioId, parentId);

            db.prepare("UPDATE hilos SET respuestas_count = respuestas_count + 1 WHERE id = ?").run(hiloId);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok", message: "Respuesta enviada!" }));
            return;
          }

          if (action === "votar") {
            const tipo = body.tipo === "comentario" ? "comentario" : "hilo";
            const itemId = parseInt(body.itemId || body.id || 0, 10);
            const rawGoogleId = String(body.googleId || "").trim();

            if (itemId <= 0) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Parámetros inválidos" }));
              return;
            }

            if (!rawGoogleId) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Debés identificarte para votar." }));
              return;
            }

            const auth = await verifyGoogleToken(body.token, rawGoogleId, req);
            if (!auth) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Debés identificarte para votar." }));
              return;
            }
            const googleId = auth.googleId;

            const check = db.prepare("SELECT 1 FROM votos WHERE item_tipo = ? AND item_id = ? AND google_id = ?").get(tipo, itemId, googleId);
            const table = tipo === "hilo" ? "hilos" : "comentarios";
            let voted = false;

            if (check) {
              db.prepare("DELETE FROM votos WHERE item_tipo = ? AND item_id = ? AND google_id = ?").run(tipo, itemId, googleId);
              db.prepare(`UPDATE ${table} SET votos = MAX(0, votos - 1) WHERE id = ?`).run(itemId);
              voted = false;
            } else {
              // VULN-26: Voto idempotente
              try {
                db.prepare("INSERT INTO votos (item_tipo, item_id, google_id) VALUES (?, ?, ?)").run(tipo, itemId, googleId);
                db.prepare(`UPDATE ${table} SET votos = votos + 1 WHERE id = ?`).run(itemId);
                voted = true;
              } catch (e) {
                voted = true;
              }
            }

            const row = db.prepare(`SELECT votos FROM ${table} WHERE id = ?`).get(itemId);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok", voted, votos: row ? row.votos : 0 }));
            return;
          }

          if (action === "reportar") {
            const tipo = body.tipo === "comentario" ? "comentario" : "hilo";
            const itemId = parseInt(body.itemId || body.id || 0, 10);
            const rawReporterId = String(body.googleId || "").trim();
            const motivo = escapeHtml(String(body.motivo || "").trim().slice(0, 200));

            if (itemId <= 0) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Item inválido" }));
              return;
            }

            if (!rawReporterId) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Debés identificarte para reportar contenido." }));
              return;
            }

            const auth = await verifyGoogleToken(body.token, rawReporterId, req);
            if (!auth) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Debés identificarte para reportar contenido." }));
              return;
            }
            const reporterGoogleId = auth.googleId;

            const table = tipo === "hilo" ? "hilos" : "comentarios";
            const item = db.prepare(`SELECT id, autor_google_id FROM ${table} WHERE id = ?`).get(itemId);
            if (!item) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "Publicación no encontrada" }));
              return;
            }

            if (item.autor_google_id === reporterGoogleId) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "error", message: "No podés reportar tu propia publicación." }));
              return;
            }

            // Validar si este usuario ya reportó previamente este ítem
            const alreadyReported = db.prepare("SELECT 1 FROM reportes WHERE item_tipo = ? AND item_id = ? AND reporter_google_id = ?").get(tipo, itemId, reporterGoogleId);
            if (alreadyReported) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "ok", message: "Ya registraste un reporte para esta publicación previamente.", alreadyReported: true }));
              return;
            }

            // Insertar reporte en tabla segura
            db.prepare("INSERT INTO reportes (item_tipo, item_id, reporter_google_id, motivo) VALUES (?, ?, ?, ?)").run(tipo, itemId, reporterGoogleId, motivo);

            // Contar total de reportes de usuarios únicos
            const countRepRow = db.prepare("SELECT COUNT(DISTINCT reporter_google_id) as count FROM reportes WHERE item_tipo = ? AND item_id = ?").get(tipo, itemId);
            const totalRep = countRepRow ? countRepRow.count : 1;

            db.prepare(`UPDATE ${table} SET reportes = ? WHERE id = ?`).run(totalRep, itemId);
            if (totalRep >= 3) {
              // VULN-08: Moderación preventiva marca en_revision = 1 sin ocultar permanentemente (oculto = 1 reservado para admin)
              db.prepare(`UPDATE ${table} SET en_revision = 1 WHERE id = ?`).run(itemId);
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok", message: "Reporte registrado. Nuestro equipo lo revisará.", reportes: totalRep }));
            return;
          }

          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", message: "Acción POST no reconocida" }));
        } catch (err) {
          console.error("Error en /api/foro POST:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", message: "Error interno del servidor" }));
        }
      });
      return;
    }
  }

  // Endpoint API Administración Segura (Login, Noticias, Moderación)
  if (pathname === "/api/admin" || pathname === "/api/admin.php") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    if (isSecretsInvalid) {
      res.writeHead(500);
      res.end(JSON.stringify({ status: "error", message: "Configuración crítica de seguridad inválida o insegura" }));
      return;
    }

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
        const hilosReportados = db.prepare("SELECT * FROM hilos WHERE reportes > 0 OR en_revision = 1 ORDER BY reportes DESC").all();
        const comentariosReportados = db.prepare("SELECT * FROM comentarios WHERE reportes > 0 OR en_revision = 1 ORDER BY reportes DESC").all();
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
      let totalBytes = 0;
      let payloadTooLarge = false;
      const MAX_PAYLOAD = 2 * 1024 * 1024;

      req.on("data", chunk => {
        if (payloadTooLarge) return;
        totalBytes += chunk.length;
        if (totalBytes > MAX_PAYLOAD) {
          payloadTooLarge = true;
          res.writeHead(413, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", message: "Payload demasiado grande" }));
          req.destroy();
          return;
        }
        bodyStr += chunk;
      });

      req.on("end", () => {
        if (payloadTooLarge) return;
        try {
          const body = JSON.parse(bodyStr || "{}");

          // Login de Administrador
          if (action === "login") {
            const clientIp = (req.headers["x-forwarded-for"] ? String(req.headers["x-forwarded-for"]).split(",")[0].trim() : (req.socket.remoteAddress || "unknown"));
            const now = Math.floor(Date.now() / 1000);

            const rlRow = db.prepare("SELECT intentos, bloqueado_hasta, ultimo_intento FROM admin_login_rate_limit WHERE ip = ?").get(clientIp);
            if (rlRow) {
              if (Number(rlRow.bloqueado_hasta) > now) {
                res.writeHead(429);
                res.end(JSON.stringify({ status: "error", message: "Demasiados intentos fallidos. Bloqueado temporalmente por 15 minutos." }));
                return;
              }
              if (Number(rlRow.ultimo_intento) + (15 * 60) < now && Number(rlRow.bloqueado_hasta) <= now) {
                db.prepare("UPDATE admin_login_rate_limit SET intentos = 0, bloqueado_hasta = 0 WHERE ip = ?").run(clientIp);
                rlRow.intentos = 0;
              }
            }

            const usuario = String(body.usuario || "").trim();
            const password = String(body.password || "");

            if (!usuario || !password) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "Usuario y contraseña requeridos" }));
              return;
            }

            const row = db.prepare("SELECT * FROM administradores WHERE usuario = ?").get(usuario);
            let loginOk = false;
            let needsRehash = false;

            if (row) {
              const hash600k = crypto.pbkdf2Sync(password, row.salt, 600000, 32, "sha256").toString("hex");
              const bufHash = Buffer.from(hash600k);
              const bufExpected = Buffer.from(row.password_hash);
              if (bufHash.length === bufExpected.length && crypto.timingSafeEqual(bufHash, bufExpected)) {
                loginOk = true;
              } else {
                const hash10k = crypto.pbkdf2Sync(password, row.salt, 10000, 32, "sha256").toString("hex");
                const bufHash10k = Buffer.from(hash10k);
                if (bufHash10k.length === bufExpected.length && crypto.timingSafeEqual(bufHash10k, bufExpected)) {
                  loginOk = true;
                  needsRehash = true;
                }
              }
            }

            if (!loginOk) {
              const currentAttempts = rlRow ? (Number(rlRow.intentos) + 1) : 1;
              const blockedUntil = (currentAttempts >= 5) ? (now + 15 * 60) : 0;
              db.prepare(`
                INSERT INTO admin_login_rate_limit (ip, intentos, bloqueado_hasta, ultimo_intento)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(ip) DO UPDATE SET intentos = ?, bloqueado_hasta = ?, ultimo_intento = ?
              `).run(clientIp, currentAttempts, blockedUntil, now, currentAttempts, blockedUntil, now);

              res.writeHead(401);
              res.end(JSON.stringify({ status: "error", message: "Credenciales inválidas" }));
              return;
            }

            db.prepare("DELETE FROM admin_login_rate_limit WHERE ip = ?").run(clientIp);

            if (needsRehash) {
              const newSalt = crypto.randomBytes(16).toString("hex");
              const newHash = crypto.pbkdf2Sync(password, newSalt, 600000, 32, "sha256").toString("hex");
              db.prepare("UPDATE administradores SET password_hash = ?, salt = ?, ultimo_login = CURRENT_TIMESTAMP WHERE id = ?").run(newHash, newSalt, row.id);
              row.salt = newSalt;
              row.password_hash = newHash;
            } else {
              db.prepare("UPDATE administradores SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?").run(row.id);
            }

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

            const hash600k = crypto.pbkdf2Sync(passwordActual, row.salt, 600000, 32, "sha256").toString("hex");
            const bufHash = Buffer.from(hash600k);
            const bufExpected = Buffer.from(row.password_hash);
            let currValid = bufHash.length === bufExpected.length && crypto.timingSafeEqual(bufHash, bufExpected);
            if (!currValid) {
              const hash10k = crypto.pbkdf2Sync(passwordActual, row.salt, 10000, 32, "sha256").toString("hex");
              const bufHash10k = Buffer.from(hash10k);
              currValid = bufHash10k.length === bufExpected.length && crypto.timingSafeEqual(bufHash10k, bufExpected);
            }

            if (!currValid) {
              res.writeHead(401);
              res.end(JSON.stringify({ status: "error", message: "La contraseña actual es incorrecta" }));
              return;
            }

            const newSalt = crypto.randomBytes(16).toString("hex");
            const newHash = crypto.pbkdf2Sync(passwordNueva, newSalt, 600000, 32, "sha256").toString("hex");
            db.prepare("UPDATE administradores SET password_hash = ?, salt = ? WHERE id = ?").run(newHash, newSalt, admin.id);

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Contraseña actualizada exitosamente" }));
            return;
          }

          // Crear Noticia
          if (action === "crear_noticia") {
            const titulo = escapeHtml(String(body.titulo || "").trim());
            const categoria = escapeHtml(String(body.categoria || "Noches de Calle").trim());
            const categoriaSlug = String(body.categoriaSlug || "noches-de-calle").trim();
            const badge = escapeHtml(String(body.badge || "NOTICIA").trim().toUpperCase());
            const resumen = escapeHtml(String(body.resumen || "").trim());
            const autor = escapeHtml(String(body.autor || "Redacción Oficial").trim());
            const tiempoLectura = escapeHtml(String(body.tiempoLectura || "3 min de lectura").trim());
            const tags = Array.isArray(body.tags) ? body.tags : (typeof body.tags === "string" ? body.tags.split(",").map(t=>t.trim()).filter(Boolean) : []);

            let bloques = Array.isArray(body.bloques) ? body.bloques : null;
            if (bloques) {
              bloques = bloques.map(b => {
                if (b && typeof b === "object") {
                  const cleaned = { ...b };
                  if (typeof cleaned.value === "string") {
                    cleaned.value = escapeHtml(cleaned.value);
                  }
                  if (typeof cleaned.caption === "string") {
                    cleaned.caption = escapeHtml(cleaned.caption);
                  }
                  return cleaned;
                }
                return b;
              });
            }

            let contenido = body.contenido;
            if (bloques && bloques.length > 0) {
              contenido = bloques.filter(b => b && b.type === "text" && b.value).map(b => b.value);
              if (contenido.length === 0) contenido = [resumen];
            } else {
              if (typeof contenido === "string") {
                contenido = contenido.split("\n\n").map(p => p.trim()).filter(Boolean);
              }
              if (!Array.isArray(contenido) || contenido.length === 0) {
                contenido = [resumen];
              }
              contenido = contenido.map(p => escapeHtml(String(p)));
              bloques = contenido.map(p => ({ type: "text", value: p }));
            }

            if (!titulo || !resumen) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "Título y resumen son requeridos" }));
              return;
            }

            const id = "noticia-" + crypto.randomBytes(8).toString("hex");
            const fecha = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

            const imagenUrl = String(body.imagen || body.imagenUrl || "").trim();
            const fijada = body.fijada ? 1 : 0;

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
            const titulo = escapeHtml(String(body.titulo || "").trim());
            const categoria = escapeHtml(String(body.categoria || "Noches de Calle").trim());
            const categoriaSlug = String(body.categoriaSlug || "noches-de-calle").trim();
            const badge = escapeHtml(String(body.badge || "NOTICIA").trim().toUpperCase());
            const resumen = escapeHtml(String(body.resumen || "").trim());
            const autor = escapeHtml(String(body.autor || "Redacción Oficial").trim());
            const tiempoLectura = escapeHtml(String(body.tiempoLectura || "3 min de lectura").trim());
            const imagenUrl = String(body.imagen || body.imagenUrl || "").trim();
            const fijada = body.fijada ? 1 : 0;
            const tags = Array.isArray(body.tags) ? body.tags : (typeof body.tags === "string" ? body.tags.split(",").map(t=>t.trim()).filter(Boolean) : []);

            let bloques = Array.isArray(body.bloques) ? body.bloques : null;
            if (bloques) {
              bloques = bloques.map(b => {
                if (b && typeof b === "object") {
                  const cleaned = { ...b };
                  if (typeof cleaned.value === "string") {
                    cleaned.value = escapeHtml(cleaned.value);
                  }
                  if (typeof cleaned.caption === "string") {
                    cleaned.caption = escapeHtml(cleaned.caption);
                  }
                  return cleaned;
                }
                return b;
              });
            }

            let contenido = body.contenido;
            if (bloques && bloques.length > 0) {
              contenido = bloques.filter(b => b && b.type === "text" && b.value).map(b => b.value);
              if (contenido.length === 0) contenido = [resumen];
            } else {
              if (typeof contenido === "string") {
                contenido = contenido.split("\n\n").map(p => p.trim()).filter(Boolean);
              }
              if (!Array.isArray(contenido) || contenido.length === 0) contenido = [resumen];
              contenido = contenido.map(p => escapeHtml(String(p)));
              bloques = contenido.map(p => ({ type: "text", value: p }));
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

            db.exec("BEGIN IMMEDIATE");
            try {
              db.prepare("DELETE FROM votos WHERE item_tipo = 'comentario' AND item_id IN (SELECT id FROM comentarios WHERE hilo_id = ?)").run(hiloId);
              db.prepare("DELETE FROM reportes WHERE item_tipo = 'comentario' AND item_id IN (SELECT id FROM comentarios WHERE hilo_id = ?)").run(hiloId);
              db.prepare("DELETE FROM reportes WHERE item_tipo = 'hilo' AND item_id = ?").run(hiloId);
              db.prepare("DELETE FROM comentarios WHERE hilo_id = ?").run(hiloId);
              db.prepare("DELETE FROM votos WHERE item_tipo = 'hilo' AND item_id = ?").run(hiloId);
              db.prepare("DELETE FROM hilos WHERE id = ?").run(hiloId);
              db.exec("COMMIT");
            } catch (e) {
              try { db.exec("ROLLBACK"); } catch (_) {}
              throw e;
            }

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

            db.exec("BEGIN IMMEDIATE");
            try {
              const c = db.prepare("SELECT hilo_id FROM comentarios WHERE id = ?").get(comentarioId);
              if (c) {
                db.prepare("DELETE FROM votos WHERE item_tipo = 'comentario' AND item_id = ?").run(comentarioId);
                db.prepare("DELETE FROM reportes WHERE item_tipo = 'comentario' AND item_id = ?").run(comentarioId);
                db.prepare("DELETE FROM comentarios WHERE id = ?").run(comentarioId);
                db.prepare("UPDATE hilos SET respuestas_count = MAX(0, respuestas_count - 1) WHERE id = ?").run(c.hilo_id);
              }
              db.exec("COMMIT");
            } catch (e) {
              try { db.exec("ROLLBACK"); } catch (_) {}
              throw e;
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
            const tipo = String(body.tipo || "hilo") === "comentario" ? "comentario" : "hilo";
            const id = parseInt(body.id || "0", 10);
            const resolucion = String(body.accion || body.resolucion || "descartar").toLowerCase();

            if (resolucion === "descartar" || resolucion === "aprobar") {
              if (tipo === "hilo") {
                db.prepare("UPDATE hilos SET reportes = 0, oculto = 0, en_revision = 0 WHERE id = ?").run(id);
              } else {
                db.prepare("UPDATE comentarios SET reportes = 0, oculto = 0, en_revision = 0 WHERE id = ?").run(id);
              }
              db.prepare("DELETE FROM reportes WHERE item_tipo = ? AND item_id = ?").run(tipo, id);
              res.writeHead(200);
              res.end(JSON.stringify({ status: "ok", message: "Denuncias descartadas. Contenido aprobado." }));
              return;
            }

            if (resolucion === "eliminar" || resolucion === "borrar") {
              db.exec("BEGIN IMMEDIATE");
              try {
                if (tipo === "hilo") {
                  db.prepare("DELETE FROM votos WHERE item_tipo = 'comentario' AND item_id IN (SELECT id FROM comentarios WHERE hilo_id = ?)").run(id);
                  db.prepare("DELETE FROM reportes WHERE item_tipo = 'comentario' AND item_id IN (SELECT id FROM comentarios WHERE hilo_id = ?)").run(id);
                  db.prepare("DELETE FROM reportes WHERE item_tipo = 'hilo' AND item_id = ?").run(id);
                  db.prepare("DELETE FROM comentarios WHERE hilo_id = ?").run(id);
                  db.prepare("DELETE FROM votos WHERE item_tipo = 'hilo' AND item_id = ?").run(id);
                  db.prepare("DELETE FROM hilos WHERE id = ?").run(id);
                } else {
                  const c = db.prepare("SELECT hilo_id FROM comentarios WHERE id = ?").get(id);
                  if (c) {
                    db.prepare("DELETE FROM votos WHERE item_tipo = 'comentario' AND item_id = ?").run(id);
                    db.prepare("DELETE FROM reportes WHERE item_tipo = 'comentario' AND item_id = ?").run(id);
                    db.prepare("DELETE FROM comentarios WHERE id = ?").run(id);
                    db.prepare("UPDATE hilos SET respuestas_count = MAX(0, respuestas_count - 1) WHERE id = ?").run(c.hilo_id);
                  }
                }
                db.exec("COMMIT");
              } catch (e) {
                try { db.exec("ROLLBACK"); } catch (_) {}
                throw e;
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
            guardarComunidad(cur);

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
            guardarComunidad(cur);

            res.writeHead(200);
            res.end(JSON.stringify({ status: "ok", message: "Guía guardada con éxito", faq }));
            return;
          }

          // Guardar Ajustes Generales del Sitio
          if (action === "guardar_ajustes") {
            const rawAjustes = body.ajustes !== undefined ? body.ajustes : body;
            if (!rawAjustes || typeof rawAjustes !== "object" || Array.isArray(rawAjustes)) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: "error", message: "El campo ajustes debe ser un objeto válido" }));
              return;
            }
            const ajustes = rawAjustes;
            const comunidadFile = path.join(__dirname, "data", "comunidad.json");
            let cur = { noticias: [], cronograma: [], guia: [], faq: [], ajustes: {} };
            if (fs.existsSync(comunidadFile)) {
              try { cur = JSON.parse(fs.readFileSync(comunidadFile, "utf-8")); } catch(e){}
            }
            cur.ajustes = Object.assign({}, cur.ajustes || {}, ajustes);
            guardarComunidad(cur);

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

  // VULN-06 & VULN-14: Protección de carpeta /data/, archivos estáticos, prevención de path traversal y bloqueo de extensiones sensibles / dotfiles
  if (req.url.includes("..") || req.url.includes("%2e%2e") || req.url.includes("%2E%2E")) {
    res.writeHead(403);
    res.end("Acceso denegado");
    return;
  }

  let decodedPath = "";
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch (e) {
    res.writeHead(400);
    res.end("Bad Request");
    return;
  }

  if (decodedPath.includes("..")) {
    res.writeHead(403);
    res.end("Acceso denegado");
    return;
  }

  const safeRelative = path.normalize(decodedPath);

  let relativePath = safeRelative === "/" || safeRelative === "\\" || safeRelative === ""
    ? "index.html"
    : (safeRelative === "/comunidad" || safeRelative === "\\comunidad" || safeRelative === "comunidad"
        ? "comunidad.html"
        : (safeRelative === "/simulador" || safeRelative === "\\simulador" || safeRelative === "simulador"
            ? "simulador.html"
            : (safeRelative === "/noticia" || safeRelative === "\\noticia" || safeRelative === "noticia"
                ? "noticia.html"
                : (safeRelative === "/foro" || safeRelative === "\\foro" || safeRelative === "foro"
                    ? "foro.html"
                    : safeRelative.replace(/^[\\\/]+/, "")))));

  const filePath = path.resolve(__dirname, relativePath);

  // Prevenir Path Traversal fuera del directorio raíz
  if (!filePath.startsWith(__dirname + path.sep) && filePath !== __dirname) {
    res.writeHead(403);
    res.end("Acceso denegado");
    return;
  }

  const SENSITIVE_EXTENSIONS = new Set([".db", ".sql", ".log", ".env", ".sqlite", ".sqlite3", ".bak", ".sh"]);
  const ext = path.extname(filePath).toLowerCase();
  const segments = relativePath.split(/[\\\/]/);
  const hasDotfile = segments.some(seg => seg.startsWith(".") && seg !== "." && seg !== "..");

  if (
    hasDotfile ||
    SENSITIVE_EXTENSIONS.has(ext) ||
    pathname.startsWith("/data/") ||
    relativePath.startsWith("data" + path.sep) ||
    relativePath.startsWith("data/") ||
    relativePath === "data"
  ) {
    res.writeHead(403);
    res.end("Acceso denegado");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    const etag = `W/"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
    if (req.headers["if-none-match"] === etag) {
      res.writeHead(304, {
        "ETag": etag,
        "Cache-Control": "public, max-age=3600"
      });
      res.end();
      return;
    }

    const headers = {
      "Content-Type": contentType,
      "ETag": etag,
      "Cache-Control": "public, max-age=3600"
    };

    const isCompressible = /^(text\/|application\/(javascript|json)|image\/svg\+xml)/.test(contentType);
    const acceptEncoding = req.headers["accept-encoding"] || "";

    if (isCompressible && acceptEncoding.includes("gzip") && stats.size > 1024) {
      headers["Content-Encoding"] = "gzip";
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else {
      headers["Content-Length"] = stats.size;
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
    return;
  }

  // SPA Fallback a index.html
  const indexPath = path.join(__dirname, "index.html");
  if (fs.existsSync(indexPath)) {
    const stats = fs.statSync(indexPath);
    const etag = `W/"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
    if (req.headers["if-none-match"] === etag) {
      res.writeHead(304, { "ETag": etag, "Cache-Control": "public, max-age=300" });
      res.end();
      return;
    }
    const headers = { "Content-Type": "text/html; charset=utf-8", "ETag": etag, "Cache-Control": "public, max-age=300" };
    const acceptEncoding = req.headers["accept-encoding"] || "";
    if (acceptEncoding.includes("gzip") && stats.size > 1024) {
      headers["Content-Encoding"] = "gzip";
      res.writeHead(200, headers);
      fs.createReadStream(indexPath).pipe(zlib.createGzip()).pipe(res);
    } else {
      headers["Content-Length"] = stats.size;
      res.writeHead(200, headers);
      fs.createReadStream(indexPath).pipe(res);
    }
  } else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
});

if (typeof PORT === "string" && isNaN(PORT)) {
  server.listen(PORT, () => {
    console.log(`🥁 Servidor Estudiantina Online activo en socket ${PORT}`);
  });
} else {
  const numericPort = parseInt(PORT, 10) || 3000;
  server.listen(numericPort, "0.0.0.0", () => {
    console.log(`🥁 Servidor Estudiantina Online activo en http://0.0.0.0:${numericPort}`);
  });
}
