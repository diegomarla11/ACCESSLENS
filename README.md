# AccessLens

Laboratorio de revisión de accesos de **Diego Martínez Lafuente**. Una organización ficticia, tres riesgos explicables y correcciones reversibles. Datos sintéticos; análisis real sobre un RBAC propio. Proyecto personal de aprendizaje, sin integración IAM empresarial.

## Probar en local

Node **22.22.3 o posterior de la rama 22** y npm.

```bash
npm ci
npm run dev
```

Abrir la URL que imprima Vite. Sin backend, cuentas cloud, tarjeta ni API de pago. El navegador procesa los datos en memoria.

## Comprobar y usar la CLI

```bash
npm run check
npx playwright install chromium
npm run test:e2e
npm run analyze -- examples/mfa.json
npm run analyze -- --fail-on-risk examples/offboarding.json
npm run schema
```

CLI: 0 = análisis correcto; 1 = riesgos con `--fail-on-risk`; 2 = entrada inválida. Los escenarios contienen riesgos deliberados: un análisis sin ese flag no falla por encontrarlos. `npm run check` comprueba tipos, unitarias, CLI y build. E2E se ejecuta aparte y en CI. `npm run schema` regenera esquema y ejemplos.

## Qué ofrece

Tres escenarios: baja activa, administrador sin MFA según metadatos y servicio con permisos excesivos. Inventario de identidades, roles, permisos y recursos; evidencia, gravedad, propuesta, corrección de una copia, antes/después, reinicio, recorrido guiado, exportación JSON e informe HTML imprimible. Español y resumen inglés.

## Límites y estado

Solo tres reglas. «Sin hallazgo» no significa seguro. «No evaluado» identifica datos insuficientes. Las correcciones no cambian MFA ni accesos de un proveedor. Sin AWS, Keycloak, IA ni certificaciones. El enlace público se añadirá solo después de publicar y comprobar la demo. Ver [evidencias y estado real](docs/VERIFICATION.md).

## Documentación

[Plan y aceptación](docs/PLAN.md) · [Arquitectura](docs/ARCHITECTURE.md) · [Reglas](docs/RULES.md) · [Esquema](docs/SCHEMA.md) · [Decisiones](docs/DECISIONS.md) · [Aprendizaje](docs/LEARNING.md) · [Vídeo de 2 minutos](docs/VIDEO.md) · [Publicación](docs/PUBLISHING.md)

## English

A browser-based access review lab built with React and TypeScript. Three deterministic rules explain synthetic access risks and support reversible changes and before/after reports. The CLI shares the same engine. A learning project, not a production IAM product.
