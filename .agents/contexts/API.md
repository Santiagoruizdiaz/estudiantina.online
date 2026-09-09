# API Context — Estudiantina.online

## Core Principles
- **Dual Parity**: Toda ruta disponible en el servidor Node local (`server.js`) debe responder de forma idéntica en los scripts PHP de producción (`api/*.php`).
- **Standard Envelope**: Formato de respuesta JSON consistente:
  - Éxito: `{ "success": true, "data": ... }` o recurso directo según endpoint.
  - Error: `{ "success": false, "error": "Mensaje legible" }`.

## Main Endpoints
### 1. Salón de la Fama / Ranking
- `GET /api/ranking`
  - Devuelve todos los jugadores registrados y agrupaciones calculadas (Top OVR, Top Copas, Colegios Populares).
- `POST /api/ranking`
  - Registra una nueva ficha de egresado completada en el simulador.
  - Valida estructura de jugador (nombre, colegio, rol, rubro, stats, copas).

### 2. Comunidad & Noticias
- `GET /api/comunidad`
  - Devuelve noticias del portal con soporte para filtros por query string (`?categoria=...`, `?slug=...`, `?limit=...`).

### 3. Foro de Debate
- `GET /api/foro`
  - Devuelve lista de canales, hilos por canal o comentarios de un hilo específico (`?canal=...`, `?hilo=...`).
- `POST /api/foro`
  - Acciones: `crear_hilo`, `crear_comentario`, `votar_hilo`, `votar_comentario`, `reportar`. Requiere datos de autor autenticado.

### 4. Administración
- `POST /api/admin`
  - Acciones: `login`, `crear_noticia`, `editar_noticia`, `eliminar_noticia`, `moderar_foro`, `stats`.
  - Requiere token Bearer o secreto administrativo válido.
