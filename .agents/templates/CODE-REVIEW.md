# Code Review

**Result**: PASS | BLOCKED
**Revisor (A)**: `code-review` · **Autor revisado**: <agente> · **Gate**: G7
> El revisor **no implementa la corrección** ni revisa su propio trabajo. Se contrasta contra los **criterios de aceptación originales**.

## Scope reviewed
<!-- Diff/commits/archivos revisados. Confirma si el diff excede el alcance del traspaso. -->

## BLOCKER
<!-- Impide el merge. Cada hallazgo: ubicación (archivo:línea) · qué está mal · por qué importa · remedio sugerido. -->

## HIGH
<!-- Debe corregirse antes de cerrar. Mismo formato. -->

## MEDIUM
<!-- Corregir o aceptar por escrito con justificación. -->

## LOW
<!-- Mejoras; registrar. -->

## Checklist de revisión
- [ ] Corrección respecto de los criterios de aceptación originales
- [ ] Límites de arquitectura y dirección de dependencias
- [ ] Tipado estricto (sin `any` ni casts inseguros)
- [ ] Manejo de errores y casos límite
- [ ] Seguridad y autorización (cruzado con `security-review`)
- [ ] Corrección de datos y seguridad de migraciones
- [ ] Rendimiento y mantenibilidad
- [ ] Pruebas: comportamiento y negativos, no solo líneas

## Evidence
<!-- Comandos ejecutados y salida, referencias de archivo/área. Sin evidencia el hallazgo es opinión. -->
