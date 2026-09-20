# Architecture Policy
Prefer modular monoliths until distribution is justified. Enforce Presentation -> Application -> Domain -> Infrastructure. Do not silently add microservices, queues or caching. Material decisions require ADRs.

## Criterios de aplicación

- **Distribuir** solo con evidencia: escala independiente medida, aislamiento de fallos exigido, equipos autónomos reales o restricción tecnológica concreta.
- **Sin agregar en silencio**: microservicios, colas, caché, nuevas bases de datos o nuevos proveedores requieren **ADR** y, si son infraestructura nueva o proveedor externo, **escalamiento**.
- **Dirección de dependencias** hacia el dominio; el dominio no conoce UI, ORM ni proveedores.
- **Decisión material** = cambia capas, agrega infraestructura, cambia un contrato público, o es costosa de revertir.
- La decisión se toma con `governance/DECISION-FRAMEWORK.md`: mínimo dos alternativas, criterios explícitos, y bajo incertidumbre la opción reversible.
- **Propietario**: `software-architect` (G2). Los demás **consultan** (`C`) y no deciden.
