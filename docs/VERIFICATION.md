# Evidencias · 6 de noviembre de 2026

Entorno observado: macOS arm64, Node 22.22.3, npm 12.2.1. Verificaciones locales; no equivalen a una ejecución de GitHub Actions ni a un despliegue.

| Comprobación | Resultado observado |
|---|---|
| Instalación | npm install inicial bloqueado por DNS; completado desde caché. npm ci --offline reconstruyó dependencias con el lockfile. |
| TypeScript | `npm run typecheck`: correcto |
| Unitarias | 20 tests, 3 suites, 20 correctos, 0 fallos en la última ejecución |
| CLI predeterminada | Analizó los tres escenarios usando el motor compartido |
| CLI con archivo válido | Salida 0 |
| CLI con riesgo y --fail-on-risk | Salida 1 |
| CLI con entrada inválida | Salida 2 |
| CLI con MFA desconocido | Salida 0 y dos evaluaciones MFA `unknown`; no se confundieron con aprobado |
| Esquema y ejemplos | Generados mediante `npm run schema` |
| Producción | `npm run build`: correcto, salida dist/ |
| E2E | Bloqueado al iniciar Vite: listen EPERM en 127.0.0.1:4173; no se ejecutaron las interacciones |
| Accesibilidad automática | Prueba axe escrita, pendiente de ejecución; no se afirma cumplimiento WCAG |
| Revisión visual | No completada: servidor local prohibido y navegador bloquea URLs file: |
| GitHub Actions | Workflow preparado; ninguna ejecución remota verificada |
| GitHub Pages | No publicado ni comprobado |

Se detectaron y corrigieron dos referencias equivocadas al ID del servicio en los tests iniciales (`svc-legado` frente a `svc-legacy`). La última ejecución completa pasó. No se ocultan los límites de verificación.

## Salidas conservadas
- [Comprobaciones completas](evidence/check.log): tipos, unitarias, motor y build.
- [Build final](evidence/build.log): build posterior al ajuste de contraste del texto.
- [Códigos y estados CLI](evidence/cli.json).
- [Bloqueo E2E](evidence/e2e-blocked.log): fallo de infraestructura, no resultado positivo ni negativo sobre las interacciones.

El workflow incluye tres tests de navegador: recorrido de los tres escenarios y exportaciones, móvil/teclado/resumen inglés, y axe sobre los tres casos. Esos tests deben pasar en un entorno que permita el servidor y Chromium antes de publicar. También revisar manualmente a 200 % de zoom y con teclado/lector de pantalla.

No se ha verificado una auditoría actual de dependencias con acceso al registro. La salida de auditoría offline no demuestra ausencia de vulnerabilidades. No se ha modificado ningún CV ni perfil, ni contactado a empresas.
