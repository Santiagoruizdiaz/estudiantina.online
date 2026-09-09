# Architecture Context — Estudiantina.online

## Architectural Style
- **Hybrid Dual-Runtime Monolith**:
  - **Local Development**: Servidor nativo Node.js 22+ (`server.js`) que provee servicio de archivos estáticos y emula con exactitud la API REST mediante `node:sqlite` (`DatabaseSync`) sin dependencias de NPM.
  - **Production Environment**: Servidor Apache / LiteSpeed en Hostinger con PHP 8+ (`api/*.php`), base de datos SQLite (`data/foro.db`) y almacenamiento JSON.
  - **Client-Side SPA / MPA**: Vanilla JavaScript (ES Modules nativos), HTML5 semántico y CSS3 modular (Custom Properties, CSS Grid, Glassmorphism) sin bundlers intermedios.

## Module Boundaries
- **Cliente (Frontend)**:
  - `index.html`, `styles.css`: SPA del Simulador de Carrera (Intro, Identidad, Carrera 5 años, Ficha de Egresado y Rankings).
  - `js/simulador.js`: Motor de cálculo matemático, probabilidades de eventos, progresión de atributos y transiciones de temporada.
  - `js/eventos.js` & `js/eventos_baile.js`: Banco estructurado de eventos narrativos para Banda de Música y Cuerpo de Baile.
  - `js/colegios.js` & `js/roles.js`: Registro maestro de entidades escolares y roles estudiantiles.
  - `js/ranking.js`: Gestor de consultas y renderizado del Salón de la Fama.
  - `comunidad.html`, `css/comunidad.css`, `js/comunidad.js`: Portal de noticias, cronograma y cliente del foro.
  - `noticia.html`, `css/noticia.css`, `js/noticia.js`: Lector de artículos individuales.
- **Servidor y API**:
  - `server.js`: Servidor Node local que implementa el contrato de API completo (`/api/ranking`, `/api/comunidad`, `/api/foro`, `/api/admin`).
  - `api/ranking.php`: Controlador PHP para persistencia y cálculo del Salón de la Fama en producción.
  - `api/comunidad.php`: Controlador PHP para entrega de noticias y metadatos en producción.
  - `api/foro.php`: Controlador PHP con SQLite PDO para gestión de hilos, respuestas y likes en producción.
  - `api/admin.php`: Controlador PHP para autenticación de administradores y acciones CRUD.

## Dual-Runtime Parity Invariant
Cualquier modificación en los endpoints o estructuras de datos en `server.js` debe replicarse exactamente en los archivos de `api/*.php` (y viceversa), asegurando absoluta paridad de contratos entre desarrollo local y producción Hostinger.

## Architectural Decision Records (ADRs)
- **ADR-001**: Arquitectura de doble runtime (Node.js nativo en local / PHP 8+ en Hostinger).
- **ADR-002**: Persistencia híbrida con SQLite en modo WAL para concurrencia y JSON plano para rankings.
- **ADR-003**: Frontend Vanilla ES Modules sin dependencias de compilación para máxima velocidad y portabilidad.
