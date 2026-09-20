# Protocolo de Traspaso

Cada vez que el trabajo pasa de un agente a otro hay riesgo de perder contexto, duplicar esfuerzo o transmitir suposiciones como si fueran hechos. Este protocolo lo controla.

## Principio

Un traspaso transmite **información valiosa**: exacta, completa, pertinente, oportuna, verificable, simple, accesible y segura. Un traspaso que no cumple esas propiedades se **rechaza** (ver "Condiciones de rechazo").

## Formato estándar de traspaso

Todo traspaso, emitido por el orquestador hacia un agente o entre agentes, contiene estos campos. Los campos vacíos se escriben como `n/a` con motivo; no se omiten.

```markdown
# Traspaso: <origen> → <destino>

## 1. Objetivo
Qué debe lograrse, en una oración verificable. Rastrea al objetivo del nivel superior.

## 2. Criterios de aceptación
- [ ] Criterio 1 (observable, comprobable)
- [ ] Criterio 2

## 3. Alcance
- Dentro: archivos, módulos, comportamientos permitidos.
- Fuera: lo que NO se debe tocar.

## 4. Contexto verificado (hechos)
Cada hecho con su fuente: `archivo:línea` o comando + salida.

## 5. Suposiciones declaradas
Lo no verificado. Marcar cuáles cruzan un límite de riesgo (→ escalar).

## 6. Restricciones vigentes
Reglas, ADRs, políticas y gates que aplican.

## 7. Dependencias
Qué debe existir antes / qué depende de este trabajo.

## 8. Artefacto esperado
Forma exacta de la entrega (archivos, tests, ADR, reporte).

## 9. Criterios de salida (evidencia requerida)
Qué prueba se adjunta para dar el trabajo por terminado.

## 10. Escalamiento
Condiciones específicas de esta tarea que obligan a detenerse y preguntar.
```

## Formato estándar de retorno

Cuando el agente termina, devuelve:

```markdown
# Retorno: <agente> → <destino>

- Estado: COMPLETO | PARCIAL | BLOQUEADO
- Criterios de aceptación: lista con [x]/[ ] y evidencia por cada uno
- Archivos modificados: lista exacta (y confirmación de que no hay otros)
- Verificación ejecutada: comando + resultado real (no "debería pasar")
- Decisiones tomadas: con motivo y alternativas descartadas
- Suposiciones que persisten
- Riesgos residuales
- Próximo agente sugerido y motivo
```

## Condiciones de rechazo

El receptor **rechaza y devuelve** un traspaso si:

1. No hay criterio de aceptación verificable.
2. El alcance es ambiguo o se solapa con el de otro agente en ejecución.
3. Un "hecho" no cita fuente y el receptor no puede verificarlo.
4. Falta contexto obligatorio y no puede obtenerse del repositorio.
5. Contiene secretos o datos personales reales.
6. Pide algo que contradice una política, ADR o gate vigente sin excepción humana documentada.

El rechazo se hace con el formato de `ESCALATION.md` (bloqueo → decisión afectada → opciones → recomendación). Rechazar bien es una función de control, no una falta de colaboración.

## Reglas de comunicación

- **Estructura sobre prosa**: los campos fijos evitan omisiones.
- **Un mensaje, un propósito**: no mezclar pedido de trabajo con reporte de hallazgos.
- **Fuente siempre**: una afirmación sobre el repositorio sin ruta o comando es una suposición.
- **Sin sobrecarga**: se traspasa lo pertinente. Volcar archivos enteros "por las dudas" es un defecto.
- **Retroalimentación explícita**: el receptor confirma comprensión reformulando el objetivo cuando el traspaso es de alto riesgo.

## Traspasos de verificación (control)

Un verificador recibe además: el diff exacto, los criterios de aceptación **originales** (no los reformulados por el constructor) y la lista de suposiciones. Devuelve hallazgos clasificados por severidad; **no** corrige lo que revisa.

## Archivo de trazabilidad

El orquestador mantiene, por tarea, un registro breve: quién recibió qué, cuándo, con qué resultado. Sirve de evidencia de gobernanza y de insumo del postmortem si algo falla.
