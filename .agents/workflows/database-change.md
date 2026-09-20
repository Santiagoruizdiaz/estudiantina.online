# Workflow: Cambio de base de datos

**Descripción**: Flujo seguro para cambios de esquema, consultas, índices o migraciones.

**Dirige**: `fullstack-orchestrator` → `database-prisma` (A/R) · **Cuándo**: Solo si el proyecto **tiene capa de datos**. Si no la tiene y se pide persistencia: **escalar**, no improvisar.

> **La base de datos guarda lo que no se puede reconstruir.** Todo cambio se trata como potencialmente irreversible hasta demostrar lo contrario.

---

## Procedimiento

| # | Responsable (A/R) | Acción | Salida | Gate |
|---|---|---|---|---|
| 1 | `database-prisma` | **Verificar que existe capa de datos** y su motor/ORM real | Hecho verificado | — |
| 2 | `database-prisma` | Inspeccionar el esquema y las consultas actuales desde el repositorio | Estado actual | — |
| 3 | `domain-architect` | Confirmar la **invariante de dominio** que el cambio implementa o preserva | Invariante | G1 |
| 4 | `database-prisma` | Diseñar el cambio: constraints, índices (por patrón de acceso), tipos | Diseño | G3 |
| 5 | `database-prisma` | **Clasificar la migración**: aditiva compatible / breaking / destructiva | Clasificación | — |
| 6 | `database-prisma` | Si es breaking: **expand-and-contract** en pasos separados | Plan por fases | — |
| 7 | `qa-test` | Pruebas de integración contra DB real: constraints (el camino de violación **falla**), consultas, migración | Salida real | G6 |
| 8 | `performance-engineer` | Verificar planes de ejecución de consultas críticas | Evidencia (`EXPLAIN`) | G7 |
| 9 | `devops` + `release-manager` | Revisar **despliegue y rollback**; orden respecto del código | Plan de despliegue | G8 |
| 10 | `code-review` | Revisión independiente, incluida la compatibilidad con la versión anterior del código | Veredicto | G7 |

## Reglas del flujo

- **Migración destructiva o que toca producción ⇒ aprobación humana explícita.**
- Migraciones **reproducibles**; nunca se edita una ya aplicada.
- El cambio de esquema es **compatible con la versión anterior del código** durante el despliegue.
- Índices grandes en tablas vivas: creación no bloqueante.
- Transacciones cortas; sin llamadas externas dentro.
- Datos de prueba **ficticios**, jamás copias de producción.

## Criterios de salida

- [ ] Existencia de capa de datos confirmada
- [ ] Migración clasificada y, si es breaking, dividida en expand/contract
- [ ] Constraints críticos presentes y probados (incluido el camino de violación)
- [ ] Índices justificados por consulta y verificados con el plan de ejecución
- [ ] Rollback/recuperación definido por paso
- [ ] Aprobación humana registrada si toca producción

## Detener y escalar cuando

- El proyecto no tiene capa de datos y se pide persistencia
- El cambio puede destruir o invalidar datos
- Una migración toca producción
- Se requiere un motor o proveedor de datos nuevo

## Marco común

Este workflow hereda el **proceso administrativo** (planificar → organizar → dirigir → controlar), `HANDOFF-PROTOCOL.md` para todo traspaso y `QUALITY-GATES.md`. El constructor **no aprueba su propio trabajo**; los verificadores **reportan y no corrigen**.
