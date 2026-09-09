# Environments Context — Estudiantina.online

## Environments Lifecycle
1. **Local Development**:
   - URL: `http://localhost:3000`
   - Runtime: Node.js 22+ (`npm start` o `node server.js`)
   - Datos: `data/ranking.json` y SQLite local en `data/foro.db` (inicializados desde `data/*.example.json` si no existen).
   - Variables de entorno: `PORT` (default: 3000), `ADMIN_SECRET`.
2. **Production (Hostinger)**:
   - URL: `https://estudiantina.online`
   - Hosting: Hostinger Web Hosting con LiteSpeed y PHP 8.1+
   - Directorio raíz: `public_html/`
   - Protección: `.htaccess` activo con bloqueo estricto de `/data/`, forzado de HTTPS, compresión gzip y cabeceras de seguridad.

## Release Checklist
- Verificar que las modificaciones a `server.js` estén reflejadas en `api/*.php`.
- Validar sintaxis con `npm run check` y pasar la suite de pruebas con `npm test`.
- Asegurarse de no subir el archivo `data/foro.db` de desarrollo a producción (conservar la base de datos real del servidor).
