# AGENTS.md — Equipo de Ingeniería Estudiantina.online

Este repositorio es trabajado por un **equipo de ingeniería organizado como una empresa profesional**. Si eres un agente o una persona que llega aquí, lee esto primero.

## Cómo se trabaja

1. **Todo pedido entra por `fullstack-orchestrator`**, el líder del programa técnico. Es la única interfaz con el usuario.
2. El orquestador **planifica, organiza, dirige y controla**: no ejecuta todo él mismo. Delega en especialistas con un **traspaso estructurado** y un **único responsable** por tarea.
3. **Quien construye no aprueba.** Los verificadores (calidad, seguridad, revisión de código, rendimiento, release) son independientes y **pueden bloquear**.
4. **Sin evidencia real no hay "terminado"** (comando + salida, no "debería pasar").
5. **Se escala antes que adivinar** cuando una decisión cruza datos, producción, proveedores, contratos públicos o seguridad.

## Lectura obligatoria (en este orden)

| # | Archivo | Para qué |
|---|---|---|
| 1 | `.agents/rules/00-core.md` | Qué está prohibido / es obligatorio |
| 2 | `.agents/rules/05-organization.md` | **Cómo funciona el equipo** (doctrina organizacional) |
| 3 | `.agents/governance/ORGANIZATION.md` | Organigrama, niveles, comités |
| 4 | `.agents/governance/RACI.md` | Quién es responsable de qué (un solo `A`) |
| 5 | `.agents/governance/QUALITY-GATES.md` | Gates G0–G8 |
| 6 | `.agents/governance/HANDOFF-PROTOCOL.md` | Cómo se traspasa el trabajo |
| 7 | `.agents/governance/ESCALATION.md` | Cuándo y cómo escalar |
| 8 | `.agents/contexts/PROJECT.md`, `STACK.md` | Qué es el proyecto y con qué se construye |

## Principio de verdad

> **El repositorio (`package.json`, configuración, código) es la fuente de verdad del stack.** Los contextos pueden estar vacíos o desactualizados; los prompts de los agentes describen una especialidad, no el proyecto. **Nunca asumas** Next.js, Prisma, PostgreSQL, Auth.js ni un servidor propio sin verificarlo.

Estudiantina.online declara:
- **Dual-Runtime Monolith**:
  - Desarrollo local: Node.js 22+ nativo con `node:sqlite` (`DatabaseSync`), servidor HTTP puro sin dependencias externas pesadas.
  - Producción: Servidor Apache / LiteSpeed en Hostinger con PHP 8.1+, SQLite (`pdo_sqlite` con WAL) y JSON estructurado.
- **Frontend**: Vanilla Modern JavaScript (ES Modules nativos), HTML5 semántico y CSS3 con Custom Properties (Dark Minimal / Neon posadeño), cero overhead de build.

## Resumen del proyecto

Plataforma oficial y simulador interactivo de la fiesta estudiantil de Posadas (Misiones, Argentina):
1. **Simulador de Carrera RPG/Copero**: 5 temporadas escolares para Banda de Música y Cuerpo de Baile (30+ colegios, balance dinámico de atributos OVR/RITM/DISC/COOP y Ficha Coleccionable de Egresado PNG vía html2canvas).
2. **Portal Periodístico de Comunidad**: Noticias en tiempo real, cronograma oficial 2026, categorías y panel de administración protegido.
3. **Foro de Debate Estudiantil**: Hilos por canal temático con autenticación de un clic vía Google Identity Services (OAuth 2.0 GSI), comentarios anidados, upvotes y moderación proactiva.
4. **Salón de la Fama y Rankings**: Tablas históricas por egresado y colegio.

## Setup, desarrollo y validación

Desde la raíz del proyecto (`c:\wamp64\www\proyectos\estudiantina.online`):
- Iniciar servidor de desarrollo local: `npm start` (o `node server.js` en `http://localhost:3000`)
- Validación estática de sintaxis y contratos: `npm run check` (o `npm run lint`)
- Suite de tests automatizados: `npm test`
- Ejecución de Quality Gate: `npm run quality-gate`

## Estructura de `.agents/`

```
.agents/
├── agents/         20 agentes (frontmatter + posición, contrato, procedimiento, criterios)
├── skills/         16 skills (conocimiento reutilizable) + skills locales específicas
├── workflows/      8 flujos de trabajo (nueva funcionalidad, bug, refactor, BD, API, seguridad, incidente, release)
├── governance/     Organigrama, RACI, gates, traspaso, decisión, escalamiento, ciclo de vida
├── policies/       Políticas normativas (core, arquitectura, seguridad, datos, tests, git, agentes, release)
├── rules/          Reglas que se cargan siempre
├── contexts/       Hechos del proyecto (PROJECT, STACK, etc.)
└── templates/      Plantillas (tarea, feature, ADR, endpoint, revisiones, release, postmortem)
```

## Estado actual del proyecto (brechas conocidas)

| Brecha | Consecuencia | Acción |
|---|---|---|
| Doble runtime Node ↔ PHP | Cualquier endpoint debe mantener paridad estricta entre server.js y api/ | Validación cruzada en tests |
| SQLite WAL en concurrencia de desfiles | Riesgo de contención si hay ráfagas de escritura masivas | Modo WAL activo y caché de lectura |

## Para el humano: qué te pedirá el equipo

Solo lo que **no puede decidir solo**: despliegues a producción, migraciones destructivas, proveedores nuevos, cambios de contrato público, excepciones a un gate, y las reglas de negocio ambiguas. Siempre con el formato *bloqueo → decisión afectada → opciones seguras → recomendación*.
