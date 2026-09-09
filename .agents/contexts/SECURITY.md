# Security Context — Estudiantina.online

## Access Control & Trust Boundaries
1. **Protección de la carpeta `/data/`**:
   - En Apache/LiteSpeed: `.htaccess` con regla `Deny from all` para bloquear cualquier intento de acceso directo vía HTTP a `data/*.json` y `data/*.db`.
   - En Node.js local: `server.js` rechaza con `403 Forbidden` cualquier petición cuya ruta comience con `/data/`.
2. **Google OAuth Verification**:
   - Las acciones de usuario en el foro validan el identificador de Google y el token emitido para prevenir suplantación de identidad.
3. **Panel de Administración Protegido**:
   - Todo endpoint administrativo en `/api/admin` requiere cabecera `Authorization: Bearer <TOKEN>` o token válido en payload.
   - Las contraseñas de administradores nunca se guardan en texto plano; se utiliza PBKDF2 con salting criptográfico.

## Input Sanitization & XSS Prevention
- Todas las entradas de texto en hilos y comentarios del foro se escapan o sanitizan antes de almacenarse y antes de renderizarse en el cliente mediante `escapeHtml()`.
- Prohibición de inyectar HTML arbitrario en el DOM sin saneamiento.

## SQL Injection Immunity
- Todas las consultas a SQLite en `server.js` usan Prepared Statements (`stmt.all()`, `stmt.run()`).
- Todas las consultas a SQLite en `api/foro.php` y `api/admin.php` usan PDO con Prepared Statements y parámetros vinculados.

## Rate Limiting & Anti-Spam
- Limitación de frecuencia en la creación de comentarios y emisión de votos para evitar flooding de bots.
- Sistema de reportes: múltiples denuncias sobre un comentario lo ocultan automáticamente hasta revisión humana.
