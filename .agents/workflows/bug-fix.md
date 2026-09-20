# Workflow: Corrección de defecto

**Descripción**: Diagnosticar y corregir un defecto con protección de regresión.

**Dirige**: `fullstack-orchestrator` (asigna al builder dueño del área afectada) · **Cuándo**: Comportamiento incorrecto respecto de lo esperado en un sistema existente.

> **Sin causa raíz no hay corrección: hay un parche.** Se corrige lo que se entendió, y se agrega una prueba para que no vuelva.

---

## Procedimiento

| # | Responsable (A/R) | Acción | Salida | Gate |
|---|---|---|---|---|
| 1 | orquestador | Clasificar severidad e impacto; delimitar el alcance mínimo de la corrección | Ticket con impacto y alcance | — |
| 2 | builder dueño del área (RACI) | **Reproducir** el defecto con pasos deterministas | Reproducción confirmada | — |
| 3 | builder dueño del área | **Aislar la causa raíz** con evidencia (no por intuición) | Causa raíz documentada | — |
| 4 | `qa-test` (o el builder si es trivial) | **Escribir la prueba de regresión que falla** antes del arreglo | Test rojo | G6 |
| 5 | builder dueño del área | Implementar la **corrección mínima** dentro del alcance | Diff enfocado | G5 |
| 6 | `qa-test` | Ejecutar la verificación relevante; la prueba de regresión ahora pasa; sin nuevas fallas | Salida real de pruebas | G6 |
| 7 | `security-review` | Si el defecto toca autenticación, acceso, entradas o datos: revisión independiente | Veredicto | G4 |
| 8 | `code-review` | Revisión independiente del diff | Veredicto | G7 |
| 9 | orquestador | Reportar: causa raíz, corrección, protección contra regresión | Reporte de cierre | — |

## Reglas del flujo

- Corrección **mínima**: no refactorizar ni agregar funcionalidad en el mismo cambio.
- **Reproducir antes de arreglar.** Un defecto no reproducido no se da por corregido.
- La prueba de regresión debe **fallar sin el arreglo** y **pasar con él**.
- Si la causa raíz es de diseño (no un error puntual), se **escala**: puede requerir arquitectura (`refactor`).
- Un defecto en producción sigue `incident.md`: primero mitigar, luego corregir.

## Criterios de salida

- [ ] Defecto reproducido y causa raíz identificada con evidencia
- [ ] Prueba de regresión que falla sin el arreglo y pasa con él
- [ ] Corrección mínima, dentro del alcance
- [ ] Verificación relevante ejecutada con salida real
- [ ] Revisión de seguridad/código realizada cuando aplica
- [ ] Reporte con causa raíz y protección añadida

## Detener y escalar cuando

- No se puede reproducir el defecto
- La causa raíz es un problema de diseño o arquitectura
- El defecto implica pérdida o corrupción de datos
- Corregir exigiría cambiar un contrato público

## Marco común

Este workflow hereda el **proceso administrativo** (planificar → organizar → dirigir → controlar), `HANDOFF-PROTOCOL.md` para todo traspaso y `QUALITY-GATES.md`. El constructor **no aprueba su propio trabajo**; los verificadores **reportan y no corrigen**.
