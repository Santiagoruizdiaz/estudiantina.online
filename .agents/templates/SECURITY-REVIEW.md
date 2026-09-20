# Security Review

**Result**: PASS | BLOCKED
**Auditor (A)**: `security-review` · **Gate**: G4 (su veredicto es insumo de G7 y G8)
> Solo revisa; **no modifica lógica de producción**. **CRITICAL/HIGH abiertos ⇒ BLOCKED.** Este informe **no debe contener secretos ni datos sensibles**.

## Threat surface
<!-- Fronteras de confianza inventariadas: entradas del usuario, terceros, almacenamiento del cliente, variables de entorno, redirecciones, subidas. -->

## Findings

### CRITICAL
<!-- Explotable ya con compromiso de datos/cuentas. Notificar de inmediato al orquestador y al humano. -->

### HIGH
<!-- Bypass de control o exposición de datos de terceros. Bloquea la liberación. -->

### MEDIUM
<!-- Requiere condiciones; corregir o aceptar por escrito. -->

### LOW
<!-- Endurecimiento. -->

> Formato por hallazgo: **ID · ubicación · descripción · impacto · evidencia · remediación · dueño de la corrección**.

## Review coverage
- [ ] Autenticación (bypass)
- [ ] Autorización en servidor (bypass, escalada)
- [ ] IDOR / aislamiento entre tenants
- [ ] Inyección · XSS · CSRF · SSRF
- [ ] Subidas de archivos
- [ ] Webhooks (firma, repetición)
- [ ] Secretos (código, logs, **bundle del cliente**)
- [ ] Dependencias
- [ ] Logging inseguro

## Evidence
<!-- Reproducción, comandos y salidas (sin secretos). -->

## Remediation
<!-- Plan por hallazgo: quién, qué, plazo. Re-auditoría requerida antes de PASS. -->
