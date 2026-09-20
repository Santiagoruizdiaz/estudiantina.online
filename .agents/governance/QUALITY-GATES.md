# Quality Gates

Los gates son **puntos de control** del proceso administrativo: convierten "creo que está bien" en "está demostrado". Cada gate tiene un **dueño**, **criterios de paso**, **evidencia requerida** y una **consecuencia si falla**.

> **Reglas absolutas**
> - **Los constructores no pueden aprobar su propio trabajo.**
> - **Los revisores pueden bloquear la finalización.**
> - Un gate solo puede saltarse por **decisión humana explícita, documentada** en el registro de la tarea/release (quién, cuándo, por qué, riesgo aceptado).

## Secuencia y dependencias

```
G0 Requisitos → G1 Dominio → G2 Arquitectura → G3 Datos ─┐
                                                G4 Seguridad ─┤→ G5 Implementación → G6 Verificación → G7 Revisión independiente → G8 Producción
```

No se entra a un gate sin haber pasado los que lo preceden y le aplican. No todo gate aplica a toda tarea: el orquestador decide cuáles según la matriz de riesgo, y **registra cuáles omitió y por qué**.

---

## G0 — Requisitos
**Dueño**: `product-requirements` · **Aplica**: siempre en trabajo nuevo o ambiguo

**Criterios de paso**
- Los requisitos son explícitos, atómicos y verificables.
- Los criterios de aceptación son **testables**.
- Lo que queda fuera de alcance está definido.
- Stakeholders e intereses en conflicto identificados.
- Las preguntas abiertas están resueltas **o escaladas**.

**Evidencia**: `docs/REQUIREMENTS.md` con criterios; lista de preguntas abiertas.
**Si falla**: no se avanza. Se aclara con el humano.

## G1 — Dominio
**Dueño**: `domain-architect` · **Aplica**: cuando cambia una regla de negocio, entidad o estado

**Criterios de paso**
- Entidades y agregados definidos.
- Invariantes de negocio **explícitas y numeradas**.
- Transiciones de estado comprendidas (legales e ilegales).
- Preguntas de dominio abiertas resueltas o escaladas.

**Evidencia**: `docs/DOMAIN.md` actualizado.
**Si falla**: se escala la regla ambigua; no se inventa.

## G2 — Arquitectura
**Dueño**: `software-architect` · **Aplica**: cuando cambian fronteras, infraestructura o hay decisión material

**Criterios de paso**
- Fronteras de módulo definidas.
- Dirección de dependencias clara.
- Trade-offs materiales con **ADR** (mínimo dos alternativas).
- Infraestructura nueva **justificada con evidencia**.
- Cada `C` afectado fue consultado.

**Evidencia**: ADR aceptado; `docs/ARCHITECTURE.md`.
**Si falla**: se replantea el diseño; si exige proveedor/infraestructura nueva, se escala.

## G3 — Datos
**Dueño**: `database-prisma` · **Aplica**: solo si hay capa de datos y cambia la persistencia

**Criterios de paso**
- El esquema es consistente con las invariantes del dominio.
- Constraints críticos presentes.
- Patrones de consulta e índices revisados.
- Migraciones **reproducibles y seguras**, clasificadas, con rollback.

**Evidencia**: migración + clasificación + salida de pruebas de integración + plan de despliegue.
**Si falla**: no se migra. Migración de producción ⇒ además aprobación humana.

## G4 — Seguridad
**Dueños**: `auth-policy` (diseño) y `security-review` (verificación independiente)

**Criterios de paso**
- La autenticación es correcta.
- La autorización se aplica **en servidor** (o en el servicio externo en un SPA).
- El aislamiento por tenant/recurso está **verificado con tests negativos**, donde aplica.
- **No hay hallazgo CRITICAL/HIGH sin resolver.**

**Evidencia**: informe `SECURITY-REVIEW.md` con veredicto PASS.
**Si falla (BLOCKED)**: **bloquea**. Solo un humano lo levanta, con excepción documentada. CRITICAL ⇒ notificación inmediata.

## G5 — Implementación
**Dueños**: builders (`backend-application`, `frontend-architect`, etc.) · **Aplica**: siempre que haya código

**Criterios de paso**
- El código sigue la arquitectura y las capas.
- **Validación en runtime** en las fronteras de confianza.
- TypeScript **estricto y coherente**.
- **Sin cambios no relacionados** (diff dentro de alcance).
- Evidencia de verificación **real** adjunta (typecheck, lint, build, tests).

**Evidencia**: retorno con formato estándar; salida de comandos.
**Si falla**: el constructor corrige dentro del presupuesto de iteración; agotado, se escala.

> **G5 lo declara el constructor pero NO se aprueba solo**: la aprobación efectiva ocurre en G6/G7 por roles distintos.

## G6 — Verificación
**Dueños**: `qa-test`, `accessibility-specialist`, `observability-engineer`

**Criterios de paso**
- Las pruebas relevantes (unidad/integración/E2E) **pasan**, con salida real.
- Las **rutas negativas críticas** están cubiertas.
- Los riesgos de accesibilidad están atendidos (teclado, foco, semántica, formularios, contraste).
- Los flujos críticos tienen **observabilidad adecuada** (logs estructurados sin datos sensibles, métricas, SLO).
- Las brechas (sin framework de tests, pruebas omitidas) están **declaradas**.

**Evidencia**: reportes de cada verificador con comando y salida.
**Si falla**: defectos clasificados al orquestador; correcciones por los constructores.

## G7 — Revisión independiente de ingeniería
**Dueños**: `code-review`, `performance-engineer`

**Criterios de paso**
- **Sin BLOCKER ni HIGH de código sin resolver.**
- Los riesgos de rendimiento están **medidos o aceptados explícitamente**.
- La implementación es mantenible y respeta las fronteras de arquitectura.

**Evidencia**: informe `CODE-REVIEW.md` con PASS; medición de rendimiento cuando aplica.
**Si falla (BLOCKED)**: bloquea la finalización; el autor corrige.

## G8 — Producción
**Dueños**: `devops`, `release-manager` · **Aprueba el despliegue**: **humano**

**Verificaciones obligatorias**
- Existe **plan de despliegue**.
- Existe **plan de migración** (si aplica).
- **Configuración de entorno completa** (variables por nombre).
- **Rollback/recuperación** definido y concreto.
- **Observabilidad y alertas operativas.**
- **Evidencia de release registrada.**

**Evidencia**: `RELEASE.md` con PASS / CONDITIONAL / BLOCKED (ver `skills/release-engineering`).
**Si falla**: no se libera.

---

## Aplicabilidad por tipo de trabajo

| Trabajo | Gates típicos |
|---|---|
| Nueva funcionalidad | G0 → G1* → G2* → G3* → G4* → G5 → G6 → G7 → G8 |
| Corrección de defecto | G5 → G6 → G7 (G4 si toca seguridad) |
| Refactor | G2* → G5 → G6 → G7 |
| Cambio de BD | G1 → G3 → G6 → G7 → G8 |
| Cambio de API | G2* → G4 → G5 → G6 → G7 |
| Auditoría de seguridad | G4 → G7 |
| Liberación | G3* → G4 → G6 → G7 → G8 |

`*` = solo si aplica a esa tarea.

## Registro de gates

El orquestador mantiene, por tarea: gate · dueño · fecha · veredicto · enlace a evidencia · (si se omitió) motivo y quién lo autorizó. Sin registro no hay auditoría.

## Regla final

- **Los constructores no pueden aprobar su propio trabajo.**
- **Los revisores pueden bloquear la finalización.**
- Un gate solo se salta por decisión humana explícita documentada.
