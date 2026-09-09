# Observability Context — Estudiantina.online

## Logging Standards
- **Local Dev Server (`server.js`)**:
  - Salida estructurada en consola con timestamp ISO, método HTTP, URL solicitada, código de estado y duración en milisegundos.
  - Registro de excepciones y errores de parsing con detalles en stderr sin volcar secretos.
- **Production (PHP Hostinger)**:
  - Errores de API registrados en los logs de error de Apache/LiteSpeed sin exponer trazas de depuración a los clientes HTTP.

## Key Metrics to Monitor
1. **Participación en el Simulador**: Total de partidas jugadas, fichas de egresado guardadas y ranking de colegios más seleccionados.
2. **Actividad en Comunidad y Foro**: Volumen de hilos creados por canal, tasa de upvotes, comentarios y noticias más leídas.
3. **Rendimiento de Servidor**: Latencia en endpoints de lectura durante las noches de calle de la Estudiantina (picos de tráfico).
4. **Moderación**: Número de reportes de contenido atendidos y comentarios ocultados preventivamente.
