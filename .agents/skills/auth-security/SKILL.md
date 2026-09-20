---
name: auth-security
description: Seguridad de identidad y acceso - separar autenticación de autorización, aislamiento entre usuarios/tenants (IDOR), validación de entradas, webhooks, gestión de secretos y particularidades de seguridad en un SPA. Úsala al diseñar o revisar acceso, sesiones, endpoints o cualquier frontera de confianza.
---

# Seguridad: identidad y acceso

## Principio

> **Autenticación ≠ autorización ≠ regla de negocio.** Son tres preguntas distintas, se responden en capas distintas y se fallan de formas distintas.

| Pregunta | Nombre | Ejemplo |
|---|---|---|
| ¿**Quién** es el actor? | Autenticación | Sesión válida del técnico Juan |
| ¿Puede **realizar** la acción sobre **este** recurso? | Autorización | ¿Juan puede editar **esta** inspección? |
| ¿Es **válida ahora**? | Regla de negocio | ¿La inspección sigue abierta? |

## Modelo de amenaza: la frontera de confianza

**Todo lo que cruza una frontera se trata como hostil hasta validarlo.**

| Frontera | Ejemplos | Tratamiento |
|---|---|---|
| Usuario → sistema | Formularios, parámetros de URL, cabeceras | Validar esquema, longitudes, tipos |
| Cliente → servidor | Cualquier solicitud | Autorizar **en el servidor** |
| Tercero → sistema | Webhooks, respuestas de APIs | Verificar firma/origen; validar payload |
| Sistema → tercero | Llamadas salientes | Timeouts, sin filtrar secretos |
| Entorno → aplicación | Variables de entorno | Validar al arrancar; nunca exponer al cliente |

## Autorización correcta

1. **En el servidor, siempre.** Ocultar un botón es cortesía de interfaz, no un control.
2. **Deny by default**: sin regla que lo permita, se deniega.
3. **Mínimo privilegio**: cada rol tiene solo lo que necesita.
4. **Por recurso, no solo por rol**: "es técnico" no implica "puede ver la inspección de otro taller".
5. **Centralizada**: un único lugar de políticas, no `if` dispersos.

### Modelos

| Modelo | Cuándo | Idea |
|---|---|---|
| **RBAC** | Permisos por rol estable | `admin`, `técnico`, `propietario` |
| **ABAC** | Depende de atributos del actor/recurso/contexto | "el técnico asignado a esta inspección" |
| **Combinado** | Lo común | RBAC para lo grueso + ABAC por recurso |

## IDOR y aislamiento entre tenants (crítico)

**IDOR** (Insecure Direct Object Reference): el identificador viene del cliente y el servidor confía en él.

```
GET /inspecciones/123   →  ¿123 pertenece al actor / a su taller?
```

- Cada consulta y operación filtra **por el alcance del actor** (taller/propietario), no solo por `id`.
- Un `id` válido de otro tenant debe responder **indistinguible de "no existe"** (404, no 403) para no filtrar existencia.
- **Identificadores no adivinables** (UUID) ayudan pero **no sustituyen** la verificación.
- Prueba explícita: "usuario A intenta leer/modificar/borrar el recurso de B → falla".

## Sesiones y cookies (según el mecanismo real)

- Cookies con `HttpOnly`, `Secure`, `SameSite` adecuado; expiración e invalidación al cerrar sesión.
- **Rotar** el identificador de sesión al elevar privilegios/autenticarse.
- **No** guardar tokens de larga vida en `localStorage` si existe alternativa (es accesible por cualquier XSS).
- Recuperación y verificación de cuenta con tokens de un solo uso y expiración corta.
- MFA cuando el riesgo lo exija.

## Entrada y salida

| Amenaza | Defensa |
|---|---|
| Inyección (SQL/comandos) | Consultas parametrizadas; nunca concatenar |
| **XSS** | Escapar por defecto; sanitizar HTML dinámico; evitar `dangerouslySetInnerHTML` con datos no confiables |
| **CSRF** | Tokens/`SameSite`; no aceptar mutaciones por GET |
| **SSRF** | Lista permitida de destinos; no dejar que el usuario elija la URL saliente sin control |
| Subida de archivos | Validar tipo/tamaño **por contenido**, no por extensión; almacenar fuera del webroot; nombre generado |
| Redirecciones abiertas | Validar destino contra lista permitida |

## Webhooks

1. **Verificar la firma** con el secreto compartido (comparación de tiempo constante).
2. **Validar el payload** con esquema.
3. **Protección de repetición**: marca de tiempo con ventana + deduplicación por ID de evento.
4. Responder rápido; el trabajo pesado va a una cola.

## Secretos

- **Nunca** en el código, en el repositorio, en logs, en capturas, en tests ni en respuestas.
- Se documentan **solo los nombres** de las variables, jamás sus valores.
- Rotación posible sin redeploy de código.
- Si un secreto se filtró: se **revoca y rota**, no solo se borra del historial.

## Particularidad crítica: SPA (Vite + React)

En un SPA **todo el bundle es público**:

- Una "clave secreta" en una variable `VITE_*` **no es secreta**.
- Lo único que un cliente puede guardar de forma segura es lo que **ya es público** o de **alcance limitado por diseño** (p. ej. una clave pública de un servicio que impone su propia autorización).
- La **autorización real** debe existir en el servicio/BaaS/API remoto (reglas a nivel de fila, políticas del proveedor). Si esas reglas no existen o no se conocen, es un **hallazgo de seguridad de alto impacto** y se **escala**.

## Dependencias y logging

- Auditar dependencias por vulnerabilidades conocidas; fijar versiones vía lockfile.
- No registrar credenciales, tokens, datos personales innecesarios ni cuerpos de solicitud completos.
- Errores al usuario: genéricos; el detalle va al log interno.

## Clasificación de hallazgos

| Severidad | Criterio | Efecto |
|---|---|---|
| **CRITICAL** | Compromiso de datos/cuentas explotable ya | **Bloquea**, notificar de inmediato al humano |
| **HIGH** | Bypass de control, exposición de datos de terceros | **Bloquea** liberación |
| **MEDIUM** | Debilidad que requiere condiciones | Corregir antes de cerrar o aceptar por escrito |
| **LOW** | Endurecimiento | Registrar |

**CRITICAL/HIGH sin resolver bloquean la liberación.** Solo un humano puede levantar el bloqueo, con excepción documentada.

## Lista de revisión

- [ ] ¿Autenticación, autorización y regla de negocio están separadas?
- [ ] ¿Toda autorización se decide en el servidor?
- [ ] ¿Deny by default y mínimo privilegio?
- [ ] ¿Cada consulta filtra por el alcance del actor (IDOR)?
- [ ] ¿Hay tests negativos de acceso entre usuarios/tenants?
- [ ] ¿Toda entrada externa se valida y toda salida se escapa?
- [ ] ¿Webhooks con firma, validación y anti-repetición?
- [ ] ¿Cero secretos en código, logs o bundle del cliente?
- [ ] ¿En un SPA: la autorización real existe fuera del cliente?
