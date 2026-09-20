---
name: release-engineering
description: Preparación y gobierno de liberaciones a producción - checklist de la compuerta G8, veredictos PASS/CONDITIONAL/BLOCKED, versionado, notas de release, cambios incompatibles, rollback y registro de riesgos. Úsala en toda liberación, cambio de versión o preparación de despliegue.
---

# Ingeniería de liberaciones

## Principio (se conserva del original)

> Una liberación **no está lista porque el código compila.** Está lista cuando: el cambio se entiende, los riesgos se conocen, el sistema se puede observar, el despliegue está controlado y la recuperación es posible.

Un build verde es **condición necesaria, nunca suficiente.**

## Quién hace qué

| Rol | Responsabilidad |
|---|---|
| `devops` | Pipeline, entornos, despliegue, evidencia de despliegue |
| `release-manager` | **Compuerta G8**: verifica que todo lo anterior esté cumplido y emite el veredicto |
| `qa-test`, `security-review`, `code-review`, `performance-engineer`, `observability-engineer` | Entregan la evidencia de G4–G7 |
| `fullstack-orchestrator` | Coordina y presenta el resultado al humano |
| **Humano** | **Aprueba** el despliegue a producción |

**El constructor no libera su propio trabajo.**

## Checklist de la compuerta G8

Cada ítem se marca con **evidencia** (comando+salida, enlace, archivo), no con opinión.

### Contenido y alcance
- [ ] Requisitos y criterios de aceptación completos y cumplidos (G0).
- [ ] El diff está **dentro del alcance**: sin cambios no pedidos ni archivos sueltos.
- [ ] Cambios incompatibles (breaking) **identificados explícitamente**.

### Verificación técnica
- [ ] **Lint** pasa.
- [ ] **Typecheck** pasa.
- [ ] **Tests** pasan (o la brecha está declarada y aceptada).
- [ ] **Build** pasa.

### Datos
- [ ] Migraciones **revisadas**, reproducibles y clasificadas (G3).
- [ ] Toda migración de producción tiene **aprobación humana** y plan de recuperación.

### Seguridad
- [ ] **Sin hallazgos CRITICAL/HIGH** de seguridad abiertos (G4, insumo de G7 y G8).
- [ ] **Sin BLOCKER/HIGH** de code review abiertos (G7).
- [ ] Sin secretos en el repositorio ni en el bundle.

### Entorno
- [ ] Variables de entorno **requeridas documentadas por nombre** y presentes en el entorno destino.
- [ ] Ningún valor secreto documentado en el repo.

### Operación
- [ ] **Observabilidad operativa** en los flujos críticos: logs, métricas, alertas.
- [ ] **Rollback o recuperación** definido, concreto y factible.
- [ ] Plan de despliegue documentado (orden, ventana, responsables).
- [ ] Verificación posterior al despliegue definida.

### Documentación
- [ ] Notas de release/changelog actualizados cuando corresponda.
- [ ] ADRs actualizados si cambió una decisión material.
- [ ] **Evidencia de despliegue** se capturará y registrará.

## Veredictos

| Veredicto | Cuándo | Efecto |
|---|---|---|
| **PASS** | **Todos** los ítems obligatorios cumplidos con evidencia | Se solicita la aprobación humana de despliegue |
| **CONDITIONAL** | Cumple lo crítico; faltan condiciones **menores y acotadas**, cada una con dueño y plazo | Se libera solo tras cumplir las condiciones listadas |
| **BLOCKED** | Falta evidencia obligatoria, hay CRITICAL/HIGH abierto, o no hay rollback | **No se libera** |

### Lo que fuerza BLOCKED (sin excepción del release-manager)

- Cualquier hallazgo **CRITICAL/HIGH** de seguridad sin resolver.
- **Sin plan de rollback/recuperación.**
- Migración de producción sin revisión ni aprobación.
- Gate obligatorio sin evidencia.
- Secreto expuesto.

### CONDITIONAL: qué es aceptable

Solo elementos que **no comprometen seguridad, datos ni recuperación**: p. ej. una nota de release pendiente, un dashboard secundario, un LOW conocido. Cada condición lleva **dueño y plazo**. Un CONDITIONAL con "varios pendientes importantes" es un BLOCKED disfrazado.

## Saltar un gate

Solo lo autoriza **un humano**, y queda **documentado en el registro de la tarea/release** (quién, cuándo, por qué, riesgo aceptado). Ningún agente puede autorizar su propia excepción ni la de otro.

## Versionado y cambios incompatibles

- **Versionado semántico** (`MAJOR.MINOR.PATCH`):
  - `PATCH`: correcciones compatibles.
  - `MINOR`: funcionalidad compatible.
  - `MAJOR`: cambios incompatibles.
- **Cambios incompatibles** se anuncian: qué cambia, quién se ve afectado, cómo migrar, cuándo se retira lo viejo (política de deprecación).
- Preferir **compatibilidad hacia atrás** (`api-change`); romper solo con necesidad y aviso.

## Notas de release

```markdown
## vX.Y.Z — AAAA-MM-DD

### Cambios incompatibles
- (qué, impacto, migración)  ← o "Ninguno"

### Funcionalidad
- ...

### Correcciones
- ...

### Consideraciones operativas
- Variables de entorno nuevas/cambiadas (nombres)
- Migraciones y su orden
- Cambios de configuración
- Cómo verificar el despliegue
- Cómo revertir
```

## Plan de rollback (contenido mínimo)

1. **Disparador**: qué señal decide revertir (métrica, alerta, umbral).
2. **Procedimiento**: pasos exactos, en orden, ejecutables por quien esté de guardia.
3. **Datos**: qué pasa con los datos escritos por la versión nueva (compatibilidad de la versión anterior con ellos).
4. **Tiempo objetivo**: cuánto tarda.
5. **Verificación**: cómo se confirma que la reversión funcionó.
6. **Responsable** de ejecutarlo.

Un rollback **no probado ni concreto** ("volver a la versión anterior") cuenta como **inexistente**.

## Riesgos conocidos

Todo riesgo residual se registra: descripción, probabilidad, impacto, mitigación, **quién lo aceptó** y hasta cuándo. Un riesgo no registrado es un riesgo escondido.

## Responder a lo que falla tras liberar

- **Rollback primero**, diagnóstico después.
- Abrir el flujo `incident` (`workflows/incident.md`).
- Tras estabilizar: postmortem (`templates/INCIDENT-POSTMORTEM.md`) con acciones y **pruebas de regresión**.

## Informe de release

Usa `templates/RELEASE.md`: `PASS | CONDITIONAL | BLOCKED` + alcance, verificación, migración, entorno, observabilidad, despliegue, rollback y riesgos conocidos.

## Lista de revisión final

- [ ] ¿Cada ítem del checklist G8 tiene evidencia?
- [ ] ¿Ningún CRITICAL/HIGH abierto?
- [ ] ¿El rollback es concreto y factible?
- [ ] ¿Los cambios incompatibles están declarados?
- [ ] ¿Variables documentadas por nombre y sin secretos?
- [ ] ¿El veredicto es honesto (no un BLOCKED disfrazado de CONDITIONAL)?
- [ ] ¿Hay aprobación humana antes de producción?
