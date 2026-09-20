---
name: observability
description: Observabilidad de producción - SLI/SLO antes que alertas, logs estructurados con correlación, métricas técnicas y de negocio, trazas, alertas accionables y redacción de datos sensibles. Úsala al instrumentar flujos críticos, definir alertas o preparar una liberación.
---

# Observabilidad

## Principio

> **Un sistema es observable si puedes responder preguntas nuevas sobre su comportamiento sin desplegar código nuevo.** Observar no es acumular datos: es poder **decidir y actuar** con ellos.

Cada señal existe para responder una pregunta. Si nadie la usa para decidir, es ruido con costo.

## Orden correcto de trabajo

```
1. Recorridos críticos → 2. SLI/SLO → 3. Señales (logs/métricas/trazas) → 4. Alertas → 5. Runbooks
```

**Se definen los SLO antes que las alertas.** Una alerta sin SLO es una opinión.

## 1. Recorridos críticos

Identifica qué significa "funcionar" para el usuario en cada flujo. Para CheckCar (según `PROJECT.md`):

- Ingreso de vehículo y alta.
- Inspección multipunto (checklist).
- Generación de informe de diagnóstico e historial de mantenimiento.
- Landing y conversión.

## 2. SLI y SLO

| Concepto | Definición | Ejemplo |
|---|---|---|
| **SLI** | Métrica que mide una dimensión de calidad | % de inspecciones guardadas con éxito |
| **SLO** | Objetivo del SLI en una ventana | ≥ 99,5 % en 30 días |
| **Presupuesto de error** | 100 % − SLO | Margen tolerable de fallos |

`PROJECT.md` declara **disponibilidad 99,9 %**: ≈ **43 min** de indisponibilidad por mes. Deriva de ahí los SLO por recorrido; no los inventes sin ese ancla.

Familias de SLI útiles: **disponibilidad**, **latencia** (percentiles p95/p99), **tasa de error**, **frescura**, **corrección**.

## 3. Logs estructurados

- Formato **estructurado** (JSON, clave-valor), nunca prosa libre.
- Campos mínimos: `timestamp`, `nivel`, `mensaje`, `servicio/módulo`, **`correlationId`**, `entorno`.
- **Niveles con criterio**: `error` = requiere atención; `warn` = anómalo pero recuperado; `info` = hitos de negocio; `debug` = desarrollo (no en producción por defecto).
- **Correlación**: un ID por solicitud/flujo que atraviesa componentes; permite reconstruir un recorrido.

### Redacción de datos sensibles (obligatoria)

**Nunca registrar**: contraseñas, tokens, claves de API, secretos de sesión, números de tarjeta, documentos de identidad, cuerpos de solicitud completos con datos personales.

| Dato | Tratamiento |
|---|---|
| Identificador de usuario | Seudónimo/ID interno, no el email si evitable |
| Patente/VIN | Solo si el negocio lo requiere; considera enmascarar |
| Payload de solicitud | Lista blanca de campos, no volcado completo |
| Errores de terceros | Sin credenciales ni cabeceras de autorización |

Un test que verifique **ausencia de datos sensibles** en logs es parte de la definición de terminado.

## 4. Métricas

| Tipo | Ejemplos |
|---|---|
| **Técnicas (RED)** | *Rate* (solicitudes/s), *Errors* (tasa), *Duration* (percentiles) |
| **Recursos (USE)** | *Utilization*, *Saturation*, *Errors* |
| **De negocio** | Inspecciones completadas, informes generados, conversiones de landing |
| **Web vitals** (cliente) | LCP, INP, CLS, errores de JavaScript |

Usa **percentiles**, no promedios: el promedio oculta la cola lenta que sufren los usuarios reales.

Cuidado con la **cardinalidad**: etiquetas con valores ilimitados (ID de usuario, patente) revientan el costo y el rendimiento.

## 5. Trazas

Útiles cuando una operación **cruza varios componentes** (cliente → API → servicio → proveedor). Un `traceId` propagado permite ver **dónde** se gastó el tiempo. Si el sistema es simple, la correlación en logs puede bastar: no agregues trazas sin necesidad.

## 6. Seguimiento de errores

- Agrupa errores por causa; cuenta ocurrencias y usuarios afectados.
- Adjunta contexto útil (versión, ruta, `correlationId`) **sin datos sensibles**.
- En el cliente: captura errores no manejados y rechazos de promesas; los **límites de error** de React reportan.

## 7. Alertas accionables

Cada alerta debe cumplir **todo**:

| Requisito | Pregunta |
|---|---|
| **Vinculada a un SLO** | ¿Qué promesa al usuario está en riesgo? |
| **Accionable** | ¿Qué debe hacer quien la recibe? |
| **Con dueño** | ¿Quién responde? |
| **Con runbook** | ¿Dónde está el procedimiento? |
| **Con severidad** | ¿Despierta a alguien o espera al horario? |

Alertas por **quema del presupuesto de error** (rápida y lenta) son mejores que umbrales estáticos. **Una alerta que se ignora se elimina o se corrige**: el ruido entrena a ignorar lo importante.

## 8. Observabilidad en un SPA

- **No hay logs de servidor propios**: la telemetría del cliente debe enviarse a un colector.
- Captura: errores de JS, rendimiento (Web Vitals), fallos de red, navegación.
- Respeta **privacidad y consentimiento**: no capturar contenido de formularios ni datos personales.
- El **muestreo** controla el costo sin perder señal.
- Las llamadas a servicios externos se observan **desde el cliente** (latencia y errores percibidos).

## 9. Verificación

Instrumentar no es terminar: **demuestra que emite lo esperado**.

- Fuerza un error y comprueba que aparece con su `correlationId`.
- Comprueba que **no** hay datos sensibles.
- Simula la condición de alerta y confirma que dispara.

## 10. Documentar

Completa `contexts/OBSERVABILITY.md` con la realidad: formato de logs, proveedor, SLO, recorridos críticos. **Lo desconocido va a preguntas abiertas**, no se inventa un proveedor.

## Lista de revisión

- [ ] ¿Recorridos críticos identificados?
- [ ] ¿SLI/SLO definidos, anclados al objetivo declarado, antes de las alertas?
- [ ] ¿Logs estructurados con `correlationId`?
- [ ] ¿Verificado que no se registran datos sensibles?
- [ ] ¿Métricas por percentiles y sin explosión de cardinalidad?
- [ ] ¿Cada alerta con SLO, acción, dueño y runbook?
- [ ] ¿Se demostró que la instrumentación funciona?
- [ ] ¿Contexto de observabilidad actualizado con hechos?
