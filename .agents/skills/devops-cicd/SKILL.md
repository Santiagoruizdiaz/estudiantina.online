---
name: devops-cicd
description: CI/CD y operación - pipeline que valida lint/typecheck/tests/build, separación de entornos, manejo de secretos por nombre, despliegue reversible, health checks, respaldos y rollback. Úsala al diseñar pipelines, preparar despliegues o documentar entornos.
---

# DevOps y CI/CD

## Principio

> **Un despliegue debe ser aburrido: repetible, verificable y reversible.** La emoción en un despliegue es señal de que falta proceso.

## 1. Inspeccionar antes de proponer

No inventes la plataforma. Registra hechos con fuente:

- `package.json` → `scripts`, `engines`, gestor (`packageManager`, lockfile).
- Configuración de CI existente (`.github/workflows/`, `.gitlab-ci.yml`, etc.).
- Configuración de despliegue (archivos de la plataforma), variables referenciadas en el código.
- CheckCar declara: **Node 18+**, **npm/pnpm**, **`tsc`** (typecheck) y **`vite build`** (build). Eso es la base real.

## 2. Pipeline mínimo

Falla rápido: lo barato primero.

```
instalar (lockfile congelado) → lint → typecheck → tests → build → (artefacto)
```

| Etapa | Propósito | Nota |
|---|---|---|
| Instalación reproducible | Mismas versiones que en local | `npm ci` / `pnpm install --frozen-lockfile` |
| **Lint** | Estilo y errores estáticos | Si el proyecto tiene linter |
| **Typecheck** | Corrección de tipos | `tsc --noEmit` |
| **Tests** | Comportamiento | Si existe runner; si no, declarar la brecha |
| **Build** | Se puede empaquetar | `vite build` |
| Auditoría de dependencias | Vulnerabilidades conocidas | Informativo o bloqueante según política |

- **Caché** de dependencias para acelerar.
- **Un pipeline que no puede fallar no valida nada**: no uses `|| true` ni `continue-on-error` para tapar fallos.
- Los pasos **obligatorios bloquean** el merge.

## 3. Entornos

| Entorno | Propósito | Reglas |
|---|---|---|
| **Desarrollo** | Trabajo local | Datos ficticios; secretos propios |
| **Preview/Staging** | Verificar antes de producción | Lo más parecido a producción; datos no reales |
| **Producción** | Usuarios reales | Acceso restringido; cambios controlados |

- **Separación estricta**: credenciales, datos y recursos distintos por entorno.
- Nunca datos reales de producción en desarrollo/staging.
- La **paridad** entre entornos reduce sorpresas.

### Variables de entorno

- Se documentan **solo los nombres**, con propósito y entorno donde aplican, en `contexts/ENVIRONMENTS.md`. **Jamás el valor.**
- En un SPA de Vite: solo las variables con el prefijo público se incluyen en el bundle y **son públicas**. Nunca un secreto ahí.
- **Validar al arrancar**: la app falla rápido y claro si falta una variable requerida.
- Un `.env.example` con **nombres y valores de ejemplo falsos** documenta lo necesario; el `.env` real **no se versiona**.

## 4. Secretos

- Fuera del repositorio, siempre. Gestor de secretos de la plataforma/CI.
- **Nunca** en logs, salidas de CI, capturas, tests ni mensajes.
- Enmascarados en los registros del pipeline.
- **Rotación** sin cambio de código.
- **Si un secreto se filtró**: revocar y rotar de inmediato; borrarlo del historial no basta.
- Principio de mínimo privilegio en las credenciales de CI/despliegue.

## 5. Despliegue reversible

**Regla**: antes de desplegar, saber **cómo volver atrás**.

| Estrategia | Idea | Rollback |
|---|---|---|
| **Artefacto inmutable versionado** | Cada release es un build fijo | Redesplegar la versión anterior |
| **Blue/green** | Dos entornos; se conmuta el tráfico | Reconmutar |
| **Canario/progresivo** | Un % del tráfico a la versión nueva | Retirar el canario |
| **Feature flags** | Código desplegado, función apagada | Apagar el flag |

Para un SPA estático: **artefactos inmutables con hash en el nombre** + `index.html` sin caché larga permite volver a la versión anterior sin invalidar nada complejo.

### Migraciones en el despliegue

Son operaciones **controladas**, no rutina. Si hay capa de datos: expand-and-contract, aplicadas **antes** del código que las requiere y compatibles con la versión anterior (`skills/prisma-postgres`). **Producción exige aprobación humana.**

## 6. Verificación posterior al despliegue

- **Health checks**: la aplicación responde y sus dependencias críticas están accesibles.
- **Humo (smoke test)** de los recorridos críticos tras desplegar.
- Observa las métricas/alertas de los primeros minutos (`skills/observability`).
- Si algo se degrada: **rollback primero, diagnosticar después.**

## 7. Respaldos y recuperación (si hay datos)

- Respaldos automáticos y **restauración probada** (un respaldo que nunca se restauró es una suposición).
- Objetivos definidos: **RPO** (cuántos datos se pueden perder) y **RTO** (cuánto tarda recuperar).
- Respaldos cifrados y con acceso restringido.

## 8. Operaciones que exigen aprobación humana

Nunca autónomas:

- Despliegue a **producción**.
- Comandos **destructivos** de base de datos.
- **Force-push** o reescritura de historial.
- Cambios de **infraestructura de producción**.
- **Acceso directo a secretos.**

## 9. Evidencia de despliegue

Registra: versión/commit desplegado, quién/qué lo disparó, hora, resultado de la verificación posterior, enlace al pipeline. Sin esto, no hay auditoría (`RELEASE-POLICY`: "Deployment evidence must be captured").

## Lista de revisión

- [ ] ¿Inspeccioné la configuración real en vez de asumir plataforma?
- [ ] ¿El pipeline valida lint, typecheck, tests y build, y bloquea el merge si falla?
- [ ] ¿Entornos y credenciales separados?
- [ ] ¿Variables documentadas por nombre, sin valores, y validadas al arrancar?
- [ ] ¿Cero secretos en repo, logs y bundle?
- [ ] ¿Existe un rollback concreto y factible?
- [ ] ¿Hay verificación posterior al despliegue?
- [ ] ¿Se registró la evidencia?
- [ ] ¿Producción/migraciones/infra cuentan con aprobación humana?
