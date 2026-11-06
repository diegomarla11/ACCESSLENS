# Contrato JSON 1.0

Esquema estructural: [scenario.schema.json](scenario.schema.json). Ejemplos: [../examples](../examples). Fuente de verdad: `src/engine/schema.ts`. Generar con `npm run schema`.

Todos los objetos son estrictos: claves adicionales se rechazan. IDs: 1–64 caracteres, letras ASCII, números, guion o guion bajo. Máximo 200 elementos por colección y por lista de referencias. Nombres: 1–120 caracteres. La CLI admite archivos hasta 1 MB. El tamaño se comprueba antes de leer y después de decodificar. Solo se aceptan archivos regulares.

| Entidad/campo | Significado |
|---|---|
| schemaVersion | Literal `1.0` |
| id, name, description | Identificación y descripción del escenario |
| resources | Recursos ficticios con id y name |
| permissions | id, resourceId y action (`read`, `write`, `admin`) |
| roles | id, name y permissionIds |
| identities | id, name, kind, employment, enabled, mfa, roleIds, requiredPermissionIds |
| kind | `human` o `service` |
| employment | `active`, `terminated` o `unknown`; solo aplica a la regla humana |
| enabled, mfa | true, false o null (desconocido); claves obligatorias |
| requiredPermissionIds | Array conocido (puede ser vacío) o null (desconocido) |

Zod realiza además validación semántica: IDs únicos por colección, ausencia de referencias repetidas y todas las referencias resueltas. Estas relaciones **no están expresadas en el JSON Schema generado**; una entrada que pasa solo un validador de JSON Schema todavía debe pasar `parseScenario`. No se convierten strings a booleanos ni se rellenan valores ausentes.
