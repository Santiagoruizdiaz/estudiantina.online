---
name: software-architecture
description: Decisiones de arquitectura de software con criterio - modular-monolito por defecto, capas y dirección de dependencias, cuándo distribuir, cómo evaluar trade-offs y cómo escribir un ADR. Úsala al diseñar, revisar o cuestionar la estructura de un sistema.
---

# Arquitectura de software

## Principio rector

> **La mejor arquitectura es la más simple que satisface los requisitos y restricciones medidos, y que se puede cambiar sin dolor.**

La complejidad es un costo permanente. Se paga con cada persona que lee el código, con cada despliegue y con cada incidente. Se introduce solo cuando un requisito o una medición la exige.

## Modular-monolito por defecto

Empieza con **un único despliegue con módulos bien delimitados**. Distribuye solo con evidencia:

| Motivo válido para distribuir | Evidencia necesaria |
|---|---|
| Escala independiente de una parte | Medición de carga diferenciada |
| Aislamiento de fallos | Incidentes reales o requisito explícito |
| Equipos autónomos | Límites organizacionales reales |
| Restricción tecnológica | Incompatibilidad concreta de runtime |

Ninguno de esos motivos es válido por "modernidad", "escalabilidad futura" o "buenas prácticas" sin números.

## Capas y dirección de dependencias

```
Presentación  →  Aplicación  →  Dominio  →  Infraestructura
   (UI/rutas)    (casos de uso)  (reglas)     (datos, APIs, SDKs)
```

- Las dependencias apuntan **hacia el dominio**. El dominio **no conoce** la UI, el ORM ni los proveedores.
- La infraestructura implementa **interfaces** definidas por el dominio/aplicación (inversión de dependencias).
- Un componente de UI que importa una consulta de datos, o un dominio que importa un SDK de terceros, **rompe la arquitectura**.

### En un SPA sin servidor propio
No hay capa de servidor confiable. Las capas se mantienen **lógicamente** en el cliente:

- Presentación: componentes y rutas.
- Aplicación: hooks/servicios que orquestan casos de uso.
- Dominio: funciones puras y tipos de negocio (sin React, sin `fetch`).
- Infraestructura: adaptadores hacia la API/BaaS externos.

Y se documenta en `SECURITY.md` que **lo crítico se decide fuera del cliente**.

## Módulos y fronteras

- **Alta cohesión** dentro del módulo, **bajo acoplamiento** entre módulos.
- Cada módulo expone una **interfaz pública pequeña**; lo demás es privado.
- Prohibir importaciones a "entrañas" de otro módulo.
- Dependencias circulares entre módulos: siempre un defecto de diseño.

## Cómo decidir (procedimiento)

1. **Requisitos arquitectónicos** derivados de G0/G1: disponibilidad (objetivo declarado), rendimiento, seguridad, evolución.
2. **Mínimo dos alternativas** reales (incluida "no cambiar").
3. **Evaluar** contra criterios explícitos y ponderados.
4. **Declarar certeza/riesgo/incertidumbre.** Bajo incertidumbre → la opción **reversible**.
5. **Consultar** a cada área afectada antes de cerrar.
6. **Registrar** el ADR.

### Criterios de evaluación

| Criterio | Pregunta |
|---|---|
| Correctitud | ¿Satisface los requisitos? |
| Seguridad y datos | ¿Debilita alguna frontera de confianza? |
| Reversibilidad | ¿Cuánto cuesta deshacerlo? |
| Complejidad | ¿Agrega infraestructura o abstracciones? |
| Costo de cambio | ¿Bloquea la evolución? |
| Encaje | ¿Respeta capas, ADRs y políticas? |

## Cuándo agregar cada pieza (y cuándo NO)

| Pieza | Agregar solo si… | No agregar si… |
|---|---|---|
| Caché | Hay medición de latencia/carga que lo justifica y una estrategia de invalidación | "Podría ser lento algún día" |
| Cola / worker | El trabajo no puede/ debe ser síncrono y hay ADR | Un proceso corto síncrono basta |
| Microservicio | Ver tabla de distribución | Es un solo equipo sin necesidad de escala independiente |
| Evento de dominio | Desacopla un efecto secundario real | Es una llamada directa con otro nombre |
| Abstracción/patrón | Hay ≥2 casos reales que la necesitan | Solo hay uno ("por si acaso") |

## Formato de ADR

Usa `templates/ADR.md`. Un buen ADR responde:

- **Contexto**: la fuerza y restricción que obliga a decidir.
- **Decisión**: una afirmación clara.
- **Alternativas**: al menos una descartada, **con su motivo**.
- **Consecuencias**: lo bueno **y lo malo** que se acepta.
- **Rollback/migración**: cómo se deshace.
- **Decisiones relacionadas**.

Un ADR sin alternativas descartadas no es una decisión, es un anuncio.

## Señales de alarma

- Una capa que "salta" a otra.
- Módulos que se importan mutuamente.
- Abstracciones con una sola implementación y sin razón de cambio.
- "Utilidades" que crecen sin dueño.
- Decisiones materiales sin ADR.
- Infraestructura cuya justificación es una palabra de moda.

## Lista de revisión

- [ ] ¿La dirección de dependencias apunta al dominio?
- [ ] ¿Cada módulo tiene una interfaz pública mínima?
- [ ] ¿Toda complejidad nueva cita el requisito que la exige?
- [ ] ¿Hay ADR para cada decisión material?
- [ ] ¿La decisión es reversible o el riesgo fue aceptado explícitamente?
