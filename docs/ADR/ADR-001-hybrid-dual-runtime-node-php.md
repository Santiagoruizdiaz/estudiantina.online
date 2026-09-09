# ADR-001: Arquitectura Dual-Runtime Híbrida (Node.js Nativo en Local / PHP en Hostinger)

## Estado
Aceptado

## Contexto
El portal y simulador `Estudiantina.online` está desplegado en producción sobre una infraestructura de hosting compartido optimizado (Hostinger con LiteSpeed Web Server y PHP 8.1+), mientras que el desarrollo local moderno requiere una experiencia de ejecución rápida, sin configuraciones complejas de servidores web locales (como XAMPP/WAMP obligatorios) y con herramientas de inspección en tiempo de desarrollo. Adicionalmente, el frontend debe ser accesible al instante desde dispositivos móviles con conexiones intermitentes en la costanera de Posadas.

## Decisión
1. **Doble Runtime con Paridad Estricta**:
   - Se mantiene un servidor local en Node.js 22+ nativo (`server.js`) que emula de forma idéntica la API REST de producción utilizando `node:sqlite` (`DatabaseSync`), sin necesidad de dependencias externas pesadas en NPM.
   - En producción (Hostinger), la API REST se ejecuta sobre PHP 8+ (`api/*.php`) con extensiones `pdo_sqlite` y manejo nativo de JSON.
2. **Frontend Vanilla Modular (Zero Build Step)**:
   - Se descartan empaquetadores pesados (Webpack/Vite) para la entrega web. El frontend se compone de módulos ES nativos (`import`/`export`) consumidos directamente por el navegador con `<script type="module">`.
   - Se utiliza CSS3 puro con Custom Properties (CSS variables) para mantener la velocidad de carga por debajo de 500ms.

## Consecuencias
- **Positivas**:
  - Tiempo de arranque local casi nulo (`node server.js`).
  - Cero discrepancias funcionales al verificar endpoints con tests automatizados.
  - Portabilidad total: cualquier desarrollador con Node.js puede clonar y ejecutar sin instalar librerías.
  - Máxima velocidad de carga en producción bajo LiteSpeed con compresión Gzip.
- **Negativas / Mitigaciones**:
  - Exige mantener sincronizados los contratos entre `server.js` y `api/*.php`.
  - *Mitigación*: La suite de tests automatizada (`scripts/test-runner.mjs` y `tests/api.test.mjs`) valida los contratos, y el equipo de arquitectura supervisa la paridad antes de cada release (Gate G2).
