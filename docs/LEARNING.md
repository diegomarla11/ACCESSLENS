# Aprender y defender el proyecto

## Orden recomendado
1. **Contrato y TypeScript**: abrir un JSON de `examples`, seguir `parseScenario` y explicar por qué `null` no equivale a `false`.
2. **IAM básico**: identidad, autenticación, autorización, RBAC, mínimo privilegio y ciclo de vida. Dibujar identidad → rol → permiso → recurso.
3. **Motor**: seguir una regla sin mirar la interfaz; explicar cada estado y por qué no implica seguridad completa.
4. **Correcciones**: explicar copia profunda, inmutabilidad y por qué no se cambia un rol compartido.
5. **React**: identificar estado original/copia, datos derivados, filtros y descargas Blob.
6. **Pruebas**: cambiar a propósito una condición y ver qué prueba falla. Restaurarla.
7. **CI/CD**: explicar instalación reproducible, tests, build, artefacto y publicación, con permisos de despliegue separados.

## Ejercicios que debes hacer tú
- Ejecuta `npm ci`, `npm run check` y `npm run test:e2e`; lee las salidas reales.
- Abre `examples/mfa.json`, cambia un `mfa` a null y analízalo por CLI. Debe ser «unknown», no aprobado.
- Rompe una referencia de rol en una copia del JSON. La CLI debe terminar con código 2.
- Ejecuta `npm run analyze -- --fail-on-risk examples/offboarding.json`: el código esperado es 1 porque el escenario contiene un riesgo intencionado.
- Recorre los tres casos, descarga JSON, compara antes/después y abre/imprime el HTML.
- Prueba teclado, zoom 200 %, móvil y lector de pantalla si lo tienes. Las pruebas automáticas no sustituyen estas comprobaciones.

## Respuestas honestas de entrevista
**¿Es IAM empresarial?** Es un laboratorio de revisión sobre un RBAC propio. Demuestra lógica, evidencia, validación, pruebas y entrega estática. No he administrado un IAM empresarial con este proyecto.

**¿Cambias MFA de verdad?** No: modifico los metadatos de una copia sintética. Para hacerlo de verdad necesitaría integración y permisos sobre el proveedor.

**¿Por qué sin backend?** Para que cualquiera pueda probarlo gratis y para mantener explícita la separación entre análisis de datos y control de sistemas reales.

**¿Qué aportas de tu experiencia?** Prácticas con permisos de aplicación, ERP, SQL, incidencias, automatización y documentación; además, autenticación y desarrollo web académico en FitAdapt. Cloud, IAM, contenedores y CI/CD son aprendizaje, no experiencia profesional acreditada.

**¿Qué falla en tu modelo?** No incluye denegaciones, condiciones, grupos, sesiones, credenciales ni políticas externas; la necesidad declarada puede estar equivocada. Lo indico como límite.
