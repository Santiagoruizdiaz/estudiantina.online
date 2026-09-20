# Workflow: Refactorización

**Descripción**: Reducir deuda técnica **sin cambiar el comportamiento previsto**.

**Dirige**: `fullstack-orchestrator` → `migration-refactoring` (A/R) · **Cuándo**: La estructura del código dificulta el cambio, pero el comportamiento es correcto.

> **Refactorizar es cambiar la estructura, no el comportamiento.** Sin una red de pruebas que lo demuestre, no es refactorización: es una apuesta.

---

## Procedimiento

| # | Responsable (A/R) | Acción | Salida | Gate |
|---|---|---|---|---|
| 1 | orquestador | Definir el objetivo (qué deuda, por qué ahora) y el criterio de "terminado" verificable | Objetivo | — |
| 2 | `migration-refactoring` | **Capturar el comportamiento actual** con pruebas de caracterización | Red de seguridad | G6 |
| 3 | `software-architect` | Definir la **frontera objetivo** (y ADR si es material) | Diseño objetivo | G2 |
| 4 | `migration-refactoring` | **Planificar la migración incremental**: pasos pequeños, desplegables y reversibles | Plan por pasos | — |
| 5 | `migration-refactoring` | Ejecutar **un paso por vez**; tras cada uno, correr la suite completa | Diff por paso + suite verde | G5 |
| 6 | `performance-engineer` | Si el refactor toca rutas sensibles: medir antes/después | Comparación medida | G7 |
| 7 | `code-review` | Revisión independiente **por paso** | Veredicto | G7 |
| 8 | `migration-refactoring` | Retirar código de compatibilidad **solo con evidencia** de que ya no se usa | Limpieza justificada | — |
| 9 | orquestador | Actualizar ADRs y documentación; reportar | Cierre | — |

## Reglas del flujo

- **Sin refactor sin red de pruebas.** Si no existen, primero caracterización.
- **Nunca mezclar** refactor con funcionalidad nueva o corrección de defectos.
- Cada paso es **desplegable y reversible** por separado (expand-and-contract).
- **Un paso, una verificación completa.** Nada de acumular cambios sin verificar.
- El código de compatibilidad se retira con **evidencia** (búsquedas de uso, métricas), no por suposición.
- Bajo incertidumbre, aplica **análisis de escenarios** (optimista/moderado/pesimista) y elige el camino reversible.

## Criterios de salida

- [ ] Pruebas de caracterización previas al cambio
- [ ] Comportamiento previsto preservado (suite de regresión verde en cada paso)
- [ ] Migración incremental con rollback por paso
- [ ] Sin funcionalidad nueva mezclada
- [ ] Código de compatibilidad retirado solo con evidencia
- [ ] ADR y documentación actualizados

## Detener y escalar cuando

- No existe red de pruebas y el riesgo de regresión es alto
- El refactor rompe un contrato público o afecta datos de producción
- Un paso no puede hacerse reversible

## Marco común

Este workflow hereda el **proceso administrativo** (planificar → organizar → dirigir → controlar), `HANDOFF-PROTOCOL.md` para todo traspaso y `QUALITY-GATES.md`. El constructor **no aprueba su propio trabajo**; los verificadores **reportan y no corrigen**.
