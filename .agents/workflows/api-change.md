# Workflow: Cambio de contrato de API

**Descripción**: Cambio seguro de un contrato de API o de rutas públicas.

**Dirige**: `fullstack-orchestrator` → `backend-application` (A/R) · **Cuándo**: Se modifica la interfaz de la que dependen consumidores (clientes, otros servicios, enlaces externos).

> **Un contrato es una promesa.** Romperla cuesta a quienes dependen de ella; por eso se prefiere ampliar a cambiar, y avisar antes de retirar.

---

## Procedimiento

| # | Responsable (A/R) | Acción | Salida | Gate |
|---|---|---|---|---|
| 1 | `backend-application` | **Identificar todos los consumidores** (código, otros clientes, integraciones, enlaces guardados) | Mapa de consumidores | — |
| 2 | `backend-application` | Definir el nuevo contrato: petición, respuesta y **catálogo de errores** (usa `templates/API-ENDPOINT.md`) | Contrato | — |
| 3 | `auth-policy` | Revisar autenticación, autorización y alcance por recurso del contrato | Política de acceso | G4 |
| 4 | `backend-application` | Definir **validación en runtime** de toda entrada | Esquemas | — |
| 5 | `software-architect` | Decidir **estrategia de compatibilidad**: aditivo / versionado / deprecación | ADR si es material | G2 |
| 6 | `backend-application` | Implementar **compatible hacia atrás** siempre que sea posible | Implementación | G5 |
| 7 | `frontend-architect` | Adaptar los consumidores propios | Cliente actualizado | — |
| 8 | `qa-test` | Pruebas de contrato, negativos de acceso, y compatibilidad con el contrato anterior | Salida real | G6 |
| 9 | `security-review` | Revisión independiente si la superficie es pública o cruza fronteras | Veredicto | G4 |
| 10 | `code-review` | Revisión independiente | Veredicto | G7 |

## Reglas del flujo

- **Aditivo primero**: agregar campos/endpoints opcionales antes que modificar o quitar.
- Un cambio **incompatible** requiere versionado o ventana de deprecación **comunicada**.
- Todo contrato define **explícitamente** sus errores; no se filtran detalles internos.
- Validación en runtime en **toda** entrada; autorización en servidor.
- Los cambios incompatibles se registran para las **notas de release**.
- Si el proyecto no tiene servidor propio, el "contrato" es el del servicio externo consumido y su adaptador: el cambio se hace en el adaptador.

## Criterios de salida

- [ ] Consumidores identificados y contemplados
- [ ] Contrato con petición, respuesta y errores definidos
- [ ] Compatibilidad hacia atrás preservada o deprecación comunicada
- [ ] Validación y autorización verificadas con casos negativos
- [ ] Pruebas de contrato pasando
- [ ] Cambios incompatibles registrados

## Detener y escalar cuando

- El cambio rompe a consumidores que no controlamos
- No se pueden identificar todos los consumidores
- Falta la política de acceso para el recurso

## Marco común

Este workflow hereda el **proceso administrativo** (planificar → organizar → dirigir → controlar), `HANDOFF-PROTOCOL.md` para todo traspaso y `QUALITY-GATES.md`. El constructor **no aprueba su propio trabajo**; los verificadores **reportan y no corrigen**.
