# AccessLens · Alcance y aceptación

## Objetivo
En menos de dos minutos, una persona ajena al proyecto debe poder explicar el problema de un acceso residual, localizar evidencia, corregir una copia y descargar la comparación. No requiere cuenta ni servicios cloud.

## Fases pequeñas
1. Contrato: identidades, roles, permisos y recursos; validación estructural y referencias. Aceptación: JSON inválido o ambiguo se rechaza; null significa desconocido.
2. Motor y CLI: tres reglas, cuatro estados, evidencia y correcciones sin mutación. Aceptación: tests cubren riesgo, ausencia de riesgo, incertidumbre, referencias rotas y aislamiento entre identidades.
3. Demo: tres escenarios, inventario, filtros, recorrido, corrección, reinicio y exportaciones. Aceptación: recorrido automatizado en navegador y comprobación móvil; nada requiere registro.
4. Evidencias: README, esquema, decisiones, límites, guía de aprendizaje y vídeo. Aceptación: comandos reproducibles y resultados observados, sin promesas de certificación.
5. Publicación: repositorio público, CI y Pages. Aceptación: ejecución remota verde y URL accesible comprobadas; configuración local no equivale a despliegue.

## Fuera del MVP
Backend, importación por interfaz, autenticación de visitantes, conexiones reales a IAM, AWS, Keycloak, IA, Docker y evaluación de cumplimiento. No son necesarios para demostrar el motor. No se atribuye experiencia profesional nueva al autor.

## Criterios manuales
- Abrir cada escenario y distinguir riesgo de «No evaluado».
- Abrir evidencia y localizar el permiso que deriva del rol.
- Corregir: el número actual disminuye; el original no cambia.
- Reiniciar y volver al resultado inicial.
- Buscar en identidades, roles, permisos y recursos.
- Descargar ambos formatos; comprobar antes/después e imprimir HTML.
- Navegar con teclado y probar a 390 px sin desplazamiento horizontal.
- Explicar qué no demuestra el laboratorio.
