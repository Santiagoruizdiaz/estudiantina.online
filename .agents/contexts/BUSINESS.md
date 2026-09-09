# Business Context — Estudiantina.online

## Business Model & Mission
- **Identidad Cultural y Tradición**: La Estudiantina de Posadas es el desfile cultural y estudiantil más convocante del noreste argentino. Este proyecto preserva la historia, rivalidades sanas y folklore escolar de las escuelas técnicas, bachilleratos y colegios de la ciudad.
- **Sostenibilidad Comunitaria**: Plataforma libre de costo para los estudiantes, sustentada mediante alianzas y patrocinio oficial (e.g. Ian Navajas Barbería y auspiciantes locales) integrados de forma orgánica en la experiencia.
- **Participación Segura**: Fomentar el sentido de pertenencia y camaradería juvenil evitando la toxicidad mediante moderación y autenticación confiable.

## Actors & Roles
1. **VISITANTE (Anónimo)**:
   - Juega el simulador completo, visualiza su ficha de egresado y accede al Salón de la Fama.
   - Lee noticias y cronograma.
   - Visualiza hilos y comentarios públicos en el foro en modo solo lectura.
2. **ESTUDIANTE / USUARIO REGISTRADO (Google Auth)**:
   - Inicia sesión con su cuenta de Google mediante Google Identity Services.
   - Publica hilos en los canales del foro, comenta publicaciones de otros estudiantes y vota hilos.
   - Asocia su perfil a su colegio secundario preferido.
3. **MODERADOR**:
   - Revisa reportes de la comunidad en hilos o comentarios.
   - Oculta o despublica contenido inapropiado o agresivo.
4. **SUPERADMIN (Token / Secret)**:
   - Acceso irrestricto al panel `/api/admin`.
   - Publica, edita y elimina noticias oficiales y cronogramas.
   - Gestiona canales del foro y auditoría del ranking.

## Core Business Invariants
1. **Equidad Colegial**: Todos los colegios participantes cuentan con representación verídica de sus colores, lemas, rubros e historia.
2. **Integridad del Salón de la Fama**: Las estadísticas de egresados enviadas al ranking deben guardar coherencia con los topes de juego (OVR máximo de 99 y atributos alcanzables).
3. **Convivencia y Seguridad Juvenil**: Cero tolerancia a agresiones, discriminación o doxxing en el foro. Los reportes comunitarios ocultan preventivamente el contenido al alcanzar el umbral de denuncias.
