# Escalation Rules

**Escalar es señal de criterio profesional, no de debilidad.** Se escala **antes de adivinar** cuando la decisión cruza una frontera de riesgo.

## Cadena de escalamiento

```
Agente ──► fullstack-orchestrator ──► HUMANO
```

Excepción: hallazgo **CRITICAL** de seguridad o riesgo de pérdida de datos ⇒ notificación **inmediata** al orquestador **y** al humano, sin esperar el ciclo normal.

## Escalate rather than guess when:

- a business rule is ambiguous;
- a schema change can destroy or invalidate data;
- a public API contract may break consumers;
- authentication or authorization boundaries are unclear;
- a new external provider is required;
- production data or infrastructure would be changed;
- a security control would need to be weakened;
- a secret or credential is required but unavailable;
- the requested work conflicts with an existing ADR or policy.

## Condiciones adicionales de este equipo

- **El stack real contradice la premisa del pedido** (p. ej. se pide una capa de servidor o una base de datos en un SPA sin ellas).
- **Un contexto necesario está vacío** y no puede inferirse del repositorio con fuente.
- **Se agotó el presupuesto de iteración** sin cumplir los criterios de aceptación.
- **Un revisor emitió BLOCKED / CRITICAL / HIGH** y no hay corrección acordada.
- **No existe framework de pruebas** y se requeriría instalar uno.
- **El traspaso recibido** no cumple las condiciones mínimas (`HANDOFF-PROTOCOL.md`).
- **Un requisito** no es verificable tal como está escrito.
- **Se solicita saltar un gate.**

## Every escalation should include:

1. **The exact blocker.**
2. **The affected decision.**
3. **The safest viable options.**
4. **The recommended option, when evidence supports one.**

## Formato

```markdown
# Escalamiento: <asunto en una línea>

**De**: <agente> → **A**: <orquestador | humano> · **Urgencia**: normal | alta | crítica

## 1. Bloqueo exacto
<Qué impide avanzar. Hecho con fuente, no impresión.>

## 2. Decisión afectada
<Qué decisión no puede tomarse y qué depende de ella.>

## 3. Opciones seguras
| Opción | Ventajas | Riesgos | Reversible |
|---|---|---|---|
| A | | | sí/no |
| B | | | sí/no |

## 4. Recomendación
<Opción recomendada y por qué, **solo si la evidencia la respalda**. Si no, "sin recomendación: falta X".>

## Qué NO se hará mientras tanto
<El agente se detiene en lo que cruza el riesgo; puede continuar con lo independiente.>
```

## Reglas del escalamiento

- **No es abandono**: el agente sigue con lo independiente del bloqueo.
- **Sin recomendación inventada**: si la evidencia no la respalda, se dice.
- **El humano decide** lo que cruza producción, datos, proveedores, contratos públicos o seguridad.
- **Se registra** la decisión recibida (quién, cuándo) en la tarea.
- **Escalar tarde es peor que escalar temprano.**
