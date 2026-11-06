# Publicar en GitHub Pages

## Estado
No hay despliegue público verificado. La consulta del repositorio `diegomarla11/ACCESSLENS` devolvió 404 durante esta sesión: no se puede distinguir entre inexistencia y falta de acceso. El conector disponible no permite crear repositorios ni configurar Pages, y no hay CLI `gh` instalada. No se publica en otro alojamiento sin sustituir tu elección.

## Pasos con GitHub Desktop
1. Añadir esta carpeta como repositorio local. Si Desktop avisa de que no es un repositorio, usar «Create a repository here» con nombre `ACCESSLENS` y comprobar que no crea una carpeta anidada.
2. Revisar los archivos incluidos: código, docs, ejemplos, pruebas, workflows y lockfile. `node_modules`, `dist` y resultados temporales están excluidos.
3. Crear el primer commit. Publicar en tu cuenta como **público**, desmarcando «Keep this code private».
4. En GitHub: Settings → Pages → Build and deployment → Source: **GitHub Actions**.
5. Consultar Actions → Check and publish. Debe finalizar correctamente. El trabajo `deploy` solo se ejecuta en main después de que `verify` termine correctamente. También puede ejecutarse el workflow manualmente: vuelve a comprobar el proyecto antes de publicar.
6. Abrir la URL que devuelva el despliegue; no dar por válida una URL deducida. Probar escenarios, exportaciones y recarga. El workflow configura la ruta base a partir del nombre del repositorio.
7. Añadir esa URL a README y a «About» del repositorio solo después de comprobarla. El enlace al código se configura automáticamente durante el build de Pages.

No hace falta cuenta cloud, tarjeta, dominio ni backend. Mantener main como rama inicial; si se cambia, actualizar el workflow. Las ejecuciones CI en Linux deben pasar antes de anunciar el proyecto: un build local en macOS no las verifica.

Fuentes oficiales consultadas el 6-11-2026:
- https://vite.dev/guide/static-deploy
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
