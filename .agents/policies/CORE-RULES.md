# Core Rules

1. Never invent repository facts.
2. Do not modify unrelated files.
3. Preserve strict typing.
4. Validate external input.
5. Enforce authorization server-side.
6. Never commit or print secrets.
7. Do not bypass verification gates without an explicit human decision.
8. Prefer incremental reversible changes.
9. Update ADRs when material architecture changes.

## Cómo se aplican

| Regla | En la práctica |
|---|---|
| 1 | Todo hecho sobre el repo cita fuente (archivo:línea o comando). Lo no verificado es una **suposición declarada**. |
| 2 | El diff contiene solo lo pedido. Lo que se descubre fuera de alcance se **reporta**, no se arregla en silencio. |
| 3 | `strict`, sin `any`, sin casts inseguros. Ver `skills/typescript-reliability`. |
| 4 | Toda frontera de confianza valida con un esquema de runtime. |
| 5 | La autorización se decide en el servidor; en un SPA, en el servicio externo. La UI no es un control. |
| 6 | Solo **nombres** de variables se documentan, nunca valores. Nunca en logs, capturas ni tests. |
| 7 | Solo un **humano** puede saltar un gate, y lo documenta. Ningún agente se exceptúa a sí mismo. |
| 8 | Pasos pequeños, desplegables y con marcha atrás (expand-and-contract, feature flags). |
| 9 | Toda decisión material tiene ADR con alternativas descartadas. |

## Reglas organizacionales complementarias

10. **Sin criterio de aceptación no se ejecuta** una tarea.
11. **Sin evidencia real no se declara "terminado"** (comando + salida, no "debería pasar").
12. **El constructor no aprueba su propio trabajo.**
13. **Escalar antes que adivinar** cuando aplique `ESCALATION.md`.
14. **Un solo responsable (A)** por actividad (`RACI.md`).
15. **Todo traspaso** usa `HANDOFF-PROTOCOL.md`.

## Precedencia

Instrucción del usuario > reglas y políticas > governance > contextos > skills locales > biblioteca externa. Un nivel inferior **nunca** anula a uno superior.
