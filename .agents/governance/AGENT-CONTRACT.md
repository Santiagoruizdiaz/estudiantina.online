# Agent Contract

Every agent declares purpose, inputs, outputs, scope, forbidden actions, tools, skills, exit criteria and escalation conditions. Complete means output + verification evidence.

## Contenido mínimo (verificable por el orquestador)

Todo archivo de agente en `.agents/agents/` contiene:

| Sección | Qué declara |
|---|---|
| **Frontmatter** | `name`, `description`, `model`, `mainAgent`, `subagent`, `permissionMode`, `commandExecutionPolicy`, `tools`, `skills` |
| **Posición en la organización** | Área, nivel, superior, título, `A/R`, `C`, `I`, roles de Mintzberg |
| **Principios de operación** | Bloque común (evidencia, mínimo alcance, no debilitar seguridad, escalar) |
| **Contrato** | Qué **recibe**, qué **entrega**, qué le está **prohibido** |
| **Procedimiento** | Pasos numerados y ejecutables |
| **Criterios de salida** | Casillas verificables |
| **Escalas cuando** | Condiciones de escalamiento propias |
| **Entregas a otros** | A quién pasa qué |

## Definición de "completo"

Un agente completó su trabajo si y solo si entrega **ambos**:

1. **Output**: el artefacto pedido, dentro del alcance.
2. **Evidencia de verificación**: comando + salida real por cada criterio de aceptación.

Sin el segundo, el estado es `PARCIAL`, no `COMPLETO`.

## Reglas de permisos

| Tipo de agente | `permissionMode` | `commandExecutionPolicy` | Herramienta de edición |
|---|---|---|---|
| **Constructor** | `acceptEdits` | `auto` | Sí |
| **Analista/arquitecto** | `plan` (diseña, no ejecuta) | `auto` | Solo para sus documentos |
| **Verificador/revisor** (`security-review`, `code-review`, `performance-engineer`, `release-manager`) | `plan` | `sandbox` | **No** |
| **Verificador que escribe tests** (`qa-test`) | `acceptEdits` | `auto` | Solo tests |

Un verificador **con** herramienta de edición o con `acceptEdits` viola la separación de funciones. El validador (`run.py`) lo comprueba.

## Entrega de informes en modo solo lectura

Un verificador sin herramienta de edición **no escribe archivos**: su entregable es el **retorno estructurado** (formato del template correspondiente). El **orquestador lo persiste íntegro** y **no puede alterar ni suavizar el veredicto**; si discrepa, escala al humano dejando ambas posturas por escrito. Todo agente de solo lectura incluye la sección *"Cómo entregas tu informe (modo solo lectura)"* (la genera `gen.py`).

## Reglas del contrato

- **Fuera de alcance = prohibido**, aunque el agente sepa hacerlo.
- **No se declara una capacidad que no se tiene**: si `invoke_subagent` no está, no se dice que se delegó.
- **Skills**: solo las que existen y son relevantes; el validador comprueba que cada skill referenciada existe.
- **Agentes citados** en `C`/`I` deben existir.
- Cualquier cambio de contrato es un **cambio de gobernanza**: se registra.
