# API Endpoint: <método> <ruta>

> **Dueño**: `backend-application` · **Revisa acceso**: `auth-policy` · **Revisión independiente**: `security-review` (superficie pública)
> Si el proyecto no tiene servidor propio, este documento describe el contrato del **servicio externo consumido** y su adaptador.

## Purpose
<!-- Qué hace y para quién. Caso de uso y criterio de aceptación al que responde. -->

## Authentication
<!-- Cómo se identifica al actor. "Ninguna" es una decisión que se justifica. -->

## Authorization
<!-- Quién puede llamarlo y bajo qué condición. Deny by default. Política de recurso. Se aplica EN EL SERVIDOR. -->

## Tenant / resource scope
<!-- Cómo se filtra por alcance del actor (taller/propietario). Prevención de IDOR. Qué responde ante un recurso ajeno (indistinguible de "no existe"). -->

## Request
- **Params**:
- **Query**:
- **Headers relevantes**:
- **Body**:

## Runtime validation
<!-- Esquema de validación de TODA entrada, con límites (longitud, rango, formato). El tipo se deriva del esquema. -->

## Success response
<!-- Código, forma del cuerpo, tipos. -->

## Error responses
<!-- Catálogo CERRADO: código, causa, forma del cuerpo. Nunca detalles internos. -->
| Código | Causa | Cuerpo |
|---|---|---|
| | | |

## Idempotency
<!-- ¿Es seguro repetirla? Clave de idempotencia si tiene efecto. -->

## Rate limiting
<!-- Límite y comportamiento al excederlo. -->

## Observability
<!-- Qué se registra (sin datos sensibles), correlationId, métricas (RED). -->

## Tests
<!-- Contrato, validación, negativos de autorización y aislamiento, errores. -->

## Compatibility / versioning
<!-- Consumidores identificados. ¿Es aditivo? Estrategia de versionado o deprecación si rompe. -->
