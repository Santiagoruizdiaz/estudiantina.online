---
name: project-lifecycle
description: Ciclo de vida completo de un proyecto de ingeniería según el proceso administrativo - planificación con objetivos SMART/OKR y escenarios, organización, dirección y control con KPIs. Úsala al iniciar, planificar, estimar, replanificar o cerrar cualquier trabajo no trivial.
---

# Ciclo de vida del proyecto

Traduce el proceso administrativo (planificar → organizar → dirigir → controlar) a un procedimiento operativo para proyectos de software.

## Principios de planeamiento

| Principio | Aplicación |
|---|---|
| **Precisión** | Cuanto más preciso el plan, menos improvisación y desperdicio. Criterios de aceptación concretos. |
| **Flexibilidad** | El plan admite cambios ante nueva evidencia. Se replanifica, no se defiende un plan obsoleto. |
| **Unidad** | Cada plan de área se coordina con el plan general. Ninguna área optimiza sola. |
| **Consistencia** | Recursos, funciones y actividades se integran hacia la meta. |
| **Rentabilidad** | El beneficio esperado debe superar el costo (incluida la complejidad que se introduce). |
| **Participación** | Los especialistas afectados intervienen (`C` de RACI) antes de fijar el plan. |

## Proceso de planeamiento (8 etapas aplicadas)

1. **Atención a las oportunidades** — ¿Qué necesidad real del usuario hay? ¿Qué fortalezas/debilidades del repo y del equipo aplican?
2. **Establecimiento de objetivos** — ¿Dónde queremos estar? ¿Qué hacer y para cuándo? (ver "Objetivos").
3. **Premisas de planeación** — ¿En qué condiciones internas y externas operará el plan? (stack real, restricciones, ADRs, normativa).
4. **Identificación de alternativas** — ¿Qué caminos promisorios existen?
5. **Comparación de alternativas** — Contra los objetivos y los criterios de `DECISION-FRAMEWORK.md`.
6. **Elección** — Seleccionar el curso de acción y **comprometer** recursos. Sin decisión no hay plan.
7. **Planes de apoyo** — Qué necesita cada unidad: contexto, dependencias, agentes, herramientas.
8. **Conversión en cifras** — Estimaciones y presupuesto de iteración: cuántos ciclos de corrección, qué se mide.

## Objetivos

### Jerarquía y horizonte

| Tipo | Nivel | Horizonte | En ingeniería |
|---|---|---|---|
| Organizacional | Estratégico | Largo | Qué logra el proyecto para el negocio |
| Funcional | Táctico | Mediano | Qué logra cada área/funcionalidad |
| Individual | Operativo | Corto | Qué entrega cada agente en esta tarea |

**Cada objetivo operativo debe rastrearse a uno táctico, y cada táctico a uno estratégico.** Si no rastrea, es trabajo fuera de alcance.

### Objetivos SMART (para tareas y criterios de aceptación)

- **S**pecific — concreto, sin ambigüedad.
- **M**easurable — se puede verificar al final (comando, prueba, métrica).
- **A**chievable — alcanzable con los recursos y el alcance dados.
- **R**elevant — aporta al objetivo superior.
- **T**ime-bound — con presupuesto de iteración o punto de control definido.

Los objetivos deben ser **verificables**: al cierre debe ser posible comprobar que se cumplieron. Un objetivo no verificable no se puede controlar.

### Objetivo general vs. específicos

| General | Específicos (ejemplos aplicados) |
|---|---|
| Que la inspección de un vehículo sea confiable | Validar en runtime cada campo de la checklist · cubrir con tests los estados válidos · registrar cada cambio de estado |
| Reducir el tiempo de carga de la landing | Medir LCP/INP antes y después · diferir carga de imágenes bajo el pliegue · presupuestar el tamaño del bundle |

### OKR (para hitos ambiciosos de varias etapas)

- **Objective**: meta inspiradora y cualitativa.
- **Key Results**: 2–4 indicadores **cuantitativos** que muestran si se cumplió.
- Se revisan en ciclos cortos y son transparentes para todo el equipo.
- **SMART** = metas realistas y alcanzables (tareas). **OKR** = metas ambiciosas que empujan a superarse (hitos). Se usan ambos según el caso.

## Tipos de planes (jerarquía de artefactos)

| Plan | Pregunta | Equivalente en el equipo |
|---|---|---|
| Misión | ¿Cuál es nuestra razón de ser? | `PROJECT.md` — propósito del producto |
| Visión | ¿Qué queremos ser? | Estado objetivo del producto |
| Objetivos | ¿A dónde vamos? | Criterios de aceptación / OKR |
| Estrategias | ¿Cómo asignamos recursos para llegar? | ADRs, elección de arquitectura |
| Políticas | ¿Qué orienta las decisiones? | `.agents/policies/` |
| Procedimientos | ¿Cuál es la secuencia exacta? | `.agents/workflows/` |
| Reglas | ¿Qué acción se exige o se prohíbe? | `.agents/rules/` |
| Programas | ¿Conjunto coordinado de lo anterior? | Un workflow ejecutado con su plan |
| Presupuestos | ¿Cuánto en cifras? | Presupuesto de iteración, límites de rendimiento |

