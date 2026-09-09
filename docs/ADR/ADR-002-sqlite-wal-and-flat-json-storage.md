# ADR-002: Persistencia Híbrida (SQLite con WAL Mode y Almacenamiento JSON Plano)

## Estado
Aceptado

## Contexto
La plataforma maneja dos tipos de datos con patrones de acceso y volúmenes dispares:
1. **Comunidad y Foro**: Hilos, comentarios interactivos, likes y moderación con relaciones relacionales entre usuarios y canales.
2. **Ranking y Salón de la Fama**: Fichas históricas de egresados que requieren consultas analíticas rápidas (Top Overall, Top Copas, Colegios más populares).
3. **Noticias y Cronograma**: Artículos editoriales estables con bajo índice de mutación y alta frecuencia de lectura.

## Decisión
1. **SQLite 3 con WAL Mode (`data/foro.db`)**:
   - Se utiliza SQLite tanto en Node (`node:sqlite` / `DatabaseSync`) como en PHP (`PDO_SQLITE`).
   - Se activa obligatoriamente `PRAGMA journal_mode = WAL;` (Write-Ahead Logging). Esto permite que múltiples conexiones lectoras operen simultáneamente sin bloquearse entre sí ni bloquear las escrituras de comentarios y votos.
2. **JSON Plano Semillado (`data/ranking.json`, `data/comunidad.json`)**:
   - Persistencia directa en formato JSON para el ranking de egresados y artículos de noticias con soporte de fallback.
   - Versionado en el repositorio únicamente de los archivos semilla (`*.example.json`), manteniendo los datos de producción fuera del control de versiones.
3. **Seguridad de Almacenamiento**:
   - Bloqueo estricto del acceso web a `/data/` vía `.htaccess` en Apache y filtro HTTP 403 en Node.

## Consecuencias
- **Positivas**:
  - Excelente rendimiento y mínima huella de memoria en el servidor.
  - Cero costo de bases de datos externas adicionales.
  - Concurrencia de lecturas garantizada durante los picos de las noches de calle de la Estudiantina.
- **Negativas / Mitigaciones**:
  - SQLite requiere permisos de escritura en la carpeta `data/` en el hosting.
  - *Mitigación*: Documentado en las instrucciones de despliegue (`AGENTS.md` y `README.md`) y verificado por el Gate G8.
