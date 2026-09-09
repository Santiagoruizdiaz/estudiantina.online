# AGENTS.md — Estudiantina.online (Portal Oficial y Simulador de Carrera)

## Resumen del proyecto

**Estudiantina.online** es la plataforma web oficial y ecosistema interactivo de la fiesta estudiantil más representativa de Misiones (Posadas, Argentina). La plataforma centraliza cuatro pilares fundamentales:

1. **Simulador de Carrera RPG/Copero**: Experiencia interactiva de 5 temporadas escolares (1° a 5° año) para Banda de Música y Cuerpo de Baile con más de 30 colegios posadeños, toma de decisiones narrativas, balance dinámico de atributos (OVR, RITM, DISC, COOP), transferencias y generación de Ficha Coleccionable de Egresado (estilo FIFA card) exportable como imagen.
2. **Portal Periodístico de Comunidad**: Portal de noticias y cobertura en tiempo real de las noches de calle y anfiteatro, cronograma oficial 2026, categorías y panel de administración protegido.
3. **Foro de Debate Estudiantil**: Espacio de intercambio por canales temáticos con autenticación de un clic vía Google Identity Services (OAuth 2.0), hilos, respuestas anidadas, votación comunitaria (upvotes) y moderación proactiva contra la toxicidad.
4. **Salón de la Fama y Rankings**: Tablas de clasificación global y por institución que inmortalizan a los mejores egresados y colegios más laureados.

La arquitectura de referencia está construida bajo un modelo **Dual-Runtime Monolith**:
- **Desarrollo Local**: Node.js 22+ nativo con `node:sqlite` (`DatabaseSync`), servidor HTTP puro sin dependencias externas pesadas.
- **Producción**: Servidor Apache / LiteSpeed en Hostinger con PHP 8.1+, SQLite (`pdo_sqlite` con WAL) y JSON estructurado.
- **Frontend**: Vanilla Modern JavaScript (ES Modules nativos), HTML5 semántico y CSS3 con Custom Properties (estética Dark Minimal / Neon posadeño), garantizando cero overhead de build y tiempos de carga instantáneos en conexiones móviles durante los desfiles.

---

## Equipo de ingeniería

La entrada operativa única es `fullstack-orchestrator`, definido en `.agents/agents/fullstack-orchestrator.md`. Se dispone del equipo completo de 19 roles de ingeniería especializados:

- **Análisis**: `product-requirements`, `domain-architect`, `software-architect`
- **Construcción**: `database-prisma`, `auth-policy`, `backend-application`, `frontend-architect`, `ui-ux`, `integration-specialist`, `async-jobs-engineer`, `migration-refactoring`
- **Verificación**: `qa-test`, `accessibility-specialist`, `observability-engineer`, `performance-engineer`, `security-review`, `code-review`
- **Operaciones**: `devops`, `release-manager`

### Skills prioritarias para Estudiantina.online:
`estudiantina-posadas-domain`, `project-context`, `software-architecture`, `ui-system`, `auth-security`, `testing-quality`, `integrations`, `observability`, `performance`, `devops-cicd`, `release-engineering`.

---

## Setup, desarrollo y validación

Desde la raíz del proyecto (`c:\wamp64\www\proyectos\estudiantina.online`):

- **Iniciar servidor de desarrollo local**: `npm start` (o `node server.js`)
  - Disponible en `http://localhost:3000`
- **Validación estática de sintaxis y contratos**: `npm run check` (o `npm run lint`)
  - Verifica sintaxis de todos los archivos `.js` y validez de los esquemas JSON.
- **Suite de tests automatizados**: `npm test`
  - Ejecuta pruebas de integración sobre los endpoints de API y lógica unitaria de simulación.
- **Ejecución de Quality Gate**: `npm run quality-gate`
  - Dispara el stop-gate formal verificando diffs limpios y suites de validación.

---

## Arquitectura y reglas de código