## Análisis de escenarios (bajo incertidumbre)

Cuando una variable crítica es incierta (dependencia externa, decisión de arquitectura, migración de datos), **no dependas de un único plan**:

1. **Variable crítica** — el factor principal que puede cambiar.
2. **Escenarios**: optimista / moderado / pesimista.
3. **Acciones por escenario** — qué haría el equipo en cada caso. Un buen escenario responde: *¿qué puede pasar?* y *¿qué haríamos si pasa?*

Ejemplo: migrar una librería de enrutamiento. Variable: compatibilidad de las dependencias. Optimista → migración directa. Moderado → adaptadores temporales. Pesimista → congelar versión y aislar el módulo detrás de una interfaz.

## Estrategias con FODA (para decisiones de arquitectura y alcance)

| | Oportunidades | Amenazas |
|---|---|---|
| **Fortalezas** | **Ofensiva (FO)**: usar lo fuerte para crecer | **Defensiva (FA)**: usar lo fuerte para protegerse |
| **Debilidades** | **Adaptativa (DO)**: corregir lo débil aprovechando el entorno | **Supervivencia (DA)**: minimizar debilidad y riesgo |

Ejemplo: base sin tests (debilidad) + herramienta de test accesible (oportunidad) → estrategia adaptativa: introducir tests sobre los flujos críticos primero.

## Proceso de ejecución del proyecto

```
Pedido → [PLANIFICAR] → [ORGANIZAR] → [DIRIGIR] → [CONTROLAR] → Cierre
              ↑                                          │
              └──────── retroalimentación ───────────────┘
```

### Fase 0 — Inicio
- Reformular objetivo. Detectar stack real. Verificar contextos disponibles.
- Salida: **objetivo verificable + criterios de aceptación + alcance**.

### Fase 1 — Análisis (G0–G2)
- `product-requirements` → requisitos y criterios.
- `domain-architect` → invariantes y estados (si cambia una regla de negocio).
- `software-architect` → fronteras y ADR (si cambia arquitectura).
- Salida: **diseño aprobado**.

### Fase 2 — Construcción (G3–G5)
- Builders según RACI, en el orden de dependencias.
- Salida: **implementación dentro de alcance + evidencia del constructor**.

### Fase 3 — Verificación y control (G4, G6, G7)
- `qa-test`, `accessibility-specialist`, `observability-engineer`, `security-review`, `performance-engineer`, `code-review`.
- Salida: **hallazgos clasificados**. Correcciones acotadas por el presupuesto de iteración.

### Fase 4 — Liberación (G8)
- `devops` + `release-manager`.
- Salida: **PASS / CONDITIONAL / BLOCKED con evidencia** y plan de rollback.

### Fase 5 — Cierre y aprendizaje
- Registrar decisiones, actualizar contextos, cerrar la traza.
- Si hubo un fallo relevante → postmortem (`templates/INCIDENT-POSTMORTEM.md`).

## Control por indicadores (KPI)

Un KPI no es cualquier dato: debe alinearse con el objetivo y servir para decidir. Indicadores de control del proceso:

| KPI | Qué mide | Señal de alarma |
|---|---|---|
| Criterios de aceptación cumplidos | Eficacia | < 100% al cierre |
| Ciclos de corrección usados vs. presupuesto | Eficiencia | Agotamiento sin cumplir |
| Hallazgos CRITICAL/HIGH abiertos | Calidad y seguridad | Cualquiera ≠ 0 al liberar |
| Archivos tocados fuera de alcance | Disciplina de alcance | Cualquiera ≠ 0 |
| Traspasos rechazados por información deficiente | Calidad de la información | Tendencia creciente |
| Gates saltados sin decisión humana | Gobernanza | Cualquiera ≠ 0 |

## Planeación tradicional vs. estratégica

- **Tradicional**: corto plazo, herramientas proyectivas; produce objetivos, políticas, procedimientos, presupuestos. → úsala para **tareas y correcciones**.
- **Estratégica**: largo plazo; produce misión, visión, objetivos estratégicos, estrategias, indicadores. → úsala para **decisiones de arquitectura, migraciones y roadmap**.

## Anti-patrones

- Planificar sin criterio de aceptación verificable.
- Plan rígido que no se replanifica ante nueva evidencia.
- Objetivos que no rastrean hacia arriba.
- Saltar de "pedido" a "código" sin fase de análisis cuando el riesgo lo exige.
- Medir solo lo fácil (líneas, archivos) en vez de lo que importa (criterios cumplidos, riesgo residual).
