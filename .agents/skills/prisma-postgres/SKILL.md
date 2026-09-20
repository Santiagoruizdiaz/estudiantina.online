---
name: prisma-postgres
description: Modelado y operación de datos relacionales con Prisma/PostgreSQL - invariantes como constraints, índices por patrón de acceso, N+1, transacciones cortas y migraciones seguras con expand-and-contract. Úsala solo cuando el proyecto TENGA capa de datos; si no la tiene, escala.
---

# Datos relacionales (Prisma / PostgreSQL)

## Condición previa (crítica)

> **Esta skill solo aplica si el repositorio tiene capa de datos.** Verifícalo: dependencia `prisma`/`@prisma/client`, `schema.prisma`, o el ORM/BaaS equivalente.

Si el proyecto **no** tiene base de datos y se pide persistencia, **no la introduzcas**. Es una decisión de arquitectura con proveedor nuevo: **escala** (`ESCALATION.md`) con opciones y ADR. CheckCar hoy no declara base de datos en sus contextos.

Si el proyecto usa otro motor u ORM, **traduce los principios** (constraints, índices, transacciones, migraciones) a esa herramienta; no fuerces Prisma.

## Principio

**La base de datos es el último guardián de la integridad.** Una regla que solo vive en el código de aplicación se viola con la primera escritura que no pase por él (un script, una migración, otro servicio, un bug).

## 1. Invariantes como constraints

| Invariante | Mecanismo |
|---|---|
| Campo obligatorio | `NOT NULL` (en Prisma, campo no opcional) |
| Unicidad | `@unique` / `@@unique([a, b])` |
| Dominio de valores | `CHECK` (vía SQL en migración) o `enum` |
| Relación válida | Clave foránea con acción explícita (`onDelete`) |
| Estado válido | `enum` + `CHECK` de transiciones cuando el motor lo permita |

Lo que **no** se pueda expresar como constraint se protege en la aplicación **y se documenta** como invariante no garantizada por la DB.

```prisma
model Inspeccion {
  id          String   @id @default(uuid())
  vehiculoId  String
  estado      EstadoInspeccion @default(BORRADOR)
  cerradaEn   DateTime?
  vehiculo    Vehiculo @relation(fields: [vehiculoId], references: [id], onDelete: Restrict)

  @@index([vehiculoId, estado])
}

enum EstadoInspeccion { BORRADOR EN_CURSO CERRADA ARCHIVADA }
```

> Ejemplo ilustrativo. El esquema real lo define el dominio (`domain-architect`).

## 2. Índices desde patrones de acceso

Un índice se justifica por una **consulta concreta**, no por intuición.

1. Lista las consultas frecuentes/críticas (filtros, ordenamientos, uniones).
2. Diseña el índice que las sirve (el orden de columnas importa: igualdad primero, luego rango/orden).
3. Verifica con el plan de ejecución (`EXPLAIN (ANALYZE, BUFFERS)`) **antes y después**.
4. Cada índice cuesta escritura y espacio: **documenta por qué existe**.

## 3. Evitar N+1

Síntoma: una consulta para la lista + una por cada elemento.

- Usa `include`/`select` con relaciones, o carga por lotes (`where: { id: { in: ids } }`).
- Selecciona **solo los campos necesarios** (`select`).
- Detéctalo con el log de consultas en desarrollo; un test que cuente consultas evita regresiones.

## 4. Transacciones

- **Cortas.** Cuanto más dura una transacción, más bloqueos y más contención.
- **Nunca** una llamada externa lenta (HTTP, correo, pago) **dentro** de una transacción.
- Define el **nivel de aislamiento** necesario; el predeterminado no siempre basta para invariantes entre filas.
- Operaciones que deben ser atómicas con un mensaje/evento externo → **outbox transaccional** (ver `skills/async-systems`).
- Maneja **conflictos de concurrencia** (bloqueo optimista con versión o `SELECT … FOR UPDATE` cuando corresponda).

## 5. Migraciones seguras

### Clasificar antes de escribir

| Clase | Ejemplo | Riesgo |
|---|---|---|
| **Aditiva compatible** | Nueva tabla, columna nullable, índice `CONCURRENTLY` | Bajo |
| **Breaking** | Renombrar/eliminar columna, cambiar tipo, agregar `NOT NULL` sin default | Alto |
| **Destructiva** | `DROP`, `TRUNCATE`, pérdida de datos | Crítico → aprobación humana |

### Expand-and-contract (para breaking)

1. **Expandir**: agrega lo nuevo sin quitar lo viejo (columna nueva nullable).
2. **Doble escritura / migración de datos**: la app escribe ambas; se rellena lo histórico por lotes.
3. **Cambiar lectura** a lo nuevo. Verificar en producción.
4. **Contraer**: retira lo viejo **solo cuando nada lo usa** (con evidencia).

Cada paso es **desplegable y reversible por separado**.

### Reglas

- Las migraciones son **reproducibles** (mismo resultado desde cero y sobre el estado actual).
- Nunca edites una migración ya aplicada; crea una nueva.
- Índices grandes en tablas vivas: `CREATE INDEX CONCURRENTLY`.
- Toda migración con **plan de rollback/recuperación** documentado.
- **Una migración que toca producción exige aprobación humana explícita.**

## 6. Seeds y datos de prueba

- Los seeds son **datos ficticios**. Nunca copies datos reales de propietarios o vehículos a desarrollo.
- Deterministas y reproducibles.

## 7. Pruebas de datos

- **Integración** contra una base real (no un mock del ORM) para constraints, transacciones y consultas.
- Prueba **el camino de violación**: intentar insertar un dato que rompe la invariante debe **fallar**.
- Prueba la migración hacia adelante y, cuando sea factible, la recuperación.

## Lista de revisión

- [ ] ¿El proyecto realmente tiene capa de datos?
- [ ] ¿Las invariantes críticas son constraints?
- [ ] ¿Cada índice cita la consulta que sirve?
- [ ] ¿Sin N+1 en las rutas críticas?
- [ ] ¿Transacciones cortas y sin llamadas externas?
- [ ] ¿Migración clasificada, con expand-and-contract si es breaking y con rollback?
- [ ] ¿Aprobación humana si toca producción o destruye datos?

## Errores típicos

| Error | Remedio |
|---|---|
| Validar unicidad solo en código | `@unique` en el esquema |
| `DROP COLUMN` directo | Expand-and-contract |
| Índice "por si acaso" | Justificar con consulta y `EXPLAIN` |
| Enviar correo dentro de la transacción | Outbox + worker |
| Mockear el ORM en tests de persistencia | Prueba de integración con DB real |
