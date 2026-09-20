# Database Policy
Critical invariants belong in constraints where possible. Index from access patterns. Keep transactions short. Do not put slow external calls in DB transactions. Prefer expand-and-contract.

## Aplicación

- **Condición previa**: solo aplica si existe capa de datos. Introducir una es decisión de arquitectura (ADR + escalamiento).
- **Migraciones destructivas o sobre producción**: aprobación humana explícita.
- Migraciones **reproducibles**; jamás se edita una ya aplicada.
- **Breaking** ⇒ expand-and-contract; cada paso desplegable y reversible.
- Datos de prueba **ficticios**; nunca copias de producción.
- **Propietario**: `database-prisma` (G3).
