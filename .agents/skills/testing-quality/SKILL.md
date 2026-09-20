---
name: testing-quality
description: Estrategia de pruebas basada en riesgo - qué probar en qué capa, tests negativos de autorización, pruebas de caracterización, comportamiento sobre cobertura, y cómo proceder cuando el proyecto no tiene framework de tests. Úsala al diseñar pruebas, verificar una entrega o firmar el gate G6.
---

# Calidad y pruebas

## Principio

> **Se prueba comportamiento, no líneas.** Un 100 % de cobertura con aserciones triviales no protege nada; un test de una regla crítica protege mucho.

Una prueba vale por el **riesgo que reduce**. Prioriza por impacto de fallo, no por facilidad de escribir.

## Prioridad por riesgo

| # | Qué proteger | Por qué |
|---|---|---|
| 1 | Reglas de negocio críticas | Su fallo produce decisiones equivocadas |
| 2 | Autenticación y autorización | Su fallo expone datos ajenos |
| 3 | Dinero y operaciones irreversibles | No se pueden deshacer |
| 4 | Aislamiento entre inquilinos/usuarios | Fuga entre clientes |
| 5 | Integridad de datos | Corrupción silenciosa |
| 6 | Recorridos principales del usuario | Impacto directo en el producto |

## Prueba en la capa correcta

| Nivel | Qué prueba | Velocidad | Cuándo |
|---|---|---|---|
| **Unidad** | Reglas de dominio, funciones puras, transiciones de estado | Muy rápida | **Base**: la mayoría de la lógica |
| **Integración** | Persistencia, adaptadores, fronteras, contratos | Media | Donde hay E/S real |
| **Contrato** | Forma de la API entre consumidor y proveedor | Rápida | Al cambiar contratos |
| **Componente (UI)** | Comportamiento de un componente ante interacción | Media | Flujos interactivos |
| **E2E** | Recorridos críticos completos en navegador | Lenta | **Pocos**, solo los críticos |

**Pirámide**: muchas de unidad, algunas de integración, pocas E2E. Una pirámide invertida es lenta, frágil y cara.

Prueba **en el nivel más bajo que detecte el defecto.** Si una regla de dominio se prueba con E2E, es lenta y opaca.

## Lo negativo es obligatorio

Los caminos felices raramente son donde está el defecto. Incluye siempre:

- **Entrada inválida** (vacía, demasiado larga, tipo incorrecto, caracteres extraños).
- **Autorización denegada**: usuario A intenta acceder al recurso de B → **debe fallar**.
- **Estado ilegal**: transición prohibida (`Cerrada → EnCurso`).
- **Fallo de dependencia**: timeout, error 5xx, respuesta malformada.
- **Concurrencia**: dos operaciones simultáneas sobre el mismo recurso.
- **Borde**: cero, uno, máximo, vacío.

## Anatomía de una buena prueba

- **Nombre que describe el comportamiento**: `no permite cerrar una inspección con puntos obligatorios sin resultado`.
- **Estructura AAA**: *Arrange* (preparar), *Act* (ejecutar), *Assert* (verificar).
- **Un motivo para fallar**: una prueba, una razón.
- **Independiente**: no depende del orden ni del estado de otra.
- **Determinista**: sin aleatoriedad ni dependencia del reloj o la red reales (se inyectan).
- **Verifica resultados observables**, no detalles internos (no se rompe al refactorizar).

## Dobles de prueba

| Doble | Uso |
|---|---|
| **Stub** | Devuelve respuestas predefinidas |
| **Fake** | Implementación simple funcional (repositorio en memoria) |
| **Mock/Spy** | Verifica interacciones (con moderación) |

Regla: **mockea fronteras** (red, reloj, proveedores), **no** la lógica propia. Un test lleno de mocks prueba los mocks.

## Pruebas de caracterización (antes de refactorizar)

Cuando el código existente **no tiene tests**, antes de tocarlo:

1. Ejecuta el código real con entradas representativas.
2. **Captura la salida actual** como aserción (aunque sea "incorrecta").
3. Ese es el contrato vigente: el refactor no debe cambiarlo.
4. Solo después, modifica.

Es la red de seguridad de `migration-refactoring`.

## Cuando NO hay framework de pruebas

CheckCar declara en "Testing & Quality" solo **`tsc`** y **`vite build`**. Si el repositorio confirma que no hay runner de tests:

1. **No instales uno por tu cuenta.** Es una dependencia nueva con impacto en CI: se **escala** con opciones.
2. **Declara la brecha** en el retorno; no la ocultes.
3. **Verifica con lo que existe**: `tsc` (el sistema de tipos es una verificación real), `vite build`, y verificación manual **documentada** con pasos reproducibles.
4. **Propón opciones** con su costo: un runner acorde al bundler (para unidad/componente) y una herramienta E2E para recorridos críticos.
5. Hasta que exista, un criterio de aceptación sin verificación automatizable se marca como **"verificación manual"**, con evidencia (pasos + resultado).

No declares "probado" algo que no se ejecutó.

## Evidencia

- **Comando + salida real.** "Debería pasar" y "no lo ejecuté pero es simple" no son evidencia.
- Reporta: cuántas pruebas, cuántas pasaron/fallaron/omitidas.
- Las pruebas omitidas (`skip`) se **declaran**, no se esconden.
- Un test que **falla intermitentemente** es un defecto (flaky) que se corrige o se aísla con motivo, no se reintenta hasta que pase.

## Separación de funciones

- **El constructor escribe sus pruebas unitarias**; **`qa-test` verifica de forma independiente** contra los criterios de aceptación **originales**.
- `qa-test` **no modifica lógica de producción** para hacer pasar un test.
- Nadie relaja un criterio de aceptación para que el resultado "cumpla". Si el criterio es inverificable, se **escala**.

## Datos de prueba

- **Ficticios**. Nunca datos reales de propietarios o vehículos.
- Construidos con **fábricas/constructores**, no volcados enormes.
- Cada prueba crea lo que necesita.

## Lista de revisión

- [ ] ¿Cada criterio de aceptación original tiene verificación observable?
- [ ] ¿Cubre reglas críticas, autorización, aislamiento e integridad?
- [ ] ¿Hay casos negativos y de borde?
- [ ] ¿Cada prueba está en la capa más baja posible?
- [ ] ¿Se mockean fronteras y no lógica propia?
- [ ] ¿Se ejecutó todo y se adjunta la salida real?
- [ ] ¿Las brechas (sin runner, pruebas omitidas) están declaradas?
- [ ] ¿Sin datos reales y sin tests flaky?

## Errores típicos

| Error | Remedio |
|---|---|
| Perseguir el % de cobertura | Priorizar por riesgo y comportamiento |
| Solo camino feliz | Añadir negativos y bordes |
| E2E para todo | Bajar a unidad/integración |
| Mock de la propia lógica | Probar la lógica real; mockear fronteras |
| Instalar un framework sin preguntar | Escalar con opciones |
| "Probado" sin ejecutar | Adjuntar salida real |
