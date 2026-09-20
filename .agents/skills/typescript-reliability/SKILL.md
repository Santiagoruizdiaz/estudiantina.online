---
name: typescript-reliability
description: Patrones de TypeScript estricto y confiable - validación en runtime en las fronteras, DTOs explícitos, uniones discriminadas, verificaciones exhaustivas y errores tipados. Úsala al escribir o revisar cualquier código TypeScript, especialmente en bordes con datos externos.
---

# Confiabilidad en TypeScript

**Principio**: los tipos de TypeScript **desaparecen en tiempo de ejecución**. Todo dato que cruza una frontera de confianza (red, almacenamiento del navegador, parámetros de URL, respuestas de terceros, variables de entorno) es `unknown` hasta que se valida.

## Reglas

1. **`strict: true`** y sin degradarlo para "hacer pasar" código. No se desactiva una opción del compilador para resolver un error puntual.
2. **Sin `any`.** Usa `unknown` y estréchalo. Un `any` es una deuda con intereses.
3. **Sin casts inseguros** (`as X` sobre datos no validados, `as unknown as X`). Un cast afirma; no comprueba.
4. **Validar en runtime en cada frontera**, y **derivar el tipo del esquema**, no duplicarlo.
5. **Modelar estados imposibles como imposibles** (uniones discriminadas).
6. **Verificación exhaustiva** en `switch` sobre uniones.
7. **Errores como parte del tipo** en operaciones que pueden fallar de forma esperable.

## Validar en la frontera y derivar el tipo

```ts
import { z } from "zod";

const InspeccionInput = z.object({
  vehiculoId: z.string().uuid(),
  kilometraje: z.number().int().nonnegative(),
  observaciones: z.string().max(2000).optional(),
});

type InspeccionInput = z.infer<typeof InspeccionInput>; // una sola fuente de verdad

function parsear(entrada: unknown): InspeccionInput {
  return InspeccionInput.parse(entrada); // lanza si es inválido
}
```

> Usa la librería de validación que **el proyecto ya tenga**. Si no hay ninguna, no instales una sin decisión: propón opciones. Los ejemplos son ilustrativos.

## Uniones discriminadas (estados imposibles = irrepresentables)

```ts
type Inspeccion =
  | { estado: "borrador" }
  | { estado: "enCurso"; iniciadaEn: Date }
  | { estado: "cerrada"; iniciadaEn: Date; cerradaEn: Date; resultado: Resultado };

// Imposible: una inspección "cerrada" sin fecha de cierre.
```

## Exhaustividad

```ts
function nunca(x: never): never {
  throw new Error(`Caso no manejado: ${JSON.stringify(x)}`);
}

function etiqueta(i: Inspeccion): string {
  switch (i.estado) {
    case "borrador": return "Borrador";
    case "enCurso":  return "En curso";
    case "cerrada":  return "Cerrada";
    default:         return nunca(i); // si se agrega un estado, esto no compila
  }
}
```

## Errores tipados (sin excepciones genéricas filtradas)

```ts
type Resultado<T, E> = { ok: true; valor: T } | { ok: false; error: E };

type ErrorCerrar =
  | { tipo: "puntosPendientes"; faltantes: number }
  | { tipo: "yaCerrada" };

function cerrar(i: Inspeccion): Resultado<Inspeccion, ErrorCerrar> { /* ... */ }
```

El llamador **está obligado** por el compilador a manejar ambos caminos.

## Variables de entorno

- Se leen **una sola vez**, en un módulo de configuración, y se **validan al arrancar**.
- En un SPA de Vite, solo las variables con el prefijo público llegan al cliente y **todas son públicas**: jamás un secreto.
- Nunca inventes nombres: usa los que existan en el repositorio.

## Nomenclatura y estructura

- Nombres **semánticos** (qué es, no cómo se usa): `puntosPendientes`, no `arr2`.
- Un archivo, una responsabilidad. Exports nombrados salvo convención del framework.
- Tipos de dominio separados de tipos de transporte (DTO): el dominio no depende de la forma del API.

## Lista de revisión rápida

- [ ] ¿Algún `any`, `as` inseguro o `@ts-ignore` sin justificación?
- [ ] ¿Todo dato externo pasa por validación antes de usarse?
- [ ] ¿Los `switch` sobre uniones son exhaustivos?
- [ ] ¿Los errores esperables forman parte del tipo de retorno?
- [ ] ¿Las variables de entorno se validan y no exponen secretos?
- [ ] ¿El tipo se deriva del esquema en lugar de duplicarse?

## Errores típicos

| Síntoma | Causa | Remedio |
|---|---|---|
| `JSON.parse(...) as Foo` | Cast sobre dato no validado | Parsear con esquema |
| Campos opcionales por todas partes | Estados mal modelados | Unión discriminada |
| `try/catch` que traga el error | Error no tipado | `Resultado<T, E>` o error cerrado |
| Tipos duplicados entre cliente y API | Sin fuente única | Derivar del esquema compartido |
