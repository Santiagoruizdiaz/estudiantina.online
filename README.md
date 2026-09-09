# 🥁 Estudiantina de Posadas — Portal Oficial

> Plataforma web completa para la Estudiantina de Posadas (Misiones, Argentina):  
> **simulador de carrera**, **portal de noticias**, **foro de comunidad** y **salón de la fama**.

---

## 📋 ¿Qué es esto?

La [Estudiantina de Posadas](https://estudiantina.online) es el desfile juvenil más importante de Misiones. Este proyecto es su portal web oficial, con dos secciones principales:

| Sección | URL | Descripción |
|---|---|---|
| 🎮 Simulador | `/` → `index.html` | Juego de carrera escolar estilo Copero |
| 📰 Comunidad | `/comunidad` → `comunidad.html` | Noticias, foro y cronograma |

---

## 🗂️ Estructura del Proyecto

```
estudiantina/
│
├── 📄 index.html           # Simulador de Carrera (SPA principal)
├── 📄 comunidad.html       # Portal de Comunidad & Noticias
├── 📄 noticia.html         # Página de lectura de noticia individual
│
├── 🎨 styles.css           # Estilos del Simulador (6300+ líneas, Dark Minimal)
│
├── 📁 css/
│   ├── comunidad.css       # Estilos del Portal de Comunidad (5600+ líneas)
│   └── noticia.css         # Estilos de la página de noticia
│
├── 📁 js/
│   ├── app.js              # Núcleo del simulador (pantallas, flujo, UI)
│   ├── simulador.js        # Motor de simulación de carrera escolar
│   ├── eventos.js          # Banco de eventos de Banda de Música
│   ├── eventos_baile.js    # Banco de eventos de Cuerpo de Baile
│   ├── colegios.js         # Datos de los 30+ colegios participantes
│   ├── roles.js            # Definición de roles (Director, Percusionista, etc.)
│   ├── ranking.js          # Lógica del Salón de la Fama y Rankings
│   ├── comunidad.js        # Portal de noticias, foro y admin (frontend)
│   └── noticia.js          # Lector de artículo individual
│
├── 📁 api/
│   ├── ranking.php         # API REST: jugadores y ranking (Hostinger)
│   ├── comunidad.php       # API REST: noticias y metadatos
│   ├── foro.php            # API REST: foro de debate (SQLite)
│   └── admin.php           # API REST: panel de administración (token-based)
│
├── 📁 data/
│   ├── comunidad.example.json   # Estructura de noticias (ejemplo)
│   ├── ranking.example.json     # Estructura de jugadores (ejemplo)
│   └── foro.db             # Base de datos SQLite (excluida del repo)
│
├── 📁 assets/
│   └── iannavajas.png      # Logo del patrocinador oficial
│
├── 🔧 server.js            # Servidor de desarrollo local (Node.js nativo)
├── 🔧 .htaccess            # Configuración Apache/LiteSpeed para Hostinger
├── 📦 package.json         # Scripts npm
├── 🌐 robots.txt           # Directivas SEO
├── 🗺️ sitemap.xml          # Mapa del sitio para Google
└── 📱 site.webmanifest     # PWA manifest
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

> El servidor (`server.js`) sirve todos los archivos estáticos Y actúa como API mock
> idéntica a la API PHP de producción en Hostinger. No se necesita instalar nada más.

### Variables de Entorno (Opcionales)

```bash
PORT=3000                    # Puerto del servidor (default: 3000)
ADMIN_SECRET=tu_clave_aqui   # Clave para el panel de administración
```

---

## 🎮 Cómo Funciona el Simulador

El simulador es una **Single Page Application (SPA)** completamente en vanilla HTML/CSS/JS con 4 pantallas:

```
Pantalla 1 → Pantalla 2 → Pantalla 3 → Pantalla 4
  Intro        Identidad    Carrera     Ficha Egresado
  (Hero)       (Colegio,    (5 años     (Card coleccionable
               Rol, Rubro)  de eventos) + Rankings)
```

### Pantalla 1 — Intro
- Selección de modo: **Banda de Música** o **Cuerpo de Baile**
- Acceso al Salón de la Fama (rankings históricos)

### Pantalla 2 — Identidad
- Elegir **colegio** (30+ instituciones posadeñas con datos reales)
- Elegir **rol** (Director, Percusionista, Trompetista, Bailarina, etc.)
- Elegir **rubro** (Banda, Baile, ambos)

### Pantalla 3 — Simulador de Carrera
- **5 temporadas** de decisiones narrativas (estilo Copero/FIFA)
- Cada decisión afecta atributos: OVR, COOP, RITM, DISC, etc.
- Sistema de **transferencias** entre colegios
- **Leaderboard** en tiempo real del colegio
- Tabla histórica de estadísticas por año

### Pantalla 4 — Ficha de Egresado
- **Card coleccionable** estilo FIFA con el perfil del jugador
- Sistema de **logros** desbloqueables
- Opción de **descargar la ficha como imagen** (html2canvas)
- Acceso a **Rankings**: Top OVR, Top Copas, Colegios más populares

---

## 📰 Portal de Comunidad

El portal (`comunidad.html`) es un **sitio de noticias tipo periódico deportivo** con:

| Sección | Descripción |
|---|---|
| 📰 Noticias | Hero article + grid de cards con imágenes |
| 📅 Cronograma | Fechas de la temporada 2026 |
| 💬 Foro | Sistema de debate con login Google OAuth |
| ❓ FAQ | Guía del espectador |

### Sistema de Noticias
- Las noticias se cargan desde `api/comunidad.php` (producción) o `data/comunidad.json` (local)
- Soporte para imágenes, categorías, tags, tiempo de lectura y bloques de contenido
- **Panel de admin** protegido por token para crear/editar/borrar noticias

### Foro de Debate
- Login con **Google OAuth** (sin Firebase, usando `accounts.google.com/gsi/client`)
- Usuarios guardados en SQLite por `google_id`
- Hilos, respuestas, likes y moderación por admin

---

## 🔌 API Endpoints

El servidor local (`server.js`) y la API PHP de producción exponen los mismos endpoints:

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/ranking` | Obtener todos los jugadores y rankings |
| `POST` | `/api/ranking` | Guardar ficha de egresado |
| `GET` | `/api/comunidad` | Obtener noticias |
| `GET` | `/api/foro` | Obtener hilos del foro |
| `POST` | `/api/foro` | Crear hilo, responder, dar like |
| `POST` | `/api/admin` | Acciones de administrador (token requerido) |

---

## 🌐 Despliegue en Hostinger

El proyecto está configurado para **Hostinger** con Apache/LiteSpeed:

1. **Subir todos los archivos** al `public_html/` via FTP o el panel de Hostinger
2. **Crear los datos** en el servidor:
   ```bash
   cp data/ranking.example.json data/ranking.json
   cp data/comunidad.example.json data/comunidad.json
   ```
3. **Configurar el token de admin** en `api/admin.php`
4. El `.htaccess` ya maneja todo el routing, compresión Gzip y headers de seguridad

> ⚠️ La carpeta `data/` está protegida por `.htaccess` para que nadie acceda directamente a los JSON desde el navegador.

---

## 🎨 Stack Técnico

| Capa | Tecnología |
|---|---|
| Frontend | HTML5 + CSS3 Vanilla + JavaScript ES Modules |
| Tipografía | Google Fonts: Outfit, Inter, Plus Jakarta Sans |
| Estilos | CSS Variables, Grid, Flexbox, Glassmorphism, Dark theme |
| Animaciones | CSS Keyframes y transitions nativas (sin librerías) |
| Backend local | Node.js 22+ nativo (sin dependencias) |
| Backend prod. | PHP 8+ en Hostinger |
| Base de datos | SQLite (foro) + JSON plano (noticias/ranking) |
| Auth | Google OAuth 2.0 (GSI Client Library) |
| Export imagen | html2canvas (CDN) |

---

## 👥 Créditos

- **Patrocinador Oficial**: [Ian Navajas Barbería](https://www.instagram.com/iannavajas_/) — código `estudiantina` para 20% de descuento
- **Datos de colegios**: Instituciones participantes reales de la Estudiantina de Posadas 2026

---

## 📄 Licencia

MIT © 2026 Estudiantina de Posadas

---

<div align="center">
  <strong>estudiantina.online</strong> — Posadas, Misiones, Argentina 🇦🇷
</div>
