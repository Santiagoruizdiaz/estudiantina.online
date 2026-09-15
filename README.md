# 🥁 Estudiantina de Posadas — Portal Oficial

> Plataforma web oficial y ecosistema interactivo de la fiesta estudiantil más representativa de Misiones (Posadas, Argentina):  
> **Simulador de carrera RPG/Copero**, **portal de noticias**, **foro de debate comunitario** y **salón de la fama**.

---

## 📋 ¿Qué es esto?

La [Estudiantina de Posadas](https://estudiantina.online) es el desfile juvenil y fiesta estudiantil más importante de la provincia de Misiones. Este proyecto centraliza su ecosistema digital en cuatro pilares:

| Sección | URL | Descripción |
|---|---|---|
| 🎮 **Simulador** | `/` → `index.html` | Juego de rol y carrera escolar de 5 temporadas (Banda de Música y Cuerpo de Baile). |
| 📰 **Comunidad** | `/comunidad` → `comunidad.html` | Portal de noticias, cobertura en vivo, crónicas y cronograma oficial. |
| 💬 **Foro** | `/foro` → `foro.html` | Espacio de debate con canales temáticos, votos, comentarios y login Google OAuth. |
| 📄 **Noticias** | `/noticia?id=...` → `noticia.html` | Lector de noticias individuales con SEO dinámico y redes sociales. |

---

## 🗂️ Estructura del Proyecto

```
estudiantina/
│
├── 📄 index.html           # Simulador de Carrera (SPA principal)
├── 📄 comunidad.html       # Portal de Noticias & Cobertura
├── 📄 foro.html            # Foro de Debate Estudiantil
├── 📄 noticia.html         # Página de lectura de noticia individual
│
├── 🎨 styles.css           # Estilos del Simulador (Dark Minimal / Neon posadeño)
│
├── 📁 css/
│   ├── comunidad.css       # Estilos del Portal de Noticias y administración
│   ├── foro.css            # Estilos del Foro de Debate y canales
│   └── noticia.css         # Estilos de la página de lectura individual
│
├── 📁 js/
│   ├── app.js              # Núcleo del simulador (pantallas, flujo, UI)
│   ├── simulador.js        # Motor de simulación de carrera escolar
│   ├── eventos.js          # Banco de eventos narrativos de Banda de Música
│   ├── eventos_baile.js    # Banco de eventos narrativos de Cuerpo de Baile
│   ├── colegios.js         # Datos de los 30+ colegios posadeños participantes
│   ├── roles.js            # Roles (Director, Scola, Chancha, Cuerpo de Baile, etc.)
│   ├── ranking.js          # Lógica del Salón de la Fama y Rankings
│   ├── comunidad.js        # Lógica del portal de noticias y administración
│   ├── foro.js             # Lógica del foro: canales, hilos, upvotes, comentarios
│   └── noticia.js          # Lector dinámico de artículos individuales
│
├── 📁 api/
│   ├── ranking.php         # API REST: jugadores, ranking y persistencia (PHP/Hostinger)
│   ├── comunidad.php       # API REST: noticias, cronograma y metadatos
│   ├── foro.php            # API REST: foro de debate (SQLite PDO con WAL)
│   └── admin.php           # API REST: panel de administración y moderación
│
├── 📁 data/
│   ├── comunidad.example.json   # Semilla estructurada de noticias
│   ├── ranking.example.json     # Semilla estructurada de jugadores
│   └── foro.db                  # Base de datos SQLite (excluida del control de versiones)
│
├── 📁 scripts/
│   ├── check-syntax.mjs         # Validador estático de sintaxis JS y JSON
│   ├── test-runner.mjs          # Suite de pruebas automatizadas (Node test runner)
│   └── antigravity-stop-gate.mjs # Verificación de Quality Gates
│
├── 📁 tests/
│   ├── test-api.mjs             # Pruebas de integración de endpoints REST
│   ├── test-foro.mjs            # Pruebas de API y seguridad del foro
│   └── test-simulador.mjs       # Pruebas unitarias de colegios, roles y eventos
│
├── 📁 docs/
│   ├── QUALITY-GATES-CHECKLIST.md # Checklist formal de Quality Gates (G0 a G8)
│   └── ADR/                       # Architectural Decision Records
│
├── 📁 assets/
│   └── iannavajas.png      # Logo del patrocinador oficial
│
├── 🔧 server.js            # Servidor dual-runtime local (Node.js 22+ nativo)
├── 🔧 .htaccess            # Configuración Apache/LiteSpeed para Hostinger
├── 📦 package.json         # Configuración y scripts npm
├── 🌐 robots.txt           # Directivas SEO y crawlers
├── 🗺️ sitemap.xml          # Mapa del sitio optimizado para motores de búsqueda
└── 📱 site.webmanifest     # Web App Manifest PWA
```

---

## 🚀 Cómo Correrlo Localmente

### Requisitos

- **Node.js 22+** (usa `node:sqlite` nativo, sin dependencias externas)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/santiagoruizdiaz/estudiantina.online.git
cd estudiantina.online

# 2. Crear los archivos de datos desde los ejemplos
cp data/ranking.example.json data/ranking.json
cp data/comunidad.example.json data/comunidad.json

# 3. Iniciar el servidor de desarrollo
npm start
# → Servidor corriendo en http://localhost:3000
```

> El servidor (`server.js`) sirve todos los archivos estáticos y reproduce con paridad exacta
> las respuestas y lógica de la API PHP de producción en Hostinger, incluyendo persistencia en SQLite.

### Scripts Disponibles

```bash
npm start              # Inicia el servidor local de desarrollo
npm test               # Ejecuta la suite completa de pruebas automatizadas
npm run check          # Chequeo estático de sintaxis (JS y JSON)
npm run quality-gate   # Ejecución del Quality Gate formal
```

### Variables de Entorno (Opcionales)

```bash
PORT=3000                    # Puerto del servidor (default: 3000)
ADMIN_SECRET=tu_clave_aqui   # Clave secreta para el panel de administración
```

---

## 🎮 Cómo Funciona el Simulador

El simulador es una experiencia SPA modular e interactiva con 4 fases:

```
Pantalla 1 → Pantalla 2 → Pantalla 3 → Pantalla 4
  Intro        Identidad    Carrera     Ficha Egresado
  (Hero)       (Colegio,    (5 años     (Card coleccionable
               Rol, Rubro)  de eventos) + Rankings)
```

1. **Intro**: Selección de rubro (**Banda de Música** o **Cuerpo de Baile**) y acceso al Salón de la Fama.
2. **Identidad**: Elección de colegio entre más de 30 instituciones posadeñas reales y selección de rol específico.
3. **Carrera**: 5 temporadas escolares con eventos narrativos interactivos donde cada decisión balancea atributos (`OVR`, `RITM`, `COOP`, `DISC`), opciones de transferencias y cálculo de copas.
4. **Ficha de Egresado**: Generación de tarjeta coleccionable estilo FIFA card con opción de descarga como imagen (vía `html2canvas`) y publicación al ranking oficial.

---

## 📰 Portal de Noticias y Cobertura

El portal (`comunidad.html`) ofrece una cobertura periodística completa:

- **Artículos destacados y cronología**: Cobertura de las noches de calle en la Costanera y Noche de Anfiteatro Manuel Antonio Ramírez.
- **Cronograma 2026**: Fechas, pruebas piloto y horarios actualizados.
- **Panel de administración**: Creación, edición y eliminación de noticias protegido mediante token de seguridad.

---

## 💬 Foro de Debate Estudiantil

El foro (`foro.html`) es un espacio temático de intercambio con alta protección y moderación:

- **Canales temáticos**: General & Comunidad, Banda de Música, Cuerpo de Baile, Tribunas & Hinchadas, Sugerencias del Simulador, Noticias & Cobertura y Off Topic.
- **Autenticación**: Google Identity Services (GSI / OAuth 2.0) sin overhead de librerías externas.
- **Interacciones**: Hilos de debate, respuestas, sistema de upvotes comunitarios y reporte de contenido.
- **Seguridad**: Inmunidad contra XSS mediante sanitización estricta (`escapeHtml`) y Prepared Statements en SQLite.

---

## 🔌 API Endpoints (Paridad Node ↔ PHP)

Tanto en desarrollo local (`server.js`) como en producción (`api/*.php`), los contratos son idénticos:

| Método | Endpoint | Acción / Parámetros | Descripción |
|---|---|---|---|
| `GET` | `/api/ranking` | — | Lista de egresados y rankings históricos |
| `POST` | `/api/ranking` | Body JSON | Guardar nueva ficha de egresado |
| `GET` | `/api/comunidad` | — | Listado de noticias y cronograma oficial |
| `GET` | `/api/foro` | `action=canales` | Lista de canales y conteo de hilos |
| `GET` | `/api/foro` | `action=hilos[&canal=...][&q=...]` | Listado paginado de hilos y búsqueda |
| `GET` | `/api/foro` | `action=hilo&id=...` | Detalle de un hilo con sus comentarios |
| `POST` | `/api/foro` | `action=crear_hilo` | Crear nuevo hilo (requiere auth) |
| `POST` | `/api/foro` | `action=comentar` | Responder en un hilo (requiere auth) |
| `POST` | `/api/foro` | `action=votar` | Alternar upvote en hilo o comentario |
| `POST` | `/api/foro` | `action=reportar` | Reportar contenido para moderación |
| `POST` | `/api/admin` | Header `Authorization` | Operaciones administrativas y moderación |

---

## 🌐 Despliegue en Hostinger

El proyecto está optimizado para servidores Apache / LiteSpeed en **Hostinger**:

1. **Subir archivos** al directorio raíz `public_html/`.
2. **Generar archivos de datos iniciales**:
   ```bash
   cp data/ranking.example.json data/ranking.json
   cp data/comunidad.example.json data/comunidad.json
   ```
3. **Permisos de SQLite**: Asegurar permisos de lectura y escritura para el usuario web en `data/` (`data/foro.db` se crea automáticamente con modo WAL).
4. **Protección `.htaccess`**: La carpeta `/data/` se encuentra bloqueada para acceso HTTP directo, garantizando la privacidad de las bases de datos.

---

## 🎨 Stack Técnico

| Capa | Tecnología |
|---|---|
| **Frontend** | HTML5 semántico + CSS3 Vanilla (Custom Properties) + JavaScript ES Modules nativos |
| **Tipografía** | Google Fonts: Outfit, Inter, Plus Jakarta Sans |
| **Diseño** | Dark Minimal con toques Neón Posadeño, Glassmorphism y Mobile-First |
| **Backend Local** | Node.js 22+ nativo con `node:sqlite` (`DatabaseSync`), cero dependencias de build |
| **Backend Prod.** | PHP 8.1+ con PDO SQLite (modo WAL) en Hostinger |
| **Base de Datos** | SQLite (`data/foro.db`) + archivos JSON estructurados con réplica de seguridad |
| **Autenticación** | Google Identity Services (GSI / OAuth 2.0) |
| **Exportación** | `html2canvas` para generación de Fichas de Egresado coleccionables |
| **Calidad y Tests** | Node Test Runner, análisis estático y Quality Gates integrados |

---

## 👥 Créditos y Patrocinio

- **Patrocinador Oficial**: [Ian Navajas Barbería](https://www.instagram.com/iannavajas_/) — Beneficio con código `estudiantina`
- **Comunidad y Colegios**: A todas las instituciones y estudiantes de la Estudiantina de Posadas 2026.

---

## 🔒 Licencia y Propiedad

**Proyecto Privado — Todos los derechos reservados © 2026.**  
Este proyecto y su código fuente son de carácter estrictamente privado y confidencial. Queda prohibida su copia, distribución, modificación o explotación comercial sin el consentimiento explícito de sus propietarios.

---

<div align="center">
  <strong>estudiantina.online</strong> — Posadas, Misiones, Argentina 🇦🇷
</div>
