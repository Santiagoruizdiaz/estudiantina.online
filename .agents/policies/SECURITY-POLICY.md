# Security Policy
Authentication != authorization. Protected operations require server-side policy checks. Check tenant/resource scope. Verify webhooks. Never expose secrets. Critical/high findings block release.

## Aplicación

- **Authentication ≠ authorization ≠ regla de negocio**: tres preguntas, tres capas.
- **Server-side** siempre. En un SPA sin servidor propio, la autorización real debe existir en el servicio externo; si no existe o no se conoce, es un **hallazgo de alto impacto** y se escala.
- **Alcance de recurso/tenant** en cada consulta y operación (prevención de IDOR); un recurso ajeno responde indistinguible de "no existe".
- **Webhooks**: firma verificada, payload validado, protección de repetición.
- **Secretos**: nunca en código, logs, capturas ni bundle del cliente; solo nombres documentados.

## Severidades y efectos

| Severidad | Efecto |
|---|---|
| **CRITICAL** | Bloquea; notificación **inmediata** al orquestador y al humano |
| **HIGH** | **Bloquea la liberación** |
| MEDIUM | Corregir o aceptar por escrito |
| LOW | Registrar |

**Poder de veto**: `security-review` puede bloquear **G4**, y su veredicto es insumo obligatorio de G7 y G8 (un CRITICAL/HIGH abierto los bloquea también). Solo un **humano** levanta el bloqueo, con excepción documentada. Los constructores **no** pueden renunciar a controles de seguridad.
