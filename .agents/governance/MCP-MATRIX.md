# MCP Matrix

Principle: minimum necessary access.

| Capability | Preferred agents | Production access |
|---|---|---|
| Git/GitHub | orchestrator, devops, code-review | ask |
| Browser/UI inspection | frontend, ui-ux, qa, accessibility | no |
| PostgreSQL | database-prisma, performance | restricted/ask |
| Payment provider | integration-specialist, security-review | restricted/ask |
| Observability | observability-engineer, devops, performance | restricted |
| Cloud infrastructure | devops | ask |
| Documentation/search | product-requirements, architect, orchestrator | limited |

## Rules

- Do not attach every MCP server to every agent.
- Production credentials are never exposed to general-purpose agents.
- Read-only access should be preferred for reviewers.
- Any write-capable production integration should require an explicit approval path.

## Interpretación

| Valor | Significado |
|---|---|
| **no** | Sin acceso a producción, en ningún caso |
| **ask** | Cada uso requiere **aprobación humana explícita** |
| **restricted** | Solo lectura, con alcance acotado y registro de uso |
| **limited** | Solo información no sensible |

## Reglas adicionales

- **Revisores en solo lectura**: `security-review`, `code-review`, `performance-engineer`, `release-manager` **no** reciben acceso de escritura a nada.
- **Credenciales de producción**: nunca en el contexto de un agente de propósito general; el acceso se media por un canal aprobado.
- **Toda integración con capacidad de escritura sobre producción** requiere una **ruta de aprobación explícita** y deja **registro**.
- **Agentes sin acceso a un MCP** no lo simulan: piden el traspaso al agente con acceso.
- El **orquestador** revisa periódicamente qué acceso tiene cada agente y **retira el que no se usa**.
- Toda datos obtenidos por un MCP con datos de producción se trata como **sensible**: no se copia a logs, tests ni documentos.