1. **Paridad de Doble Runtime (Node ↔ PHP)**:
   - Todo cambio o nuevo endpoint implementado en `server.js` debe replicarse con idéntico contrato y formato de respuesta JSON en el controlador PHP correspondiente de `api/` (`ranking.php`, `comunidad.php`, `foro.php`, `admin.php`).
2. **Frontend Vanilla Modular**:
   - Sin frameworks de compilación pesados (React/Vue/Webpack). Mantener la modularidad mediante ES Modules nativos (`import`/`export`).
   - Los archivos de lógica (`js/simulador.js`, `js/colegios.js`, `js/eventos.js`, etc.) deben mantenerse desacoplados y con responsabilidades únicas.
3. **Estilos y UI**:
   - Centralización de variables de diseño (colores, espaciados, tipografías) en `:root` de `styles.css` y `css/comunidad.css`.
   - Soporte total para dispositivos móviles con diseño responsive fluido y contraste visual apto para visualización nocturna en la costanera.
4. **Persistencia y Concurrencia**:
   - Base de datos SQLite (`data/foro.db`) siempre con `PRAGMA journal_mode = WAL;` para evitar bloqueos entre lecturas y escrituras concurrentes.
   - Manejo de Prepared Statements en todas las consultas tanto en Node (`node:sqlite`) como en PHP (`PDO`).
   - Archivos JSON versionados mediante semillas (`ranking.example.json`, `comunidad.example.json`).

---

## Seguridad y políticas

1. **Aislamiento de Almacenamiento**:
   - La carpeta `/data/` debe permanecer completamente inaccesible desde el navegador web. Protegida por `.htaccess` en Hostinger y bloqueada con `403 Forbidden` en `server.js`.
2. **Autenticación y Autorización**:
   - Foro: Validación de identidad mediante Google OAuth (GSI).
   - Administración: Panel protegido mediante `ADMIN_SECRET` y tokens de sesión; contraseñas administrativas hasheadas mediante PBKDF2/SHA256 con salt.
3. **Inmunidad contra XSS y Sanitización**:
   - Toda entrada de usuario (títulos de hilos, comentarios, nombres de egresados) debe ser saneada mediante `escapeHtml()` antes de persistirse o renderizarse en el DOM.
4. **Operaciones Protegidas**:
   - Modificaciones de esquema en base de datos, reseteo de rankings o despliegues a Hostinger requieren confirmación y paso por los gates de seguridad.

---

## Flujo de contribución y Quality Gates (G0 a G8)

Todo cambio o funcionalidad debe seguir la secuencia formal de gates:

```text
G0 (Requirements) -> G1 (Domain) -> G2 (Architecture) -> G3 (Data) ->
G4 (Security) -> G5 (Implementation) -> G6 (Verification) -> G7 (Review) -> G8 (Release)
```

- **G0 Requirements**: Criterios de aceptación claros redactados por `product-requirements`.
- **G1 Domain**: Validación de fidelidad cultural y coherencia con la Estudiantina por `domain-architect`.
- **G2 Architecture**: Preservación de la paridad dual-runtime y modularidad por `software-architect`.
- **G3 Data**: Integridad de esquemas SQLite y archivos JSON por `database-prisma`.
- **G4 Security**: Validación de barreras de confianza y saneamiento por `auth-policy` y `security-review`.
- **G5 Implementation**: Construcción limpia por los Builders correspondientes.
- **G6 Verification**: Suite de pruebas y validación estática exitosa por `qa-test` y `accessibility-specialist`.
- **G7 Independent Review**: Aprobación Staff independiente por `code-review`, `security-review` y `performance-engineer`.
- **G8 Production Release**: Checklist de entrega para Hostinger por `release-manager` y `devops`.

Antes de dar por concluida cualquier intervención técnica:
- Ejecutar `git diff --check`.
- Ejecutar `npm run check` y `npm test`.
- Confirmar que ningún Builder apruebe su propio trabajo sin la validación de los reviewers independientes.
