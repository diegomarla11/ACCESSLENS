# Decisiones y límites

- **React + TypeScript + Vite**: interfaz estática pequeña; sin servidor ni secretos. Node 22.22.3 es el entorno local previsto; CI usa Node 22. Versiones fijadas y resueltas en package-lock; instalación offline reproducida con npm ci.
- **Tres reglas**: suficiente para demostrar ciclo de vida, MFA y mínimo privilegio sin prometer cobertura IAM completa.
- **RBAC propio**: explicable en una entrevista; no es un evaluador de AWS IAM. La lista necesaria es un dato declarado, no una inferencia del motor.
- **Estado en memoria**: reinicio sencillo, sin cuentas ni conservación de datos del visitante. Se mantienen original y copia.
- **Node test runner y Playwright**: pruebas unitarias sin otro framework; navegador para el recorrido. No confundir tests escritos con tests ejecutados.
- **Zod + JSON Schema generado**: contrato tipado y exportable; las referencias se comprueban aparte.
- **Sin gráficos de cumplimiento**: solo recuentos derivados de reglas y entidades concretas.
- **Sin importador web**: la entrada personalizada está disponible por CLI; se acota el MVP público.
- **Sin Docker en el MVP**: no hay servicio que orquestar. Se añadirá para Keycloak cuando aporte una integración comprobable.
- **Dependencias**: versiones elegidas entre las disponibles localmente ante la restricción de red. No se afirma que se haya realizado una auditoría actual de vulnerabilidades. Antes de publicación, revisar avisos y ejecutar comprobaciones con acceso a npm.

## Próxima ampliación preferida: Keycloak local
Todavía no implementada. Crear un realm de laboratorio con cliente público, flujo Authorization Code + PKCE, dos roles y cuentas sintéticas. La app pública continúa funcionando sin Keycloak. La demo local deberá autenticar realmente y verificar la diferencia entre autenticación, asignación de roles y autorización. Credenciales administrativas fuera del frontend, sin secretos en Git. Aceptación: login/logout, token validado por el componente que lo consume y acceso rechazado cuando falte el rol. Se estudiará la documentación oficial al implementarlo.

## Alternativa AWS
Adaptador de importación local con semántica explícita y documentación oficial antes de escribirlo. No calcular «permisos efectivos AWS» a partir de una sola política: intervienen condiciones, denegaciones y más capas. Cualquier elemento no soportado debe dar «No evaluado». Sin cuentas cloud ni despliegue AWS en el MVP.

IA queda para una función futura demostrable; estas reglas no son IA.
