# Stack Context — Estudiantina.online

## Core Runtimes & Languages
- **Local Dev Runtime**: Node.js 22+ (utiliza `node:sqlite` / `DatabaseSync` y módulos nativos `http`, `fs`, `path`, `crypto`).
- **Production Runtime**: PHP 8.1+ / 8.2+ con extensiones `pdo_sqlite`, `json`, `mbstring` sobre servidor Apache/LiteSpeed.
- **Client Language**: JavaScript moderno (ES2022+ / ES Modules nativos).

## Frontend & Styling
- **Markup**: HTML5 semántico (`index.html`, `comunidad.html`, `noticia.html`).
- **CSS Architecture**: CSS3 puro con Custom Properties (CSS Variables), Layouts fluidos con CSS Grid y Flexbox, estética Dark Neon / Glassmorphism.
- **Typography**: Google Fonts (`Outfit`, `Inter`, `Plus Jakarta Sans`) cargadas vía preconnect y CDN.
- **Asset Rendering**: `html2canvas` vía CDN para captura de tarjeta de egresado en formato PNG de alta resolución.

## Database & Data Persistence
- **Relational DB**: SQLite 3 en `data/foro.db` configurado con `PRAGMA journal_mode = WAL;`.
- **Flat Files**: `data/ranking.json` y `data/comunidad.json` con archivos semilla versionados (`*.example.json`).

## Security & Auth
- **User Authentication**: Google Identity Services (GSI - OAuth 2.0 Client Library).
- **Admin Authentication**: Token-based authentication validado con clave secreta (`ADMIN_SECRET`) y hashing de contraseñas de admin con PBKDF2/SHA256 con salt.

## Testing & Tooling
- **Test Runner**: `scripts/test-runner.mjs` (ejecuta tests de integración sobre la API y validaciones unitarias del simulador).
- **Syntax & Lint**: `scripts/check-syntax.mjs` (validación estática de sintaxis y chequeo de contratos JSON).
- **Antigravity Hooks**: `scripts/antigravity-safety-gate.mjs` y `scripts/antigravity-stop-gate.mjs`.
