# Workflow: Respuesta a incidente

**Descripción**: Respuesta estructurada a un incidente en producción.

**Dirige**: `fullstack-orchestrator` (comandante del incidente) + `devops` + `observability-engineer` · **Cuándo**: Producción degradada, indisponible, con datos incorrectos o con un posible incidente de seguridad.

> **Primero estabilizar, después entender, después corregir.** La prisa por arreglar la causa antes de restaurar el servicio prolonga el daño.

---

## Procedimiento

| # | Responsable (A/R) | Acción | Salida | Gate |
|---|---|---|---|---|
| 1 | orquestador | **Declarar el incidente**, establecer **impacto** (quién, qué, desde cuándo, cuánto) y severidad | Registro inicial | — |
| 2 | orquestador | **Congelar cambios no relacionados**; **no hacer cambios especulativos** | Congelamiento | — |
| 3 | `observability-engineer` | Reunir evidencia: logs, métricas, trazas, alertas, ventana temporal | Evidencia | — |
| 4 | `devops` | Revisar **cambios recientes** (despliegues, configuración, dependencias, datos) | Correlación de cambios | — |
| 5 | `devops` + orquestador | **Elegir la acción reversible más segura** para restaurar (rollback, flag, conmutación) y **solicitar aprobación humana** con el formato de escalamiento | Propuesta de mitigación | — |
| 6 | humano | **Aprobar** la acción sobre producción (prioridad máxima en incidente crítico; no se omite) | Aprobación registrada | — |
| 7 | `devops` | **Ejecutar** la mitigación aprobada | Servicio restablecido | — |
| 7b | `observability-engineer` | **Confirmar la recuperación** con métricas, no con impresiones | Verificación | — |
| 8 | orquestador | **Registrar la línea de tiempo** (detección, decisiones, acciones, hora) | Timeline | — |
| 9 | builder del área | **Separar** la mitigación de la corrección de causa raíz; corregir con `bug-fix.md` | Corrección planificada | — |
| 10 | `qa-test` | Agregar **pruebas de regresión** | Regresión | G6 |
| 11 | orquestador | **Postmortem sin culpables** (`templates/INCIDENT-POSTMORTEM.md`); actualizar runbooks y alertas | Postmortem + acciones | — |

## Reglas del flujo

- **Restaurar antes que diagnosticar.** Si el rollback es posible y seguro, se hace primero.
- **Nada de cambios especulativos** sobre producción para "probar a ver".
- **Toda acción sobre producción exige aprobación humana**; en un incidente crítico se solicita con máxima prioridad, no se omite.
- **Mitigación ≠ corrección.** Se documentan por separado.
- Un incidente de **seguridad** activa además `security-audit.md` y la notificación inmediata al humano.
- Comunicación **honesta y periódica** al humano: qué se sabe, qué no, qué sigue.
- El postmortem se enfoca en **sistemas y procesos**, no en culpar personas.
- No se exponen secretos ni datos personales en los registros del incidente.

## Criterios de salida

- [ ] Impacto establecido y servicio restaurado con verificación por métricas
- [ ] Línea de tiempo registrada
- [ ] Mitigación y causa raíz documentadas por separado
- [ ] Pruebas de regresión añadidas
- [ ] Postmortem emitido con acciones asignadas (dueño y plazo)
- [ ] Runbooks/alertas actualizados

## Detener y escalar cuando

- Cualquier acción sobre producción (aprobación humana)
- Sospecha de brecha de datos o de seguridad
- No hay una acción reversible segura disponible
- Falta acceso o credencial necesarios para mitigar

## Marco común

Este workflow hereda el **proceso administrativo** (planificar → organizar → dirigir → controlar), `HANDOFF-PROTOCOL.md` para todo traspaso y `QUALITY-GATES.md`. El constructor **no aprueba su propio trabajo**; los verificadores **reportan y no corrigen**.
