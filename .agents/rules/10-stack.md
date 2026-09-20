# Stack Context
@../contexts/PROJECT.md
@../contexts/STACK.md
@../contexts/ENVIRONMENTS.md

Use repository configuration as the source of truth.

## Regla de verdad (ampliada)

1. **El repositorio manda**: `package.json`, lockfile y configuración prevalecen sobre estos contextos y sobre los prompts de los agentes.
2. Si el repositorio y `STACK.md` difieren, **gana el repositorio** y se propone actualizar el contexto.
3. **No asumas** Next.js, Prisma, PostgreSQL, Auth.js ni un servidor propio: **verifica**. CheckCar declara Vite + React 18 + React Router 7 (un SPA).
4. Un contexto **vacío** es una pregunta abierta, **no** una invitación a rellenarlo. Se escala o se infiere con fuente.
