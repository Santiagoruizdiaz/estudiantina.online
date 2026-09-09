# ADR-003: Arquitectura del Motor de Simulación Narrativa de Carrera (Estilo Copero)

## Estado
Aceptado

## Contexto
El juego de simulación de carrera busca replicar la experiencia escolar de un estudiante participante de la Estudiantina a lo largo de su trayectoria secundaria en Posadas. El diseño debe contemplar:
- Diferencias de duración según el tipo de colegio (5 años en colegios regulares vs 6 años en escuelas técnicas con talleres).
- Múltiples rubros (Banda de Música y Cuerpo de Baile).
- Decisiones con riesgo y recompensa probabilística.
- Generación de una recompensa tangible al completar la carrera: la Ficha de Egresado (Card coleccionable estilo FIFA) lista para compartir en redes.

## Decisión
1. **Motor de Estados y Eventos Desacoplado (`js/simulador.js`)**:
   - Se implementa una clase orientada a objetos / máquina de estados que gestiona los atributos del jugador (`overall`, `ritmo`, `hinchada`, `resistencia`), el año actual, el colegio activo y el historial de títulos y logros.
   - Las decisiones narrativas se desacoplan en bancos de eventos (`js/eventos.js` y `js/eventos_baile.js`) clasificados por fases: Ensayos, Pruebas Piloto, Noches de Calle y Anfiteatro.
2. **Sistema de Logros y Progresión**:
   - Logros desbloqueables en runtime evaluados tras cada noche y al concluir la carrera (`egresado_oro`, `dueno_costanera`, `bicampeon`, `copa_challenger`, etc.).
3. **Exportación Gráfica del Cliente**:
   - Integración ligera de `html2canvas` vía CDN para rasterizar en el navegador el nodo DOM de la tarjeta de egresado a un blob PNG, permitiendo descarga directa sin sobrecargar el servidor.

## Consecuencias
- **Positivas**:
  - Experiencia inmersiva y rejugable con alta viralidad en redes sociales.
  - Gran fidelidad a la cultura estudiantil posadeña.
  - Arquitectura orientada a datos que permite añadir nuevos eventos o colegios sin alterar la lógica de cálculo.
- **Negativas / Mitigaciones**:
  - `html2canvas` requiere fuentes tipográficas cargadas y renderizado CSS consistente.
  - *Mitigación*: Tipografías con `font-display: swap` y estilos probados en navegadores móviles (Chrome, Safari, Firefox).
