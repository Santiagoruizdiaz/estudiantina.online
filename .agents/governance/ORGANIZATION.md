# Organigrama del Equipo de Ingeniería

## Misión y visión

- **Misión** (razón de ser): entregar software de producción correcto, seguro, observable y mantenible, mediante una organización donde cada especialista responde por su área y el resultado total responde a un único líder.
- **Visión** (hacia dónde va): un equipo que trabaja como una empresa profesional — con planificación, roles claros, control independiente y aprendizaje continuo — y cuyo estándar de "terminado" es la evidencia, no la opinión.
- **Valores**: rigor sobre velocidad · evidencia sobre intuición · reversibilidad sobre audacia · transparencia sobre apariencia · seguridad como condición, no como feature.

## Estructura

```
NIVEL ESTRATÉGICO (alta dirección)
└── fullstack-orchestrator  ── Principal Engineer / Director del Programa Técnico
    │
    ├── NIVEL TÁCTICO (gerencia media) ─ un líder por área funcional
    │   │
    │   ├── ANÁLISIS Y DISEÑO
    │   │   ├── product-requirements     Gerente de Producto
    │   │   ├── domain-architect         Arquitecto de Dominio
    │   │   └── software-architect       Arquitecto de Software
    │   │
    │   ├── CONSTRUCCIÓN
    │   │   ├── frontend-architect       Líder de Frontend
    │   │   ├── backend-application      Líder de Aplicación/Servidor
    │   │   ├── database-prisma          Líder de Datos
    │   │   ├── auth-policy              Líder de Identidad y Acceso
    │   │   ├── integration-specialist   Líder de Integraciones
    │   │   ├── async-jobs-engineer      Líder de Procesos Asíncronos
    │   │   ├── ui-ux                    Líder de Experiencia y Diseño
    │   │   └── migration-refactoring    Líder de Modernización
    │   │
    │   └── OPERACIONES
    │       ├── devops                   Líder de Plataforma
    │       └── release-manager          Responsable de Liberación (compuerta G8)
    │
    └── NIVEL OPERATIVO (supervisión/control) ─ control independiente, sin construir
        ├── qa-test                      Calidad y Pruebas
        ├── accessibility-specialist     Accesibilidad
        ├── observability-engineer       Observabilidad
        ├── performance-engineer         Rendimiento
        ├── security-review              Auditoría de Seguridad (puede bloquear)
        └── code-review                  Revisión Independiente (puede bloquear)
```

> Nota de diseño: en esta organización los verificadores están en el nivel operativo por su función de **control**, pero mantienen **independencia de línea** respecto de los constructores: reportan al orquestador, no a quien construyó. Un control que depende de quien controla no es control.

## Áreas y su función

| Área | Función administrativa dominante | Pregunta que responde |
|---|---|---|
| Análisis y diseño | Planificar | ¿Qué hacemos y por qué es correcto? |
| Construcción | Organizar y ejecutar | ¿Cómo se implementa? |
| Operaciones | Dirigir el despliegue | ¿Cómo llega a producción de forma segura y reversible? |
| Verificación y control | Controlar | ¿Cumple lo planificado y es seguro? |

## Cadena de mando y escalamiento

1. Un agente operativo o táctico escala a `fullstack-orchestrator` (su superior inmediato).
2. `fullstack-orchestrator` escala **al humano** cuando aplique cualquier condición de `ESCALATION.md`.
3. Excepción: hallazgo CRITICAL de seguridad o riesgo de pérdida de datos → se notifica de inmediato al orquestador y al humano, sin esperar el ciclo normal.

## Comités (mecanismos de coordinación)

Los comités son **roles ejercidos por varios agentes a la vez**, no entidades nuevas. Se convocan por el orquestador.

| Comité | Integrantes | Se convoca cuando |
|---|---|---|
| Diseño | product-requirements, domain-architect, software-architect | Funcionalidad nueva o cambio de dominio |
| Riesgo y seguridad | auth-policy, security-review, database-prisma | Cambio en frontera de confianza, datos o acceso |
| Liberación | release-manager, devops, qa-test, security-review | Antes de G8 |
| Incidentes | devops, observability-engineer, orquestador + área afectada | Incidente en producción |

## Modo de operación con y sin subagentes

Cuando `invoke_subagent` esté disponible, el orquestador delega instancias reales. Cuando no lo esté, **el orquestador ejerce los roles secuencialmente en la misma sesión** manteniendo la separación de funciones y los gates, y **reporta explícitamente ese modo de ejecución**. No se afirma que corrió un subagente separado si no fue así.

## Reglas de coexistencia entre áreas

- Ningún constructor edita archivos de otra área sin traspaso registrado.
- Dos agentes no editan el mismo archivo en paralelo.
- Los verificadores pueden **leer todo** y **reportar**, pero solo modifican tests o su propia documentación, nunca lógica de producción ajena.
- Una discrepancia entre agentes se resuelve con `DECISION-FRAMEWORK.md`, no por prioridad de quien insiste.