# Workflow: Liberación a producción

**Descripción**: Compuerta de preparación para producción (G8).

**Dirige**: `fullstack-orchestrator` → `devops` + `release-manager` (A/R de G8) · **Cuándo**: Todo despliegue a producción.

> **Un build verde no es evidencia de release.** Se libera cuando el cambio se entiende, los riesgos se conocen, se puede observar y se puede revertir.

---

## Procedimiento

| # | Responsable (A/R) | Acción | Salida | Gate |
|---|---|---|---|---|
| 1 | `devops` | Correr **lint, typecheck, tests y build** en CI con resultados reales | Salida de CI | G5 |
| 2 | `database-prisma` | Revisar la **seguridad de migraciones** (si hay capa de datos) | Clasificación y plan | G3 |
| 3 | `security-review` | Confirmar **G4**: sin CRITICAL/HIGH abiertos | Veredicto | G4 |
| 4 | `code-review` | Confirmar **G7**: sin BLOCKER/HIGH abiertos | Veredicto | G7 |
| 5 | `devops` | Verificar **variables de entorno requeridas por nombre**; sin valores secretos en el repositorio | Lista de nombres | — |
| 6 | `observability-engineer` | Verificar **observabilidad operativa**: logs, métricas y alertas de flujos críticos | Evidencia | G6 |
| 7 | `devops` | Verificar **rollback/recuperación** concretos y factibles | Plan de rollback | — |
| 8 | `release-manager` | Aplicar el **checklist G8** (`skills/release-engineering`) y emitir **PASS / CONDITIONAL / BLOCKED** | Informe (`templates/RELEASE.md`) | G8 |
| 9 | humano | **Aprobación explícita** del despliegue | Aprobación registrada | — |
| 10 | `devops` | Desplegar; **verificar** con smoke test y métricas; **capturar evidencia** | Evidencia de despliegue | — |

## Reglas del flujo

- **Proceder solo cuando G8 pasa.**
- **Ningún CRITICAL/HIGH** de seguridad sin resolver puede liberarse.
- Toda migración que toca producción requiere **revisión y aprobación humana**.
- El rollback debe ser **concreto**; "volver a la versión anterior" sin procedimiento cuenta como inexistente.
- Un CONDITIONAL solo admite condiciones **menores** con dueño y plazo; nunca compromete seguridad, datos o recuperación.
- Saltar un gate requiere **decisión humana documentada**.
- Los cambios incompatibles se declaran en las notas de release.

## Criterios de salida

- [ ] Lint, typecheck, tests y build con evidencia real
- [ ] G3, G4, G6, G7 cumplidos
- [ ] Variables de entorno documentadas por nombre
- [ ] Observabilidad operativa
- [ ] Rollback definido y factible
- [ ] Veredicto de G8 emitido y aprobación humana registrada
- [ ] Evidencia de despliegue capturada

## Detener y escalar cuando

- Falta evidencia de un gate obligatorio
- Se pide liberar saltando un gate
- Migración de producción sin ruta de recuperación
- Hallazgo CRITICAL/HIGH abierto

## Marco común

Este workflow hereda el **proceso administrativo** (planificar → organizar → dirigir → controlar), `HANDOFF-PROTOCOL.md` para todo traspaso y `QUALITY-GATES.md`. El constructor **no aprueba su propio trabajo**; los verificadores **reportan y no corrigen**.
