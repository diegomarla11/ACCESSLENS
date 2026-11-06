# Publicar en GitHub Pages

## Estado tras el primer push

Existe una copia Git local con origen `https://github.com/diegomarla11/ACCESSLENS.git`; main y origin/main apuntaban a `7016a1b` durante la revisión. La URL devuelve 404 sin sesión y no se ha confirmado una demo pública. La conexión de GitHub disponible en ChatGPT está asociada a diegomarla2, por lo que no permite inspeccionar ese repositorio desde la cuenta propietaria.

El primer commit no incluía `.github/workflows/ci.yml` ni `.gitignore` y sí incluía `node_modules`. Esta revisión restaura ambos archivos. Para completar la limpieza hay que retirar las dependencias del seguimiento de Git con `git rm -r --cached --ignore-unmatch node_modules`; no se borran del disco. Ver [revisión](REVIEW-2026-11-06.md).

## Publicación y comprobación

1. Aplicar la revisión a la carpeta del repositorio. En GitHub Desktop comprobar que se añaden `.github/workflows/ci.yml` y `.gitignore`, y que las dependencias aparecen retiradas del seguimiento. No volver a copiarlas al repositorio.
2. Ejecutar `npm ci`, `npm run check`, `npx playwright install chromium` y `npm run test:e2e`. Revisar los errores si los hubiera antes de publicar.
3. Crear el commit de la corrección en GitHub Desktop y usar Push origin.
4. Abrir el repositorio desde GitHub Desktop → Repository → View on GitHub, con la cuenta propietaria. Confirmar que la visibilidad es Public para que lo vean las empresas. Comprobar la misma URL sin sesión.
5. En GitHub: Settings → Pages → Build and deployment → Source: **GitHub Actions**.
6. Abrir Actions → **Check and publish**. El trabajo `verify` debe terminar correctamente y después `deploy`. Si el primer intento se produjo antes de configurar Pages, volver a ejecutar el workflow desde Actions.
7. Abrir la URL devuelta por el despliegue y comprobar escenarios, exportaciones y recarga. El workflow usa el nombre real del repositorio como ruta base y configura el enlace al código mediante `VITE_REPOSITORY_URL`.
8. Añadir la URL verificada a README y a About. El mensaje local «Código · pendiente de publicar» depende de esa variable de build: no comprueba GitHub en tiempo real. El primer push por sí solo no cambia la interfaz de `npm run dev`.

No hace falta cuenta cloud, tarjeta, dominio ni backend. Mantener main como rama inicial; si se cambia, actualizar el workflow. No afirmar que Actions o Pages funcionan hasta comprobar una ejecución y su URL.

Fuentes oficiales consultadas el 6-11-2026:
- https://vite.dev/guide/static-deploy
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
