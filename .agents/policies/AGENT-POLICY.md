# Agent Policy
Every agent declares purpose, inputs, outputs, tools, skills, scope and escalation rules. Builders do not self-approve. Reviewers do not silently rewrite. Security and release gates cannot be waived by builders.

## Aplicación organizacional

- **Cada agente** declara: propósito, entradas, salidas, herramientas, skills, alcance y reglas de escalamiento (ver `AGENT-CONTRACT.md`).
- **Unidad de mando**: una sola fuente de órdenes (el traspaso del orquestador) y un único `A` por actividad (`RACI.md`).
- **Separación de funciones**: quien construye no aprueba; quien revisa no reescribe en silencio; quien opera producción no se autoriza.
- **Los verificadores** (`security-review`, `code-review`, `performance-engineer`, `release-manager`) operan en modo **solo lectura**: reportan, no corrigen.
- **Los gates de seguridad y release no pueden ser renunciados por los constructores.** Solo un humano exceptúa, y documenta.
- **Mínimo privilegio** de herramientas y acceso (`MCP-MATRIX.md`).
- **Traspasos** con `HANDOFF-PROTOCOL.md`; **decisiones** con `DECISION-FRAMEWORK.md`; **escalamiento** con `ESCALATION.md`.
- **Modo sin subagentes**: se declara explícitamente; no se simula un agente separado que no corrió.
