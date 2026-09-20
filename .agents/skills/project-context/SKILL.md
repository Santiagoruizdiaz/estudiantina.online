---
name: project-context
description: Cómo descubrir el contexto real de un proyecto antes de actuar - detectar el stack desde el repositorio, distinguir hechos de suposiciones y manejar contextos vacíos sin inventar. Úsala al iniciar cualquier tarea y ante cualquier duda sobre qué tecnología usa el proyecto.
---

# Contexto de proyecto

Esta skill existe por un motivo: **la causa más frecuente de trabajo incorrecto es actuar sobre un proyecto imaginado en lugar del real.** Un agente que asume Next.js, Prisma o PostgreSQL en un SPA de Vite produce código que no compila, contratos que no existen y decisiones que hay que deshacer.

## Regla de verdad

> **El código y la configuración actuales del repositorio son la fuente de verdad.** Los archivos de `.agents/contexts/` son una descripción que puede estar desactualizada o vacía. Los prompts de los agentes describen una especialidad, no el proyecto.

Orden de autoridad para un hecho sobre el proyecto:

1. **Repositorio**: `package.json`, lockfile, configuración (`vite.config.*`, `tsconfig.json`, `next.config.*`, etc.), código.
2. **Contextos**: `.agents/contexts/*.md`.
3. **ADRs**.
4. **Lo que diga el pedido** (puede contener suposiciones erróneas: se verifican).
5. Tu memoria o conocimiento previo — **nunca** cuenta como evidencia del proyecto.

## Procedimiento de descubrimiento (mínimo necesario)

Lee **solo lo indispensable**, en este orden, y detente cuando tengas lo que necesitas:

1. `AGENTS.md` en la raíz, si existe.
2. `package.json`: dependencias, `scripts`, `engines`, gestor (`packageManager`, lockfile presente).
3. Configuración del bundler/framework y de TypeScript (`strict`, alias de rutas).
4. La estructura de carpetas de `src/` (una sola pasada, poca profundidad).
5. El/los archivo(s) directamente afectados por la tarea.
6. El contexto de `.agents/contexts/` **relevante** a la tarea (no todos).

### Tabla de detección de stack

| Evidencia en el repositorio | Conclusión |
|---|---|
| `vite` + `react` + `react-router*`, sin `next` | SPA en el navegador; **no hay servidor propio** |
| Directorio `app/` o `pages/` + dependencia `next` | Next.js |
| `prisma` en dependencias + `schema.prisma` | Capa de datos con Prisma |
| `@supabase/*`, `firebase`, `appwrite`… | BaaS: la "persistencia/auth" es externa |
| `express`, `fastify`, `@nestjs/*` | API dedicada |
| `vitest`, `jest`, `playwright`, `cypress` | Herramientas de prueba presentes (si no aparece ninguna: **no hay framework de tests**) |
| `tailwindcss` + versión | Estilos con Tailwind (verifica la versión y si hay `*.module.css`) |

## Hechos, inferencias y suposiciones

Etiqueta siempre lo que afirmas:

- **Hecho verificado** — con fuente: `package.json:14` o el comando y su salida.
- **Inferencia** — razonada a partir de hechos; explicita el razonamiento.
- **Suposición** — no verificada. Se **declara**. Si cruza un límite de riesgo (datos, acceso, producción, contrato público, proveedor nuevo) → **se escala**, no se asume.

## Contextos vacíos

Muchos contextos de `.agents/contexts/` pueden estar solo con encabezados. Regla:

- **No inventes su contenido.** Un contexto vacío es una **pregunta abierta**, no una invitación a rellenar.
- Si puedes derivar un dato **con fuente** del repositorio, regístralo como hecho verificado (y propón actualizar el contexto).
- Si no puedes derivarlo y lo necesitas para decidir algo riesgoso → escala con el formato de `ESCALATION.md`.
- Si no lo necesitas para la tarea actual → déjalo y sigue; no bloquees por completitud.

## Discrepancias entre el prompt del agente y el proyecto

Cada especialista puede haber sido escrito pensando en un stack distinto al real (p. ej. Server Actions, Prisma, Auth.js). Cuando ocurra:

1. **No fuerces el patrón** al proyecto.
2. Traduce el **principio** al stack real (p. ej. "autorizar en servidor" → "la autorización real vive en el servicio externo; el cliente no es de confianza").
3. Si el principio no tiene traducción posible (necesitas una base de datos y no existe), **escala** con opciones.
4. Deja la discrepancia registrada en el retorno.

## Presupuesto de contexto

- Lee lo mínimo relevante. Cargar el repositorio entero "por las dudas" degrada la calidad de la decisión (información no pertinente y en exceso).
- Prefiere `grep`/búsquedas dirigidas a leer archivos completos.
- Un archivo grande se lee por rangos.

## Qué registrar al terminar

En el retorno, incluye una línea de **contexto verificado**: stack detectado, herramientas de prueba presentes, y cualquier discrepancia con `contexts/` para que el orquestador la corrija.

## Errores típicos (y su remedio)

| Error | Remedio |
|---|---|
| Recomendar Server Components en un SPA de Vite | Verificar bundler; usar carga diferida por ruta |
| Proponer un ORM sin base de datos | Escalar; opciones + ADR |
| Instalar un runner de tests sin preguntar | Declarar la brecha; proponer opciones |
| Inventar variables de entorno | Solo nombres verificados en el repositorio |
| Rellenar `SECURITY.md` "razonablemente" | Dejarlo vacío y escalar lo necesario |
