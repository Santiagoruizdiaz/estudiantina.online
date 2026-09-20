---
name: nextjs-architecture
description: Arquitectura de aplicaciones React según el framework REAL del proyecto - Next.js App Router (Server/Client Components) o SPA con Vite y React Router (límites de carga y de confianza). Úsala al estructurar rutas, decidir dónde corre el código, manejar datos y diseñar estados de carga/error.
---

# Arquitectura React según el framework real

> **Primer paso obligatorio: detectar cuál de los dos mundos aplica.** Los patrones de uno son errores en el otro. Consulta `skills/project-context`.

| Evidencia | Mundo |
|---|---|
| Dependencia `next`, carpeta `app/` | **A — Next.js App Router** |
| `vite` + `react-router*`, sin `next` | **B — SPA (Vite + React Router)** |

CheckCar declara **Vite 6 + React 18.3 + React Router 7** → es el **mundo B**, salvo que el repositorio demuestre otra cosa.

---

## Mundo B — SPA con Vite + React Router

### Realidad fundamental
**Todo el código corre en el navegador.** Por lo tanto:

- **No existe "el servidor" propio.** No hay Server Components, Server Actions ni Route Handlers.
- **Nada del bundle es secreto.** Toda variable expuesta al cliente es pública; cualquier "clave" en el código cliente es de conocimiento público.
- **El cliente nunca es de confianza.** Lo crítico (autorización real, reglas de negocio irrevocables, validación definitiva) vive en un servicio externo.

### Dos límites que reemplazan a "servidor/cliente"

1. **Límite de carga** — *qué se carga y cuándo*: código por ruta, datos por ruta, recursos pesados diferidos.
2. **Límite de confianza** — *qué se puede creer*: lo que el cliente hace es una conveniencia de interfaz, no un control.

### Estructura de rutas y carga

- Divide por ruta con **carga diferida** (`React.lazy` + `Suspense`, o la API de carga de rutas del router) para reducir el bundle inicial.
- Precarga la ruta siguiente probable en interacción (hover/foco), no antes.
- Mantén el JavaScript de la landing separado del de las pantallas de inspección: son públicos y objetivos distintos.
- Las rutas exponen **parámetros tipados y validados** (los parámetros de URL son entrada no confiable).

### Estado

| Tipo de estado | Dónde vive |
|---|---|
| Local a un componente | `useState`/`useReducer` en ese componente |
| Compartido por un subárbol | Elevar al ancestro común o contexto **acotado** |
| **Datos remotos** (del servidor) | Capa de caché de datos remotos (no en estado global manual) |
| Derivable | **No se guarda**: se calcula |
| Formulario | Estado del formulario, con validación |
| URL (filtros, paginación, pestañas) | La URL es un estado; hazla la fuente de verdad |

Regla: **el estado más local que funcione.** El estado global es el último recurso.

### Los tres estados de toda vista con datos

Diseñarlos **desde el inicio**, no como parche:

| Estado | Requisito |
|---|---|
| **Carga** | Esqueleto que reserva el espacio (evita saltos de diseño) |
| **Error** | Mensaje comprensible, **acción de reintento**, sin filtrar detalles internos |
| **Vacío** | Explica por qué está vacío y **guía la siguiente acción** |

Añade **límites de error** (`ErrorBoundary`) por sección crítica para que un fallo no derribe toda la aplicación.

### Rendimiento (mide antes de optimizar)

- Presupuesto de bundle inicial y **Core Web Vitals** (LCP, INP, CLS) como criterios de aceptación.
- Imágenes: dimensiones explícitas, formato moderno, carga diferida bajo el pliegue.
- Evita re-renderizados masivos: estado local, `memo` **solo con medición**, listas grandes virtualizadas.
- No optimices sin perfil: la mayoría de los "problemas de rendimiento" no están donde se supone.

### Seguridad en el cliente

- Sin secretos ni lógica de confianza.
- Sanitizar todo HTML dinámico; evitar `dangerouslySetInnerHTML` con contenido no confiable.
- Enlaces externos con `rel="noopener noreferrer"`.
- Autorización de UI (ocultar botones) ≠ control de acceso: siempre hay respaldo en el servicio.

---

## Mundo A — Next.js App Router

- **Prefiere Server Components.** Marca `"use client"` solo donde haya interactividad del navegador (eventos, estado, efectos, APIs del navegador).
- Mantén la **lógica de servidor y los secretos en el servidor** (`server-only`); un Client Component nunca importa código de servidor.
- **Mutaciones** vía Server Actions o Route Handlers, con validación en runtime y autorización en cada una.
- Diseña **`loading`, `error` y estados vacíos** con los archivos/convenciones del framework.
- Contratos de datos explícitos y tipados entre servidor y cliente (solo datos serializables).
- Cachea con intención: sabe qué se cachea, por cuánto y cómo se invalida.

---

## Errores típicos por confundir los mundos

| Error | Por qué está mal |
|---|---|
| Proponer Server Components en un SPA | No existen; no hay servidor que los ejecute |
| Poner una clave de API "privada" en una variable `VITE_*` | Termina en el bundle, pública |
| Decidir permisos solo ocultando un botón | El cliente es manipulable |
| Estado global para todo | Complejidad y re-renderizados innecesarios |
| Sin estado de error/vacío | UX rota en el primer fallo real |

## Lista de revisión

- [ ] ¿Detecté el framework real antes de aplicar patrones?
- [ ] ¿Cada vista con datos tiene carga, error y vacío?
- [ ] ¿El estado vive lo más local posible?
- [ ] ¿No hay secretos ni decisiones de confianza en el cliente?
- [ ] ¿El bundle inicial está medido y acotado?
- [ ] ¿Los parámetros de ruta y las respuestas externas están validados?
