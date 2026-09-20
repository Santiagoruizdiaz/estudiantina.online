# Matriz RACI

Aplica el principio de **unidad de mando**: cada actividad tiene **exactamente un** `A`.

- **R** (Responsible) — ejecuta el trabajo.
- **A** (Accountable) — responde por el resultado y lo aprueba. **Uno solo.**
- **C** (Consulted) — aporta antes de la decisión (comunicación bidireccional).
- **I** (Informed) — se entera después (comunicación unidireccional).

Abreviaturas: **ORQ** orchestrator · **REQ** product-requirements · **DOM** domain-architect · **ARQ** software-architect · **DB** database-prisma · **AUTH** auth-policy · **BE** backend-application · **FE** frontend-architect · **UX** ui-ux · **INT** integration-specialist · **JOB** async-jobs-engineer · **MIG** migration-refactoring · **QA** qa-test · **A11Y** accessibility-specialist · **OBS** observability-engineer · **PERF** performance-engineer · **SEC** security-review · **CR** code-review · **OPS** devops · **REL** release-manager

## Matriz de actividades

| Actividad | ORQ | REQ | DOM | ARQ | DB | AUTH | BE | FE | UX | INT | JOB | MIG | QA | A11Y | OBS | PERF | SEC | CR | OPS | REL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Requisitos y criterios de aceptación (G0) | I | **A/R** | C | C | | | | | C | | | | C | | | | C | | | |
| Modelo de dominio e invariantes (G1) | I | C | **A/R** | C | C | | | | | | | | | | | | | | | |
| Arquitectura y ADR (G2) | I | C | C | **A/R** | C | C | C | C | | C | C | | | | C | C | C | | C | |
| Esquema, migraciones, índices (G3) | I | | C | C | **A/R** | | C | | | | | C | C | | | C | C | C | C | |
| Autenticación/autorización (G4) | I | C | C | C | C | **A/R** | C | C | | C | | | C | | | | C | | | |
| Casos de uso, validación, DTOs (G5) | I | C | C | C | C | C | **A/R** | C | | C | C | | C | | C | | C | | | |
| UI, rutas y estado del cliente (G5) | I | C | | C | | C | C | **A/R** | C | | | | C | C | | C | | | | |
| Sistema de diseño y flujos UX | I | C | | | | | | C | **A/R** | | | | | C | | | | | | |
| Adaptadores de proveedores externos | I | C | | C | | C | C | | | **A/R** | C | | C | | C | | C | | | |
| Jobs, colas, outbox, reintentos | I | C | C | C | C | | C | | | C | **A/R** | | C | | C | C | C | | C | |
| Refactor/modernización de código | I | | C | C | C | | C | C | | | | **A/R** | C | | | C | | C | | |
| Estrategia y ejecución de pruebas (G6) | I | C | C | | | | C | C | | | | | **A/R** | C | | | C | | | |
| Accesibilidad de interacción (G6) | I | | | | | | | C | C | | | | C | **A/R** | | | | | | |
| Logs, métricas, trazas, alertas (G6) | I | | | C | | | C | | | | C | | C | | **A/R** | C | | | C | |
| Rendimiento medido (G7) | I | | | C | C | | C | C | | | C | | C | | C | **A/R** | | C | | |
| Revisión de seguridad independiente (G4) | I | | | C | C | C | C | C | | C | C | | C | | | | **A/R** | C | | |
| Revisión de código independiente (G7) | I | | | C | C | C | C | C | | C | C | C | C | | | C | C | **A/R** | | |
| CI/CD, entornos, despliegue | I | | | C | C | | | | | | | | C | | C | | C | | **A/R** | C |
| Compuerta de producción (G8) | C | | | | C | | | | | | | | C | | C | C | C | C | C | **A/R** |
| Coordinación y cierre del trabajo | **A/R** | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C |
| Excepción a un gate | **R** | | | | | | | | | | | | | | | | C | | | C |

> La excepción a un gate tiene `A` = **el humano**, fuera de la matriz. Ningún agente puede ser `A` de su propia excepción.

## Reglas de lectura

1. **Un solo A por fila.** Si al asignar trabajo aparecen dos, el orquestador resuelve antes de ejecutar.
2. **Quien es A/R de construir no es A de aprobar.** Los gates G4, G6, G7, G8 los aprueban roles distintos del que construyó.
3. **Los C son obligatorios, no opcionales.** Saltearse una consulta marcada `C` es una violación del proceso. Se consulta *antes* de decidir.
4. **Los I reciben el resultado**, no el proceso: información simple y pertinente.
5. Si una actividad no aparece en la matriz, la asigna el orquestador y registra el `A` en la nota de tarea.

## Ejemplos de aplicación

- *"Agregar endpoint que expone historial de un vehículo"* → BE es A/R; AUTH es C (política de acceso al recurso), DB es C (consulta e índice), SEC es C; el gate lo aprueba QA (G6) y CR (G7), no BE.
- *"Cambiar un índice en producción"* → DB es A/R; PERF y OPS son C; REL es quien libera en G8.
- *"Nueva pantalla de checklist de inspección"* → FE es A/R; UX es C (flujo, tokens); A11Y es A/R de su revisión, no de la pantalla.