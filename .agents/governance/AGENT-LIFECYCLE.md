# Agent Lifecycle

1. Discover context.
2. Read applicable rules/skills.
3. Plan.
4. Execute in scope.
5. Verify.
6. Report evidence.
7. Yield to independent review.
8. Persist durable decisions.

## Ciclo ampliado (alineado al proceso administrativo)

| # | Etapa | Función | Qué hace el agente | Salida |
|---|---|---|---|---|
| 1 | **Discover context** | Planificar | Lee el traspaso; **verifica los hechos críticos en el repositorio**; detecta el stack real (`skills/project-context`). Rechaza el traspaso si no cumple `HANDOFF-PROTOCOL.md`. | Contexto verificado / rechazo |
| 2 | **Read rules/skills** | Planificar | Lee **solo** las reglas y skills aplicables a la tarea. | Restricciones vigentes |
| 3 | **Plan** | Planificar | Reformula el objetivo, lista pasos, marca suposiciones y riesgos; **escala si cruza un límite**. | Plan breve |
| 4 | **Execute in scope** | Dirigir | Ejecuta **dentro del alcance**; lo que descubre fuera de él lo **reporta**, no lo arregla. | Diff enfocado |
| 5 | **Verify** | Controlar | Ejecuta la verificación y **adjunta salida real**; compara con **cada criterio de aceptación**. | Evidencia |
| 6 | **Report evidence** | Controlar | Devuelve el **formato de retorno** con estado honesto (COMPLETO/PARCIAL/BLOQUEADO). | Retorno |
| 7 | **Yield to review** | Controlar | **Cede** a la revisión independiente; **no se aprueba a sí mismo**. Corrige los hallazgos dentro del presupuesto. | Revisión |
| 8 | **Persist decisions** | Retroalimentar | ADR de decisiones materiales; actualiza contextos si cambió un hecho; deja rastro en la traza. | Memoria institucional |

## Estados de una tarea

```
RECIBIDA → (rechazada | ACEPTADA) → EN CURSO → VERIFICANDO → EN REVISIÓN → (CORRIGIENDO ↺) → CERRADA
                                       └──► BLOQUEADA ──► ESCALADA ──► (decisión) ──► EN CURSO
```

## Reglas del ciclo

- **No se saltan etapas.** Ejecutar sin descubrir contexto es la causa más común de trabajo incorrecto.
- **Presupuesto de iteración** (por defecto 2 ciclos de corrección): agotado, se escala.
- **La etapa 7 no es opcional**: nadie cierra su propio trabajo.
- **La etapa 8 evita repetir errores**: lo aprendido se persiste.
- Un agente que detecta que **ya no cumple** el alcance (se ensanchó) **se detiene y avisa**.
