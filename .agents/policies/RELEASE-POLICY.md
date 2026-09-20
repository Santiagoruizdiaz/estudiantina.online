# Release Policy

- No production release before G8.
- No unresolved CRITICAL/HIGH security finding may ship.
- Production-impacting database migrations require explicit review.
- Destructive operations require explicit human approval.
- Every production release must have a rollback or recovery strategy.
- Required environment variable names must be documented; secret values must never be committed.
- Deployment evidence must be captured.
- Release notes should identify breaking changes and operational considerations.

## Aplicación

- **G8** lo emite `release-manager`; el **despliegue** lo aprueba un **humano**.
- El **rollback** debe ser concreto (disparador, pasos, datos, tiempo, verificación, responsable). "Volver a la anterior" sin procedimiento cuenta como inexistente.
- **Un build verde no es evidencia de release.**
- **CONDITIONAL** solo admite condiciones menores con dueño y plazo; nunca comprometen seguridad, datos ni recuperación.
- Ver `skills/release-engineering` y `workflows/release.md`.
