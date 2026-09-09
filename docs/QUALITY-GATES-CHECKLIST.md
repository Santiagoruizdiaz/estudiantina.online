# Checklist de Quality Gates — Estudiantina.online (G0 a G8)

Este documento detalla los criterios de aceptación y verificación formal que deben cumplirse antes de autorizar el cierre de tareas y releases en `estudiantina.online`.

---

### Gate G0 — Requirements & Acceptance Criteria
- [ ] Definición clara del problema o feature solicitada.
- [ ] Criterios de aceptación comprobables documentados.
- [ ] Aprobación de `product-requirements`.

### Gate G1 — Domain Fidelity & Posadeño Context
- [ ] Coherencia con la cultura y reglamento de la Estudiantina de Posadas.
- [ ] Neutralidad y balance equitativo entre colegios participantes.
- [ ] Revisión de nomenclatura y roles por `domain-architect` usando `estudiantina-posadas-domain`.

### Gate G2 — Architecture & Dual-Runtime Parity
- [ ] Preservación del modelo modular sin bundlers pesados en frontend.
- [ ] Paridad de contratos confirmada: cualquier ruta en `server.js` tiene su equivalente idéntico en `api/*.php`.
- [ ] Registro de ADR si la decisión altera la persistencia o los flujos del sistema.
- [ ] Aprobación de `software-architect`.

### Gate G3 — Data Integrity & Concurrency
- [ ] Esquemas SQLite en `data/foro.db` actualizados con WAL mode verificado.
- [ ] Consultas parametrizadas (Prepared Statements) en todas las lecturas y escrituras.
- [ ] Archivos semilla (`*.example.json`) actualizados si cambió la estructura de datos.
- [ ] Aprobación de `database-prisma`.

### Gate G4 — Security & Trust Boundaries
- [ ] Confirmación de bloqueo de la carpeta `/data/` (retorna 403 en Node y bloqueado por `.htaccess`).
- [ ] Sanitización rigurosa de entradas de texto contra XSS (`escapeHtml`).
- [ ] Endpoints de administración protegidos por token y `ADMIN_SECRET`.
- [ ] Sin exposición de credenciales o secretos en el código fuente.
- [ ] Aprobación de `auth-policy` y `security-review`.

### Gate G5 — Implementation & Craftsmanship
- [ ] Código modular en JavaScript moderno (ES Modules).
- [ ] Variables CSS utilizadas para mantener la identidad visual homogénea.
- [ ] Sin código muerto, console.logs de depuración no estructurados ni hacks temporales.

### Gate G6 — Automated Verification & Accessibility
- [ ] Ejecución exitosa de chequeo estático: `npm run check`.
- [ ] Ejecución exitosa de suite de pruebas: `npm test` (0 fallos).
- [ ] Contraste visual adecuado (Dark Mode legible en pantallas móviles en exteriores).
- [ ] Navegación accesible por teclado y roles ARIA verificados por `accessibility-specialist`.

### Gate G7 — Independent Staff Review
- [ ] Revisión independiente de código por `code-review` (sin auto-aprobación del builder).
- [ ] Revisión adversaria de seguridad por `security-review`.
- [ ] Evaluación de impacto en tiempos de carga y latencia por `performance-engineer`.

### Gate G8 — Production Release Verification
- [ ] Verificación de diffs: `git diff --check`.
- [ ] Ejecución exitosa de `npm run quality-gate`.
- [ ] Checklist de archivos para Hostinger preparado por `devops`.
- [ ] Plan de rollback en caso de inconsistencia en SQLite o Hostinger.
- [ ] Autorización final de release por `release-manager`.
