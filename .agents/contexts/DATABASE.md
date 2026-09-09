# Database Context — Estudiantina.online

## Database Engine & Config
- **Engine**: SQLite 3
- **Database File**: `data/foro.db`
- **Storage Mode**: Write-Ahead Logging (`PRAGMA journal_mode = WAL;`) para permitir lecturas concurrentes sin bloquear escrituras durante las noches de calle.

## Relational Schema (SQLite)
1. `usuarios`: `google_id` (PK), `nombre`, `email`, `avatar_url`, `colegio_id`, `rol`, `creado_en`.
2. `administradores`: `id` (PK), `usuario` (UNIQUE), `password_hash`, `salt`, `rol`, `creado_en`, `ultimo_login`.
3. `noticias`: `id` (PK), `titulo`, `categoria`, `categoria_slug`, `fecha`, `autor`, `tiempo_lectura`, `badge`, `resumen`, `contenido`, `bloques`, `tags`, `imagen_url`, `fijada`, `creada_en`.
4. `canales`: `id` (PK), `titulo`, `descripcion`, `icono`, `color`.
5. `hilos`: `id` (PK), `canal_id`, `titulo`, `contenido`, `autor_google_id`, `autor_nombre`, `autor_avatar`, `colegio_id`, `votos`, `respuestas_count`, `fijado`, `reportes`, `oculto`, `creado_en`.
6. `comentarios`: `id` (PK), `hilo_id`, `contenido`, `autor_google_id`, `autor_nombre`, `autor_avatar`, `colegio_id`, `votos`, `reportes`, `oculto`, `creado_en`.
7. `votos_hilos` & `votos_comentarios`: Registro de upvotes únicos por usuario para evitar duplicación de votos.

## Flat JSON Storage
- `data/ranking.json`: Almacena el array de fichas de egresados con sus atributos finales, copas y colegio para conformar el Salón de la Fama.
- `data/comunidad.json`: Almacenamiento complementario de noticias y artículos del portal.

## Backup & Safety Rules
- Archivos semilla versionados: `data/ranking.example.json` y `data/comunidad.example.json`.
- Prohibición de commits de `data/foro.db` en el repositorio git (declarado en `.gitignore`).
