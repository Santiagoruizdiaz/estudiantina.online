# Git Policy
Inspect diffs. Keep changes focused. Do not force-push, destructive-reset, or commit secrets.

## Aplicación

- **Inspeccionar el diff** completo antes de cualquier commit o cierre.
- **Cambios enfocados**: un propósito por commit/cambio; no mezclar refactor, funcionalidad y correcciones.
- **Prohibido sin aprobación humana explícita**: `push --force`, `reset --hard` destructivo, reescritura de historial.
- **Secretos**: nunca se versionan. Si se filtró uno: revocar y rotar; borrarlo del historial **no** basta.
- Mensajes de commit descriptivos (qué y por qué).
- Cada agente toca **solo** su alcance; un archivo no lo editan dos agentes a la vez.
