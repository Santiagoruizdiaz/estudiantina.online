# Workflow: Nueva funcionalidad

**Descripción**: entrega de extremo a extremo de una funcionalidad, recorriendo las cuatro funciones administrativas y los gates G0–G8.

**Dirige**: `fullstack-orchestrator` · **Cuándo**: cualquier funcionalidad nueva o cambio de comportamiento visible.

> Este workflow es un **programa** en términos de planeamiento: un conjunto coordinado de objetivos, procedimientos, responsables y presupuesto de iteración.

---

## Fase 0 — PLANIFICAR (orquestador)

| Paso | Acción | Salida |
|---|---|---|
| 0.1 | Leer reglas y contexto (`00-core`, `05-organization`, contextos relevantes) | Contexto verificado |
| 0.2 | **Detectar el stack real** desde el repositorio (`skills/project-context`) | Hechos con fuente |
| 0.3 | Reformular el objetivo en una oración verificable | Objetivo |
| 0.4 | Aplicar la **matriz de riesgo** del orquestador | Riesgos marcados |
| 0.5 | Definir alcance (dentro / fuera) y **presupuesto de iteración** (por defecto 2 ciclos de corrección) | Alcance |
| 0.6 | Decidir qué áreas participan según la funcionalidad | Plan de delegación |

**Criterio de salida**: objetivo verificable + alcance + riesgos + plan. **Sin criterios de aceptación no se avanza.**

---

## Fase 1 — ANÁLISIS (Gates G0–G2)

| Paso | Agente (A/R) | Se invoca cuando | Entrega | Gate |
|---|---|---|---|---|
| 1.1 | `product-requirements` | **Siempre** | Requisitos, criterios de aceptación, stakeholders, MVP vs. mejoras, preguntas abiertas | **G0** |
| 1.2 | `domain-architect` | Cambia una regla de negocio, entidad o estado | Invariantes numeradas, transiciones legales/ilegales | **G1** |
| 1.3 | `software-architect` | Cambian fronteras, infraestructura o hay decisión material | ADR, fronteras, dependencias | **G2** |

**Reglas**
- 1.2 y 1.3 son **serie**: la arquitectura depende del dominio.
- Las preguntas abiertas se **resuelven o se escalan** antes de pasar a construcción. Nunca se inventan.
- El orquestador **valida cada retorno** contra sus criterios antes de continuar.

---

## Fase 2 — ORGANIZAR

El orquestador:

1. Descompone en unidades de trabajo.
2. Asigna **un solo A** por unidad (`RACI.md`).
3. Ordena por dependencias; marca qué es paralelizable (**solo si no comparten archivos**).
4. Prepara **cada traspaso** con `HANDOFF-PROTOCOL.md`.

---

## Fase 3 — CONSTRUCCIÓN (Gates G3–G5)

Orden típico según dependencias. Solo intervienen las áreas que la funcionalidad necesite.

| Orden | Agente (A/R) | Si… | Gate |
|---|---|---|---|
| 3.1 | `database-prisma` | Hay capa de datos y cambia la persistencia | **G3** |
| 3.2 | `auth-policy` | Cambia identidad, sesión o acceso | **G4** (con seguridad) |
| 3.3 | `backend-application` | Hay lógica de servidor, contratos o validación | **G5** |
| 3.4 | `integration-specialist` | Hay proveedor externo (**escalar antes**) | — |
| 3.5 | `async-jobs-engineer` | Hay trabajo diferido (**requiere ADR**) | — |
| 3.6 | `ui-ux` | Hay componentes o flujos nuevos | — |
| 3.7 | `frontend-architect` | Hay interfaz o rutas | **G5** |

**Paralelismo permitido**: 3.6 (`ui-ux`) puede correr en paralelo con 3.3 (`backend-application`) porque editan áreas disjuntas. 3.7 espera a los contratos de 3.3 y a los componentes de 3.6.

**Cada builder** devuelve el **formato de retorno** con evidencia propia. **No se autoaprueba.**

---

## Fase 4 — VERIFICACIÓN Y CONTROL (Gates G4, G6, G7)

Corre **después** de que los builders entregan, sobre el **diff real**, con los criterios **originales**.

| Orden | Agente | Cuándo | Verifica | Gate |
|---|---|---|---|---|
| 4.1 | `qa-test` | **Siempre** (todo comportamiento de usuario) | Criterios de aceptación, negativos | **G6** |
| 4.2 | `accessibility-specialist` | UI con interacción | Teclado, foco, semántica, formularios | **G6** |
| 4.3 | `observability-engineer` | Flujos críticos | Logs, métricas, SLO, alertas | **G6** |
| 4.4 | `security-review` | Cruza una frontera de confianza | Auth, IDOR, entrada/salida, secretos | **G4** |
| 4.5 | `performance-engineer` | Cambio sensible a rendimiento | Línea base, cuello de botella | **G7** |
| 4.6 | `code-review` | **Siempre** | Corrección, arquitectura, tipos, mantenibilidad | **G7** |

**Paralelismo permitido**: 4.1–4.5 son de **solo lectura** sobre el mismo diff y pueden correr en paralelo. **4.6 va al final**, con los informes anteriores en mano.

### Ciclo de corrección

```
Hallazgo → orquestador clasifica → builder corrige (dentro del presupuesto) → verificador re-verifica
```

- Los verificadores **reportan, no corrigen**.
- Presupuesto agotado sin cumplir → **escalar al humano**.
- Hallazgo **CRITICAL/HIGH** → **bloquea**; no avanza a Fase 5.

---

## Fase 5 — LIBERACIÓN (Gate G8) — solo si es entrega a producción

| Paso | Agente | Entrega |
|---|---|---|
| 5.1 | `devops` | Pipeline, entornos, plan de despliegue y rollback |
| 5.2 | `release-manager` | Veredicto **PASS / CONDITIONAL / BLOCKED** con evidencia |
| 5.3 | Humano | **Aprobación explícita** del despliegue |

Sin G8 no se entra a producción.

---

## Fase 6 — CONTROL FINAL Y CIERRE (orquestador)

1. **Inspeccionar el diff completo**: solo archivos en alcance, sin secretos.
2. Verificar cada **criterio de aceptación** con su evidencia.
3. Confirmar los **gates aplicables** firmados por un rol distinto al constructor.
4. **Registrar decisiones** (ADR) y actualizar contextos si cambió un hecho.
5. Completar la **traza de traspasos**.
6. Reportar al usuario con el formato de cierre del orquestador.
7. **Retroalimentación**: ¿qué se aprendió? → actualizar contextos, ADRs o runbooks.

---

## Diagrama de flujo

```
PLANIFICAR ─► G0 ─► G1 ─► G2 ─► ORGANIZAR ─► CONSTRUIR (G3·G4·G5)
                                                    │
                       ┌────────────────────────────┘
                       ▼
             VERIFICAR (G4·G6·G7) ──hallazgo──► corregir ─┐
                       │◄─────────────────────────────────┘
                       ▼ ok
                 LIBERAR (G8) ─► aprobación humana ─► CIERRE ─► retroalimentación
```

## Condiciones que detienen el flujo (escalar)

- Regla de negocio ambigua (G0/G1).
- Proveedor externo nuevo, cola nueva o capa de servidor/datos inexistente.
- Riesgo sobre datos de producción.
- Contrato público que puede romper consumidores.
- CRITICAL/HIGH sin corrección acordada.
- Presupuesto de iteración agotado.
