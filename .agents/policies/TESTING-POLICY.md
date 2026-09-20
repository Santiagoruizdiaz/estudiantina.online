# Testing Policy
Test behavior, not coverage percentages. Unit test domain rules, integration-test persistence/boundaries, E2E-test critical journeys, and include negative authorization tests.

## Aplicación

- Prioridad por riesgo: reglas críticas → autenticación/autorización → dinero/irreversible → aislamiento → integridad → recorridos.
- **Negativos obligatorios**: entrada inválida, permiso denegado, estado ilegal, fallo de dependencia.
- **Verificación independiente**: el constructor prueba lo suyo; `qa-test` verifica contra los criterios **originales** y firma G6.
- **Sin framework de tests** en el repo: no se instala uno sin decisión; se **declara la brecha**, se verifica con lo existente (`tsc`, `vite build`, verificación manual documentada) y se propone opciones.
- Evidencia = comando + salida real. "Debería pasar" no cuenta.
