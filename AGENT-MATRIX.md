# Matriz del Engineering Operating System (20 Agentes / 16 Skills)

## Estructura y Roles del Equipo

| Capa / Disciplina | Agente | Tipo | Modelo | Nivel Jerárquico | Quality Gate / Responsabilidad Principal |
|---|---|---|:---:|:---:|---|
| **Orquestación** | `fullstack-orchestrator` | **MAIN AGENT** | `pro` | Estratégico | Tech Lead / Coordinación global, planificación, dirección y control |
| **Análisis** | `product-requirements` | Sub-Agente | `pro` | Táctico | G0: Requerimientos, historias de usuario y criterios de aceptación |
| **Arquitectura** | `domain-architect` | Sub-Agente | `pro` | Táctico | G1: Modelo de dominio, entidades, límites e invariantes |
| **Arquitectura** | `software-architect` | Sub-Agente | `pro` | Táctico | G2: Arquitectura modular, diseño de límites y registro de ADRs |
| **Construcción** | `database-prisma` | Sub-Agente | `pro` | Táctico | G3: Modelado de datos, Prisma, migraciones expand/contract e índices |
| **Construcción** | `auth-policy` | Sub-Agente | `pro` | Táctico | G4: Autenticación, sesión, autorización RBAC/ABAC y límites |
| **Construcción** | `backend-application` | Sub-Agente | `flash` | Táctico | G5: Casos de uso, Server Actions/APIs, DTOs y validación en runtime |
| **Construcción** | `frontend-architect` | Sub-Agente | `flash` | Táctico | G5: Arquitectura cliente, routing, estado y flujo de datos |
| **Construcción** | `ui-ux` | Sub-Agente | `flash` | Táctico | Sistema de diseño, componentes UI, responsive y tokens |
| **Construcción** | `integration-specialist` | Sub-Agente | `pro` | Táctico | Proveedores externos, adaptadores, APIs y webhooks |
| **Construcción** | `async-jobs-engineer` | Sub-Agente | `pro` | Táctico | Colas, jobs, workers, outbox pattern y reintentos |
| **Construcción** | `migration-refactoring` | Sub-Agente | `pro` | Táctico | Modernización de dependencias, refactor y deuda técnica |
| **Verificación** | `qa-test` | Sub-Agente | `pro` | Control Operativo | G6: Estrategia y suites de testing (unit, integration, e2e) |
| **Verificación** | `accessibility-specialist` | Sub-Agente | `flash` | Control Operativo | G6: Auditoría WCAG, navegación por teclado, contraste y semántica |
| **Verificación** | `observability-engineer` | Sub-Agente | `pro` | Control Operativo | G6: Logs estructurados, métricas, trazas OpenTelemetry y SLOs |
| **Verificación** | `performance-engineer` | Sub-Agente | `pro` | Control Operativo | G7: Auditoría de rendimiento, Web Vitals, N+1, latencia y bundle size |
| **Verificación** | `security-review` | Sub-Agente | `pro` | Control Operativo | G4: Auditoría adversaria de seguridad y fronteras de confianza |
| **Verificación** | `code-review` | Sub-Agente | `pro` | Control Operativo | G7: Revisión Staff independiente, calidad de código y arquitectura |
| **Operaciones** | `devops` | Sub-Agente | `flash` | Táctico | CI/CD, infraestructura, Docker y pipelines de despliegue |
| **Operaciones** | `release-manager` | Sub-Agente | `pro` | Control Operativo | G8: Checklist de producción, plan de rollback y compuerta final |

> [!NOTE]
> Los verificadores (`qa-test`, `accessibility-specialist`, `observability-engineer`, `performance-engineer`, `security-review`, `code-review` y `release-manager`) operan con independencia de línea: no aprueban trabajo propio y poseen potestad de bloqueo ante incumplimiento de calidad, seguridad o estabilidad.

---

## Mapeo de Skills Normativas (16 Skills)

1. `project-context`: Todos los agentes (convenciones, contextos y reglas del proyecto).
2. `organization-governance`: `fullstack-orchestrator` (doctrina organizacional, RACI, handoffs y escalamiento).
3. `project-lifecycle`: `fullstack-orchestrator` (planificar, organizar, dirigir, controlar).
4. `software-architecture`: `fullstack-orchestrator`, `software-architect`, `code-review`, `migration-refactoring`.
5. `typescript-reliability`: `fullstack-orchestrator`, `software-architect`, `backend-application`, `frontend-architect`, `integration-specialist`, `code-review`.
6. `nextjs-architecture`: `backend-application`, `frontend-architect`.
7. `prisma-postgres`: `database-prisma`, `performance-engineer`.
8. `auth-security`: `auth-policy`, `security-review`.
9. `ui-system`: `frontend-architect`, `ui-ux`, `accessibility-specialist`.
10. `testing-quality`: `qa-test`.
11. `devops-cicd`: `devops`.
12. `integrations`: `integration-specialist`.
13. `async-systems`: `async-jobs-engineer`.
14. `observability`: `observability-engineer`.
15. `performance`: `performance-engineer`.
16. `release-engineering`: `fullstack-orchestrator`, `release-manager`, `devops`.

---

## Quality Gates Formalizados (G0 a G8)

```
G0 Requisitos (product-requirements)
      ↓
G1 Dominio (domain-architect)
      ↓
G2 Arquitectura (software-architect)
      ↓
G3 Datos (database-prisma)
      ↓
G4 Seguridad (auth-policy + security-review)
      ↓
G5 Implementación (Builders: backend, frontend, ui, integrations, async, migration)
      ↓
G6 Verificación (qa-test + accessibility-specialist + observability-engineer)
      ↓
G7 Revisión Independiente (code-review + security-review + performance-engineer)
      ↓
G8 Liberación a Producción (release-manager + devops + orquestador)
```

### Detalle de Responsabilidades por Gate:
- **G0 (Requirements)**: Requerimientos explícitos, alcance y criterios de aceptación verificables.
- **G1 (Domain)**: Entidades, límites de contexto e invariantes de negocio modeladas.
- **G2 (Architecture)**: Diseño modular, límites de componentes y ADR registrado.
- **G3 (Data)**: Esquema normalizado, migraciones expand-and-contract y queries validadas.
- **G4 (Security)**: Barreras de confianza, autenticación y autorización server-side aprobadas.
- **G5 (Implementation)**: Construcción de software tipado, desacoplado y validado en runtime.
- **G6 (Verification)**: Cobertura de tests automatizados, accesibilidad WCAG y telemetría/logs verificados.
- **G7 (Independent Review)**: Aprobación Staff de código, análisis de seguridad adversario y benchmarks de performance sin regresiones.
- **G8 (Release)**: Aprobación final con checklist de producción, changelog, verificabilidad de observabilidad y plan de rollback probado.