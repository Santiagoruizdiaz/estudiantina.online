# Project Context — Estudiantina.online

## Product
- **Name**: Estudiantina de Posadas — Portal Oficial y Simulador de Carrera Escolar
- **Purpose**: Plataforma digital interactiva y portal web de la Estudiantina de Posadas (Misiones, Argentina). Integra un simulador de carrera RPG/Copero de 5 temporadas para Banda de Música y Cuerpo de Baile, un portal periodístico de noticias con cronograma oficial 2026, un foro de debate juvenil con autenticación Google OAuth (GSI), y un Salón de la Fama con rankings históricos y fichas coleccionables de egresados.
- **Primary Users**:
  - **Estudiantes Posadeños**: Jugadores del simulador, miembros de bandas y cuerpos de baile de más de 30 colegios (Janssen, Industrial, Normal Mixta, Comercio 6, Santa María, Roque González, etc.).
  - **Comunidad y Familias**: Seguidores del cronograma de noches de calle y anfiteatro Manuel Antonio Ramírez, lectores de noticias y debates en el foro.
  - **Directores y Asesores**: Representantes de colegios y directores de banda/baile que consultan estadísticas, historia y eventos.
  - **Administradores y Moderadores**: Gestores de contenido encargados de redactar noticias, moderar hilos/comentarios en el foro y supervisar los rankings.

## Critical Flows
1. **Simulador de Carrera Escolar**:
   - Selección de rubro (Banda de Música o Cuerpo de Baile).
   - Selección de Colegio (30+ instituciones posadeñas) y Rol (Director, Rumbera, Redoblante, Trompeta, etc.).
   - 5 años de trayectoria escolar con toma de decisiones narrativas, cálculo dinámico de atributos (OVR, COOP, RITM, DISC), transferencias y eventos de noche de calle.
   - Generación de Ficha Coleccionable de Egresado (estilo FIFA card), exportación en imagen PNG vía html2canvas y persistencia en el Salón de la Fama.
2. **Portal Periodístico de Comunidad**:
   - Carga dinámica de noticias desde API/JSON con filtrado por categorías, tags y búsqueda.
   - Detalle de noticia con tiempo de lectura, galería de imágenes y bloques interactivos.
3. **Foro de Debate Estudiantil**:
   - Inicio de sesión transparente mediante Google Identity Services (OAuth 2.0).
   - Creación de hilos por canal, comentarios anidados, votación (upvotes) y reportes de moderación.
4. **Panel de Administración**:
   - Autenticación segura mediante clave/token (`ADMIN_SECRET`).
   - CRUD completo de noticias, edición de cronograma, moderación de hilos/comentarios reportados y gestión de rankings.

## Scale & Performance Targets
- **Target Response Time**: P95 < 80ms para llamadas a la API de lectura (ranking, noticias, foro).
- **Zero-Dependency Lightweight Client**: Arquitectura vanilla sin bundlers pesados, optimizada para conexiones móviles 3G/4G en la costanera durante las noches de desfile.
- **High Concurrency Readiness**: SQLite en modo WAL y endpoints optimizados para soportar picos masivos de tráfico concurrentes durante los fines de semana de desfile.
- **Availability Target**: 99.9% uptime.
