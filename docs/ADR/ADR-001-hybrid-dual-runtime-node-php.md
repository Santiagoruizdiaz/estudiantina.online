# ADR-001: Arquitectura Dual-Runtime Híbrida (Node.js Nativo en Local / PHP en Hostinger)

## Estado
Aceptado (Actualizado con Políticas de Seguridad de Paridad Estricta)

## Contexto
El portal y simulador `Estudiantina.online` está desplegado en producción sobre una infraestructura de hosting compartido optimizado (Hostinger con LiteSpeed Web Server y PHP 8.1+), mientras que el desarrollo local moderno requiere una experiencia de ejecución rápida, sin configuraciones complejas de servidores web locales (como XAMPP/WAMP obligatorios) y con herramientas de inspección en tiempo de desarrollo. Adicionalmente, el frontend debe ser accesible al instante desde dispositivos móviles con conexiones intermitentes en la costanera de Posadas.
Ante los hallazgos de seguridad (VULN-01 a VULN-26), se requiere reforzar la paridad no solo a nivel funcional, sino también en las políticas de seguridad (Autenticación, Sanitización y Bloqueo de rutas).

## Decisión
1. **Doble Runtime con Paridad Estricta Funcional y de Seguridad**:
   - Se mantiene un servidor local en Node.js 22+ nativo (`server.js`) que emula de forma idéntica la API REST de producción utilizando `node:sqlite` (`DatabaseSync`), sin necesidad de dependencias externas pesadas en NPM.
   - En producción (Hostinger), la API REST se ejecuta sobre PHP 8+ (`api/*.php`) con extensiones `pdo_sqlite` y manejo nativo de JSON.
   - **Verificación de Google ID Token**: Ambos entornos deben implementar un protocolo de verificación (usando `oauth2.googleapis.com/tokeninfo`) extrayendo la identidad canónica `sub`, con soporte mock en entornos de prueba para no romper la suite de CI (VULN-03).
   - **Servidor Estático Node.js Seguro**: Normalización de rutas con `path.resolve` y verificación `startsWith(__dirname + path.sep)` para prevenir Path Traversal (VULN-14). Se bloqueará explícitamente el acceso a dotfiles (`.env`, `.git/`) y extensiones sensibles (`.db`, `.sql`, `.log`) (VULN-06).
   - **Sanitización y Whitelisting**: Aplicar validaciones de whitelist (ej. lista estática de colegios en `ranking.php` y `server.js` - VULN-10) y escape/sanitización exhaustivo de entradas en el backend para mitigar XSS, renderizando de forma segura en el frontend (`js/noticia.js` - VULN-05).
2. **Frontend Vanilla Modular (Zero Build Step)**:
   - Se descartan empaquetadores pesados (Webpack/Vite) para la entrega web. El frontend se compone de módulos ES nativos (`import`/`export`) consumidos directamente por el navegador con `<script type="module">`.
   - Se utiliza CSS3 puro con Custom Properties (CSS variables) para mantener la velocidad de carga por debajo de 500ms.

## Consecuencias
- **Positivas**:
   - Tiempo de arranque local casi nulo (`node server.js`).
   - Cero discrepancias funcionales y de seguridad al verificar endpoints con tests automatizados.
   - Portabilidad total: cualquier desarrollador con Node.js puede clonar y ejecutar sin instalar librerías.
   - Máxima velocidad de carga en producción bajo LiteSpeed con compresión Gzip.
- **Negativas / Mitigaciones**:
   - Exige mantener sincronizados los contratos y las validaciones defensivas entre `server.js` y `api/*.php`.
   - *Mitigación*: La suite de tests automatizada (`scripts/test-runner.mjs` y `tests/api.test.mjs`) valida los contratos de seguridad, y el equipo de arquitectura supervisa la paridad antes de cada release (Gate G2).
