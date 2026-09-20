# Release

**Result**: PASS | CONDITIONAL | BLOCKED
**Responsable (A)**: `release-manager` · **Gate**: G8 · **Versión**: <x.y.z> · **Fecha**: <AAAA-MM-DD>
> Un build verde **no** es evidencia de release. Cada ítem lleva evidencia real.

## Scope
<!-- Qué se libera. Cambios incompatibles (breaking) declarados explícitamente o "Ninguno". -->

## Verification
| Control | Estado | Evidencia (comando/salida/enlace) |
|---|---|---|
| Criterios de aceptación (G0) | | |
| Lint | | |
| Typecheck | | |
| Tests (o brecha declarada) | | |
| Build | | |
| Seguridad (G4): sin CRITICAL/HIGH | | |
| Code review G7: sin BLOCKER/HIGH | | |

## Migration
<!-- Clasificación, reproducibilidad, orden respecto del código, aprobación humana si toca producción. "n/a" si no hay capa de datos. -->

## Environment
<!-- Variables requeridas SOLO POR NOMBRE, entorno destino. Confirmar que no hay secretos en el repositorio. -->

## Observability
<!-- Logs, métricas y alertas operativos en los flujos críticos. SLO. -->

## Deployment
<!-- Orden, ventana, responsables, verificación posterior (smoke test). Aprobación humana registrada. -->

## Rollback
<!-- Disparador · procedimiento exacto · datos · tiempo objetivo · verificación · responsable. "Volver a la anterior" sin procedimiento = inexistente. -->

## Conditions (solo si CONDITIONAL)
<!-- Solo menores, sin comprometer seguridad/datos/recuperación. Cada una con dueño y plazo. -->
| Condición | Dueño | Plazo |
|---|---|---|
| | | |

## Known risks
<!-- Descripción · probabilidad · impacto · mitigación · quién los aceptó y hasta cuándo. -->
