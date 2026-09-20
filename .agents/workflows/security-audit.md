# Workflow: Auditoría de seguridad

**Descripción**: Auditoría adversarial de seguridad con bloqueo ante hallazgos graves.

**Dirige**: `fullstack-orchestrator` → `security-review` (A/R) · **Cuándo**: Antes de una liberación relevante, tras un cambio en fronteras de confianza, o por pedido explícito.

> **Se audita como un atacante, no como el autor.** El objetivo es encontrar cómo se rompe, no confirmar que funciona.

---

## Procedimiento

| # | Responsable (A/R) | Acción | Salida | Gate |
|---|---|---|---|---|
| 1 | `security-review` | **Inventariar fronteras de confianza**: entradas, terceros, almacenamiento del cliente, variables de entorno, redirecciones | Superficie de amenaza | — |
| 2 | `security-review` | Revisar **autenticación y autorización** (¿en servidor? ¿bypass? ¿escalada?) | Hallazgos | — |
| 3 | `security-review` | **Probar aislamiento** entre usuarios/inquilinos (IDOR) | Hallazgos | — |
| 4 | `security-review` | Revisar entrada, salida, webhooks, subidas y **secretos** (incluido el bundle del cliente) | Hallazgos | — |
| 5 | `security-review` | Revisar dependencias y logging | Hallazgos | — |
| 6 | `security-review` | **Clasificar** cada hallazgo: CRITICAL / HIGH / MEDIUM / LOW con evidencia y remediación | Informe (`templates/SECURITY-REVIEW.md`) | G4 |
| 7 | orquestador | Asignar remediaciones a los dueños (RACI) | Plan de remediación | — |
| 8 | dueños de área | Corregir dentro del presupuesto de iteración | Correcciones | — |
| 9 | `security-review` | **Re-auditar** lo corregido y emitir veredicto | PASS / BLOCKED | G4 |

## Reglas del flujo

- El auditor **revisa, no modifica lógica de producción**.
- **CRITICAL/HIGH sin resolver ⇒ BLOCKED.** Solo un humano lo levanta, con excepción documentada.
- Un hallazgo **CRITICAL** se notifica **de inmediato** al orquestador y al humano.
- El informe **no contiene secretos ni datos sensibles**.
- El auditor no revisa lo que él mismo diseñó.
- Los hallazgos se corrigen por sus dueños; no por el auditor.

## Criterios de salida

- [ ] Superficie de amenaza inventariada
- [ ] Cada hallazgo con severidad, evidencia y remediación
- [ ] Sin CRITICAL/HIGH abiertos para un PASS
- [ ] Re-auditoría de las correcciones realizada
- [ ] Informe emitido

## Detener y escalar cuando

- Hallazgo CRITICAL (inmediato)
- Exposición de datos de terceros
- Corregir exigiría debilitar otro control
- La autorización real no existe fuera del cliente (SPA sin backend/reglas)

## Marco común

Este workflow hereda el **proceso administrativo** (planificar → organizar → dirigir → controlar), `HANDOFF-PROTOCOL.md` para todo traspaso y `QUALITY-GATES.md`. El constructor **no aprueba su propio trabajo**; los verificadores **reportan y no corrigen**.
