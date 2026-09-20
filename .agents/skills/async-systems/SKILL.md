---
name: async-systems
description: Sistemas asíncronos confiables - jobs idempotentes, outbox transaccional, reintentos con retroceso, mensajes muertos, concurrencia y observabilidad de colas. Úsala al diseñar trabajo diferido, tareas programadas, workers o cualquier proceso desacoplado.
---

# Sistemas asíncronos

## Cuestiona la necesidad primero

> **La asincronía es complejidad que se paga para siempre.** Solo se introduce si el trabajo no puede o no debe ser síncrono. Toda cola o worker nuevo requiere **ADR** (`ARCHITECTURE-POLICY`).

| Motivo válido | Motivo inválido |
|---|---|
| El trabajo excede el tiempo razonable de una solicitud | "Suena más escalable" |
| Debe sobrevivir a reinicios / reintentarse | Un proceso corto síncrono basta |
| Desacoplar un efecto secundario de un proveedor lento | No hay medición que lo justifique |
| Trabajo programado por tiempo | |

En un SPA sin servidor propio, el trabajo asíncrono **no vive en el cliente**: se delega a servicios externos. Si no existen, **escala**.

## Verdad fundamental

> **Todo mensaje puede duplicarse, retrasarse y llegar desordenado.** Diseña asumiendo lo peor.

Consecuencia: cada job debe ser **idempotente, acotado y observable**.

## 1. Idempotencia

Ejecutar el job **dos veces** produce el **mismo resultado** que una.

| Técnica | Cómo |
|---|---|
| **Clave de idempotencia** | Cada mensaje trae un ID único; se registra el procesado y se descarta el repetido |
| **Operación naturalmente idempotente** | `SET estado = 'CERRADA'` en lugar de `INCREMENT` |
| **Upsert** | Crear-o-actualizar por clave natural |
| **Comprobar antes de actuar** | Con bloqueo/constraint único para evitar carreras |

La deduplicación debe ser **atómica** (constraint único), no "leo y luego escribo".

## 2. Outbox transaccional

**Problema (dual write):** cambiar datos **y** enviar un mensaje son dos operaciones; si una falla, el sistema queda inconsistente.

**Solución:**

1. En **la misma transacción**, escribe el cambio de datos **y** un registro en la tabla `outbox`.
2. Un proceso aparte lee el `outbox` y publica el mensaje.
3. Marca como enviado **después** de confirmar la publicación (puede reenviar → consumidores idempotentes).

Garantiza *al menos una vez* con consistencia atómica del estado. Úsalo cuando el estado de datos deba acoplarse a trabajo emitido.

## 3. Reintentos

- **Retroceso exponencial con jitter**.
- **Límite de intentos** y **tiempo máximo** por job.
- Clasifica: **transitorio** (reintentar) vs. **permanente** (no reintentar → mensajes muertos).
- Sin reintentos infinitos: un mensaje venenoso bloquearía la cola.

## 4. Cola de mensajes muertos (DLQ)

Los mensajes que agotan reintentos o son irrecuperables van a una **DLQ**:

- Conservan el payload, el error y el conteo de intentos.
- **Alertan** cuando la DLQ crece.
- Existe un **procedimiento de reproceso seguro** (idempotente) tras corregir la causa.
- Se revisan periódicamente: una DLQ ignorada es pérdida silenciosa de datos.

## 5. Concurrencia y orden

| Necesidad | Estrategia |
|---|---|
| Procesar en paralelo | Workers concurrentes con límite |
| **Orden por entidad** | Particionar por clave (misma entidad → mismo worker/lane) |
| Exclusión mutua | Bloqueo distribuido con expiración, o constraint único |
| Sobrecarga del downstream | Limitar concurrencia y tasa |

No asumas orden global. Si el orden importa, **incluye un número de versión/secuencia** en el mensaje y descarta lo obsoleto.

## 6. Tareas programadas

- **Idempotentes**: si corren dos veces (dos instancias, reintento), no duplican efectos.
- Protegidas contra **solapamiento** (que la ejecución N+1 empiece antes de terminar la N).
- Registran inicio, fin y resultado.
- Definen qué hacer si se **saltó** una ejecución (recuperar el rango omitido).

## 7. Observabilidad de colas

| Señal | Por qué importa |
|---|---|
| **Profundidad** de la cola | Acumulación = consumo más lento que producción |
| **Antigüedad** del mensaje más viejo | Retraso real percibido |
| **Tasa de error / reintentos** | Salud del procesamiento |
| **Tamaño de la DLQ** | Pérdida potencial |
| **Duración** por job | Detección de degradación |

Logs con **ID de correlación** que une la solicitud original, el mensaje y el job. Alertas desde SLO (`skills/observability`).

## 8. Seguridad de los mensajes

- Sin secretos ni datos sensibles innecesarios en el payload (referencia por ID, no copia).
- Valida el payload al consumir (un mensaje también es entrada externa).
- Autoriza según el contexto original, no confíes en que "vino de la cola".

## 9. Pruebas obligatorias

| Escenario | Debe demostrarse |
|---|---|
| **Mensaje duplicado** | Efecto único |
| **Mensaje retrasado/desordenado** | Estado final correcto |
| **Caída a mitad del job** | Reanuda sin corrupción ni doble efecto |
| **Fallo transitorio** | Reintenta y converge |
| **Fallo permanente** | Va a DLQ, no bloquea la cola |
| **Reproceso desde DLQ** | Idempotente |

## Lista de revisión

- [ ] ¿Es realmente necesaria la asincronía? ¿Hay ADR?
- [ ] ¿Cada job es idempotente con deduplicación atómica?
- [ ] ¿Outbox transaccional donde estado y mensaje deben ser atómicos?
- [ ] ¿Reintentos acotados con retroceso y clasificación de errores?
- [ ] ¿DLQ con alerta y reproceso seguro?
- [ ] ¿Concurrencia y orden definidos explícitamente?
- [ ] ¿Métricas de profundidad, antigüedad, error y DLQ?
- [ ] ¿Sin datos sensibles en mensajes ni logs?
