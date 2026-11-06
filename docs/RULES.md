# Reglas v1

El modelo es RBAC aditivo: la unión de los permisos de los roles asignados. No hay herencia de roles, grupos, denegaciones, condiciones, sesiones ni políticas implícitas. Los permisos son IDs exactos; `admin` es una acción explícita del modelo, no el nombre de un rol.

| ID | Ámbito | Riesgo | Gravedad razonada | Corrección de laboratorio |
|---|---|---|---|---|
| AL-01 | Persona | employment=terminated y enabled=true | Alta: una baja conserva una identidad habilitada. No prueba que existan sesiones utilizables. | enabled=false |
| AL-02 | Persona con permiso action=admin | enabled=true y mfa=false | Alta: administración sin segundo factor según metadatos. No verifica MFA en un proveedor. | mfa=true en la copia |
| AL-03 | Servicio | enabled=true y permisos efectivos fuera de requiredPermissionIds | Media: privilegios superiores a la necesidad declarada; depende de que esa lista sea correcta. | Rol exclusivo con la intersección de los permisos actuales y la lista necesaria |

## Estados
- **Riesgo**: se conocen todas las condiciones necesarias y la regla se cumple.
- **Sin hallazgo**: al menos una condición necesaria conocida es falsa. No es un sello de seguridad.
- **No evaluado**: faltan datos para decidir. Por ejemplo, MFA null en un administrador habilitado; permisos necesarios null en un servicio con permisos.
- **No aplica**: regla de personas aplicada a un servicio o viceversa.

Una cuenta deshabilitada no produce riesgo activo en estas reglas, aunque falten metadatos. Una cuenta sin privilegios admin no necesita MFA para decidir AL-02. Una lista necesaria vacía es información conocida: cualquier permiso es exceso. Null significa que la necesidad no se conoce. No se infieren datos ausentes ni se transforman en true/false. Todas las reglas generan una evaluación por identidad; el filtro inicial solo muestra riesgos y no evaluados.

El motor no considera como acceso un permiso real a AWS ni valida conectividad, contraseña, SSO o tokens. «Corregido» significa que las condiciones de la regla ya no se cumplen en la copia sintética.

## Corrección de AL-03

La corrección solo puede reducir acceso: conserva `permisos efectivos ∩ requiredPermissionIds`. Si la lista necesaria incluye un permiso que la cuenta no tenía, no lo concede. Comprobar permisos funcionales que falten queda fuera de esta regla. No se alteran los roles existentes ni los permisos de otras identidades. Si el escenario ya tiene 200 roles, se informa del límite y se conserva la entrada; el nombre del nuevo rol respeta el máximo de 120 caracteres.
