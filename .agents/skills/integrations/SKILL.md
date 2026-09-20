---
name: integrations
description: Integración con servicios externos - adaptadores detrás de interfaces de dominio, timeouts, reintentos con retroceso, idempotencia, webhooks, límites de tasa y clasificación de fallos. Úsala al conectar cualquier proveedor externo (pagos, correo, almacenamiento, OAuth, CRM/ERP, APIs de terceros).
---

# Integraciones con servicios externos

## Regla previa

> **Un proveedor externo nuevo es una condición de escalamiento obligatoria.** Antes de implementar: qué es, por qué, alternativas, costo, riesgo, dónde caen los datos. Sin aprobación no se integra.

`contexts/INTEGRATIONS.md` de CheckCar no registra proveedores hoy. No inventes ninguno.

## Principio

**Un servicio externo es un sistema que no controlas, que puede fallar, tardar, cambiar y mentir.** El diseño asume eso desde el inicio.

## 1. Adaptador detrás de una interfaz propia

```
Dominio/Aplicación → [Interfaz propia: NotificadorDePago]
                              ↑ implementa
                     Adaptador (traduce al proveedor concreto)
                              ↓
                     SDK / HTTP del proveedor
```

- El dominio define **qué necesita** (`enviarRecibo(inspeccion)`), no **cómo** lo hace el proveedor.
- Cambiar de proveedor toca **solo el adaptador**.
- Ningún tipo del SDK del proveedor se filtra fuera del adaptador.
- El adaptador **traduce errores** del proveedor a errores propios y cerrados.

## 2. Timeouts (siempre)

Toda llamada saliente tiene **timeout explícito**. Sin timeout, un proveedor lento agota tus recursos.

| Tipo | Guía |
|---|---|
| Conexión | Corto (1–3 s) |
| Respuesta | Según la operación; documentado |
| Total con reintentos | Acotado por el presupuesto de la solicitud original |

## 3. Clasificar fallos

| Clase | Ejemplos | Conducta |
|---|---|---|
| **Transitorio** | Timeout, 502/503/504, 429, reset de conexión | **Reintentar** con retroceso |
| **Permanente** | 400, 401, 403, 404, 422 | **No reintentar**; reportar/corregir |
| **Ambiguo** | Timeout tras enviar (¿se procesó?) | Reintentar **solo si es idempotente** |

## 4. Reintentos

- **Retroceso exponencial con dispersión (jitter)** para no sincronizar tormentas de reintentos.
- **Límite de intentos** y de tiempo total.
- Respeta `Retry-After` en 429/503.
- **Solo** para fallos transitorios y operaciones idempotentes.

```ts
// Esquema: espera = min(tope, base * 2^intento) * aleatorio(0.5..1.5)
```

## 5. Idempotencia

Una operación es idempotente si repetirla **no cambia el resultado** más allá de la primera vez. Imprescindible con reintentos y con entrega duplicada.

- **Claves de idempotencia** en operaciones con efecto (cobros, envíos): la misma clave → el proveedor devuelve el resultado original.
- **Deduplicación** de eventos entrantes por ID de evento (tabla/registro de procesados).
- Genera la clave **antes** del primer intento y **reúsala** en los reintentos.

## 6. Webhooks (entrada)

1. **Verificar la firma** (comparación de tiempo constante) con el secreto del proveedor.
2. **Validar el payload** con un esquema.
3. **Anti-repetición**: ventana de marca de tiempo + deduplicación por ID.
4. **Responder rápido** (2xx) y diferir el trabajo pesado a un proceso asíncrono (`skills/async-systems`).
5. Diseña para **orden no garantizado** y **entrega duplicada**.
6. Registra el evento crudo (sin secretos) para reproceso y auditoría.

## 7. Límites de tasa

- Conoce el límite del proveedor y respétalo del lado cliente (cola/limitador).
- Ante 429: retroceso; no insistir en bucle.
- Métrica de uso frente al límite.

## 8. Fallback y criticidad

Para cada proveedor define:

| Pregunta | Ejemplo |
|---|---|
| ¿Es **crítico**? (¿se puede operar sin él?) | El correo de recibo: no crítico. El cobro: crítico. |
| ¿Qué pasa si **cae**? | Encolar y reintentar / degradar / informar al usuario |
| ¿Cuál es el **modo degradado**? | Guardar el pedido y notificar luego |

Un **circuit breaker** evita martillar a un proveedor caído.

## 9. Transacciones

**Nunca** una llamada al proveedor dentro de una transacción de datos larga. Usa **outbox transaccional** para acoplar el cambio de datos con el mensaje al proveedor (`skills/async-systems`).

## 10. Secretos

- **Solo nombres** de variables en la documentación; jamás valores.
- En un SPA, **no** pongas credenciales privadas de proveedor en el cliente: el bundle es público. La llamada al proveedor debe salir de un servicio con la credencial.
- Rotación soportada sin cambio de código.

## 11. Pruebas

| Caso | Verificar |
|---|---|
| Timeout | Se reintenta o se degrada según lo definido |
| Error 5xx transitorio | Reintenta con retroceso y límite |
| Error 4xx permanente | No reintenta; error claro |
| Evento duplicado | Se procesa **una vez** |
| Firma inválida | Rechazado |
| Respuesta malformada | Falla controlada, sin excepción sin capturar |

Usa dobles del **adaptador** en pruebas del núcleo; pruebas de contrato contra el sandbox del proveedor en el adaptador.

## 12. Documentar en `INTEGRATIONS.md`

Por proveedor: propósito, frontera de confianza, método de autenticación, criticidad, política de timeout/reintento, fallback y **nombres** de variables.

## Lista de revisión

- [ ] ¿Hay aprobación explícita del proveedor?
- [ ] ¿Adaptador detrás de interfaz propia, sin filtrar tipos del SDK?
- [ ] ¿Timeouts en todas las llamadas?
- [ ] ¿Fallos clasificados; reintentos solo transitorios e idempotentes?
- [ ] ¿Idempotencia en operaciones con efecto y en eventos entrantes?
- [ ] ¿Webhooks con firma, validación y anti-repetición?
- [ ] ¿Fallback definido según criticidad?
- [ ] ¿Sin secretos en código ni en el cliente?
