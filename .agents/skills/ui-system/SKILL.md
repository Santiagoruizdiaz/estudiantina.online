---
name: ui-system
description: Sistema de UI reutilizable y accesible - tokens de diseño, componentes, HTML semántico, responsive mobile-first, cuatro estados por componente y convenciones de Tailwind/CSS Modules. Úsala al crear o modificar interfaz, formularios, tablas, navegación o diálogos.
---

# Sistema de UI

## Principio

Una interfaz profesional es **consistente, predecible y accesible**. La consistencia se logra con **un sistema** (tokens + componentes), no con disciplina individual.

> **Antes de crear, audita.** Si ya existe un componente o token que resuelve el problema, se reutiliza. Duplicar es deuda.

## Verifica las convenciones reales

No asumas la versión ni el enfoque de estilos. Confirma en el repositorio:

- Versión de Tailwind y su archivo de configuración (la sintaxis cambia entre versiones mayores).
- Si hay **CSS Modules** (`*.module.css`) coexistiendo con Tailwind, y cuál se usa para qué.
- Librería de íconos (CheckCar declara **Lucide React**).
- Componentes base ya existentes.

**Respeta lo que hay.** No migres el enfoque de estilos sin un pedido explícito.

## Tokens de diseño

Todo valor visual proviene de un **token**, no de un número mágico.

| Categoría | Ejemplos | Regla |
|---|---|---|
| Color | primario, superficie, texto, borde, éxito, peligro | Semánticos (`peligro`), no descriptivos (`rojo-500`) en componentes |
| Espaciado | escala consistente (4/8 px) | Solo valores de la escala |
| Tipografía | familia, escala de tamaños, pesos | Jerarquía clara |
| Radios y sombras | pocos valores | Consistentes |
| Movimiento | duraciones y curvas | Respetar `prefers-reduced-motion` |

## HTML semántico primero

| Necesidad | Usa | No uses |
|---|---|---|
| Acción | `<button>` | `<div onClick>` |
| Navegación | `<a href>` / `<Link>` | `<button>` que cambia de página |
| Lista | `<ul>/<ol>` | series de `<div>` |
| Encabezados | `<h1>…<h6>` en orden | Tamaños con `<div>` |
| Datos tabulares | `<table>` con `<th scope>` | Cuadrículas de `<div>` |
| Formularios | `<label for>` + `<input>` | Placeholder como etiqueta |

Los elementos nativos ya traen teclado, foco y semántica. **ARIA solo cuando lo nativo no alcanza.**

## Los cuatro estados de todo componente con datos

1. **Normal**
2. **Carga** — esqueleto que reserva espacio.
3. **Error** — recuperable, con acción, sin detalles internos.
4. **Vacío** — explica y guía.

Además: **foco visible**, **deshabilitado** distinguible (y no solo por color), **hover/activo** coherentes.

## Responsive, mobile-first

Los técnicos trabajan en el taller, muchas veces desde el celular:

- Diseña primero para pantallas pequeñas y escala hacia arriba.
- Áreas táctiles de **≥ 44×44 px**.
- Sin desplazamiento horizontal inesperado.
- Tablas anchas: patrón de desplazamiento contenido o vista de tarjetas en móvil.
- Prueba en anchos reales (320, 375, 768, 1024, 1440).

## Formularios

- Cada campo con **etiqueta visible asociada**.
- Errores **junto al campo**, asociados programáticamente (`aria-describedby`), con texto que explica **cómo corregir**.
- Validación clara: en `blur`/`submit`, no en cada pulsación agresiva.
- Estado de envío: botón deshabilitado + indicador; evita doble envío.
- Preserva lo que el usuario escribió ante un error.
- Campos requeridos marcados de forma **no solo por color**.

## Diálogos y superposiciones

- Foco atrapado dentro mientras está abierto y devuelto al disparador al cerrar.
- Cierre con `Esc` y con acción explícita.
- Fondo inerte para tecnologías de asistencia.
- Título asociado (`aria-labelledby`).

## Contraste y color

- Texto normal ≥ **4.5:1**; texto grande e íconos funcionales ≥ **3:1**.
- Nunca comunicar estado **solo con color** (añade ícono o texto).

## Composición de estilos

- **Tailwind**: extrae patrones repetidos a componentes, no a `@apply` masivo. Ordena las clases de forma consistente (usa el plugin de ordenación si el proyecto lo tiene).
- **CSS Modules**: nombres por rol, no por apariencia; un módulo por componente.
- No mezcles ambos para lo mismo dentro de un componente.

## Coordinación

- Antes de entregar, revisa con `accessibility-specialist` el **foco, etiquetas y contraste**.
- Comparte con `frontend-architect` los estados y contratos de props.

## Lista de revisión

- [ ] ¿Reutilicé componentes/tokens existentes?
- [ ] ¿Todo valor visual viene de un token?
- [ ] ¿HTML semántico antes que ARIA?
- [ ] ¿Normal, carga, error y vacío cubiertos?
- [ ] ¿Foco visible y operable por teclado?
- [ ] ¿Responsive desde móvil con áreas táctiles suficientes?
- [ ] ¿Contraste correcto y sin depender solo del color?
- [ ] ¿Respeta las convenciones reales de estilos del repo?
