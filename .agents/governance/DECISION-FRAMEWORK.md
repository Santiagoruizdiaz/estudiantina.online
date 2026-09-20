# Marco de Toma de Decisiones

> Decidir es elegir un curso de acción entre alternativas. **Sin decisión comprometida no hay plan**: solo hay análisis. Este marco convierte la teoría de la decisión en un procedimiento que el equipo aplica siempre.

## Paso 1 — Clasificar la decisión

### Por jerarquía
| Tipo | Ejemplo en ingeniería | Quién decide |
|---|---|---|
| Estratégica | Adoptar un backend, cambiar de arquitectura, incorporar un proveedor | Orquestador (con arquitecto y, si cruza riesgo, humano) |
| Táctica | Estructura de módulos de una funcionalidad, estrategia de pruebas | Líder del área responsable (`A` en RACI) |
| Operativa | Nombre de una función, forma de un test | Quien implementa |

### Por método
- **Programada**: rutina con procedimiento existente (formato de commit, estructura de un endpoint conforme a `API-ENDPOINT.md`). → **Se aplica el procedimiento. No se delibera.**
- **No programada**: problema nuevo, sin precedente, de impacto alto. → **Análisis de alternativas + ADR + revisión independiente.**

### Por número de decisores
- **Colaborativa** (comité): cuando intervienen varias áreas con intereses distintos. Más lenta, más completa. Se usa para decisiones no programadas que cruzan áreas.
- **Individual con consulta** (un `A` + `C` de RACI): por defecto. Rápida y con responsable claro.
- **Prohibidas**: la decisión **caótica** (impulsiva, sin criterio) y la **acrítica** (ceder al que insiste sin evidencia).

## Paso 2 — Declarar el nivel de certeza

| Situación | Cómo se reconoce | Conducta |
|---|---|---|
| **Certeza** | Hechos verificados, causa y efecto conocidos | Decidir y ejecutar |
| **Riesgo** | Información parcial, se pueden estimar probabilidades | Cuantificar, elegir con criterio explícito, agregar salvaguarda |
| **Incertidumbre** | Pocos datos, no confiables, variables que interactúan sin poder evaluarse | **Preferir la opción reversible.** Acotar como experimento. Definir qué evidencia cambiaría la decisión |

Casi toda decisión de ingeniería ocurre bajo algún grado de incertidumbre. Lo prohibido es **fingir certeza**.

## Paso 3 — Reconocer los límites de la racionalidad

La racionalidad total es inalcanzable: el futuro es incierto, no se pueden listar todas las alternativas y no se pueden analizar todas las que se listan. Por eso:

- Se decide con **información suficiente**, no perfecta (`satisficing`).
- Se fija un **plazo de decisión** proporcional al impacto y a la reversibilidad.
- Se evita la **parálisis por análisis**: si más información no cambiaría la decisión, se decide.
- Se compensa con **método**, no con intuición aislada.

## Paso 4 — Generar y evaluar alternativas

Mínimo **dos** alternativas reales para toda decisión no programada (incluida "no hacer nada" cuando aplique). Se evalúan con tres enfoques, en este orden de preferencia para decisiones importantes:

1. **Investigación y análisis** — comprender variables, restricciones y premisas decisivas. Es el enfoque por defecto: leer código, medir, consultar el contexto.
2. **Experimentación** — probar una alternativa de forma acotada y reversible (spike, rama, feature flag).
3. **Experiencia** — precedentes y patrones conocidos. Útil como hipótesis inicial, insuficiente como única base para lo importante.

### Criterios de evaluación (asignar función de valor)

Se puntúan las alternativas contra criterios explícitos y ponderados. Base recomendada:

| Criterio | Pregunta |
|---|---|
| Correctitud | ¿Cumple los criterios de aceptación? |
| Seguridad y datos | ¿Debilita alguna frontera de confianza o la integridad de datos? |
| Reversibilidad | ¿Cuánto cuesta deshacerlo? |
| Complejidad | ¿Introduce infraestructura o abstracciones nuevas? (Preferir lo simple) |
| Costo de cambio futuro | ¿Bloquea evolución? |
| Encaje con la arquitectura | ¿Respeta capas, ADRs y políticas? |

## Paso 5 — Verificar la información

Antes de decidir, la información de entrada debe pasar el control de calidad: **exacta, completa, pertinente, oportuna, verificable, confiable, simple, segura**. Un dato no verificado se etiqueta como suposición. Una decisión que depende de una suposición no verificada de alto riesgo **se escala**.

## Paso 6 — Control ético

Antes de comprometerse, responder:

1. ¿Alguien puede resultar dañado (usuarios, dueños de datos, terceros)?
2. ¿Se debilita seguridad, privacidad o integridad para ganar velocidad?
3. ¿La decisión sería defendible si se hiciera pública?
4. ¿Hay conflicto entre beneficio técnico/económico y responsabilidad hacia las personas?

Si la respuesta a cualquiera de las tres primeras es "sí/no defendible" → **escalar**. Lo rentable o lo rápido no es automáticamente lo correcto.

## Paso 7 — Decidir, registrar, comunicar

- **Decidir**: elegir y comprometer recursos.
- **Registrar**: decisión estratégica/táctica no programada → ADR (`templates/ADR.md`). Decisión operativa relevante → nota en el retorno.
- **Comunicar**: informar a los `I` de RACI con el resultado, no con todo el proceso.
- **Definir el disparador de revisión**: qué evidencia futura reabriría la decisión.

## Resolución de conflictos entre agentes

Cuando dos agentes discrepan:

1. Cada uno expone su posición con **evidencia**, no con insistencia.
2. Se aplican los criterios del Paso 4 a ambas posturas.
3. Si el conflicto es dentro de un área, decide el `A` de esa actividad.
4. Si cruza áreas, decide el orquestador.
5. Si involucra seguridad, datos o producción, **el revisor de seguridad tiene poder de veto** y solo un humano lo levanta.
6. Ganar una discusión no requiere unanimidad: requiere que la decisión quede registrada con su motivo y el disenso, si lo hay.

## Anti-patrones de decisión

| Anti-patrón | Por qué es un defecto |
|---|---|
| Decisión caótica | Sin liderazgo ni criterio; impulsiva |
| Decisión acrítica | Se cede al que insiste, no al que tiene evidencia |
| Parálisis por análisis | La búsqueda de información retrasa indefinidamente |
| Falsa certeza | Presentar una suposición como hecho |
| Optimización local | Mejorar el área propia a costa del resultado total |
| Decidir sin alternativas | Una sola opción no es una decisión, es un trámite |
