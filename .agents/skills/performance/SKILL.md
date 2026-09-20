---
name: performance
description: Rendimiento medido - definir el objetivo, medir línea base con percentiles, identificar el cuello de botella con evidencia, aplicar la mejora mínima y volver a medir. Cubre Core Web Vitals, bundle, red, renderizado y consultas. Úsala al investigar lentitud o revisar cambios sensibles a rendimiento.
---

# Rendimiento

## Principio

> **Mide primero. Optimizar sin medir es adivinar, y casi siempre se adivina mal.**

El cuello de botella rara vez está donde se supone. La optimización prematura agrega complejidad sin mover la métrica.

## El ciclo (no se salta ningún paso)

```
1. Objetivo → 2. Línea base → 3. Cuello de botella → 4. Mejora mínima → 5. Re-medir → 6. Decidir
                                                                              ↑__________|
```

### 1. Objetivo medible

Sin objetivo no hay "suficientemente rápido". Ejemplos verificables:

- "LCP ≤ 2,5 s en 4G simulada, móvil de gama media."
- "Bundle inicial ≤ 200 KB comprimido."
- "p95 de la consulta del historial ≤ 150 ms."

Se acuerda con el orquestador **antes** de tocar nada.

### 2. Línea base

- **Percentiles (p50/p95/p99), no promedios.** El promedio esconde la cola lenta.
- **Condiciones realistas**: dispositivos y redes representativos, no la máquina del desarrollador.
- **Varias corridas**: una sola medición es ruido.
- Registra el entorno de medición para poder reproducir.

### 3. Encontrar el cuello de botella

Con evidencia, no con intuición:

| Sospecha | Herramienta/evidencia |
|---|---|
| JavaScript pesado | Análisis de bundle (mapa de módulos), perfil de CPU |
| Renderizado lento | Perfilador de React/DevTools, grabación de rendimiento |
| Red lenta | Cascada de red, tamaño de recursos, cabeceras de caché |
| Consulta lenta | Plan de ejecución (`EXPLAIN ANALYZE`), log de consultas |
| Imágenes | Tamaño y formato reales, dimensiones |
| Terceros | Impacto de scripts externos en el hilo principal |

### 4. Mejora mínima

La más simple que mueva la métrica. Cada recomendación cita **el cuello observado** y **su trade-off**.

### 5. Re-medir

Mismas condiciones que la línea base. Si la métrica no se movió, la mejora **se revierte** (no deja complejidad inútil).

## Core Web Vitals (cliente)

| Métrica | Mide | Bueno | Palancas principales |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | Cuándo aparece el contenido principal | ≤ 2,5 s | Prioridad de la imagen/recurso principal, reducir JS bloqueante, caché, tamaño de imagen |
| **INP** (Interaction to Next Paint) | Respuesta a interacciones | ≤ 200 ms | Dividir tareas largas, reducir trabajo en el hilo principal, evitar re-renderizados masivos |
| **CLS** (Cumulative Layout Shift) | Estabilidad visual | ≤ 0,1 | Reservar espacio (dimensiones de imágenes, esqueletos), evitar inyección tardía sobre contenido |

## Bundle y carga (SPA)

- **Analiza el bundle** antes de decidir qué recortar: qué dependencia pesa y quién la importa.
- **División de código por ruta**: la landing no debería cargar el código de las pantallas de inspección.
- **Carga diferida** de lo que no se ve al inicio (modales, gráficos, editores).
- **Dependencias**: revisa el costo antes de agregar una; prefiere alternativas ligeras o la API nativa.
- **Árbol de dependencias**: importaciones nombradas para que el empaquetador elimine lo no usado.
- **Presupuesto de rendimiento** como criterio de aceptación y control en CI.

## Red

- **Caché**: cabeceras correctas para recursos estáticos con hash en el nombre (larga vida) y para el HTML (corta).
- **Compresión** (Brotli/gzip) activa.
- **Precarga** (`preload`) del recurso crítico; `preconnect` a orígenes necesarios.
- Reducir **cascadas**: solicitudes que dependen una de otra en serie.
- **Imágenes**: formato moderno, tamaños responsivos (`srcset`), carga diferida bajo el pliegue, dimensiones explícitas.
- **Fuentes**: subconjunto, `font-display`, evitar bloqueo del render.

## Renderizado (React)

- Empieza por **estado local** y evita que cambios en un punto re-rendericen todo el árbol.
- `memo`/`useMemo`/`useCallback` **solo con evidencia** de re-renderizados costosos: tienen costo propio y complejidad.
- **Listas largas**: virtualización.
- No hagas trabajo pesado en el renderizado; muévelo a efectos, memoización justificada o a un worker.
- Evita **layout thrashing** (leer y escribir el DOM alternadamente).

## Datos y consultas (si hay capa de datos)

- **N+1**: la causa más común de lentitud en listados (`skills/prisma-postgres`).
- Índices desde patrones de acceso, verificados con el plan de ejecución.
- **Paginar** siempre listas potencialmente grandes; nunca traer "todo".
- Seleccionar solo los campos necesarios.
- Caché de resultados **solo con estrategia de invalidación** y medición que lo justifique.

## Cuándo NO optimizar

- No hay objetivo incumplido: **está bien como está**.
- La mejora agrega complejidad desproporcionada al beneficio medido.
- Es una ruta que casi nadie usa.
- Se optimizaría algo que no es el cuello de botella.

## Infraestructura: última opción

Antes de proponer caché distribuida, CDN adicional, más servidores o colas: agotar las mejoras **simples y dirigidas**. La infraestructura nueva requiere **ADR** y cuesta operación permanente.

## Reportar

```markdown
- Objetivo: LCP ≤ 2,5 s (4G, móvil medio)
- Línea base: p75 LCP = 4,1 s [herramienta, fecha, condiciones]
- Cuello observado: imagen hero de 1,8 MB sin dimensiones ni carga prioritaria
- Mejora: formato moderno + tamaños responsivos + dimensiones + prioridad
- Resultado: p75 LCP = 2,2 s
- Trade-off: paso de build adicional para generar variantes
- Riesgo residual: ninguno / aceptado por ...
```

## Lista de revisión

- [ ] ¿Hay objetivo medible acordado?
- [ ] ¿Línea base con percentiles y condiciones realistas?
- [ ] ¿El cuello de botella está demostrado con evidencia?
- [ ] ¿La mejora es la más simple que mueve la métrica?
- [ ] ¿Se re-midió en las mismas condiciones?
- [ ] ¿Se reportó el trade-off?
- [ ] ¿No se agregó infraestructura sin ADR?
