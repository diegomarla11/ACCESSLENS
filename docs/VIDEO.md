# Guion de vídeo · 2 minutos

| Tiempo | Pantalla | Qué decir |
|---|---|---|
| 0:00–0:15 | Portada | «Soy Diego Martínez Lafuente. AccessLens es un laboratorio para entender quién conserva acceso cuando ya no debería. Todos los datos son sintéticos.» |
| 0:15–0:35 | Baja pendiente, evidencia abierta | «Lucía está dada de baja, pero su identidad sigue habilitada. El motor muestra los metadatos y los permisos que explican el hallazgo.» |
| 0:35–0:55 | Corregir y comparar | «La corrección afecta solo a esta copia. El motor vuelve a evaluar: un riesgo pasa a cero. No he cambiado ningún sistema real.» |
| 0:55–1:15 | Segundo escenario | «Aquí hay administración sin MFA según el escenario. La otra cuenta tiene MFA desconocido: queda No evaluado, no se considera segura.» |
| 1:15–1:35 | Servicio e inventario | «Este servicio solo necesita leer. La corrección le asigna un rol exclusivo y evita cambiar los roles compartidos de otras cuentas.» |
| 1:35–1:50 | Exportación JSON/HTML | «Puedo conservar entrada y resultado antes y después en JSON, o imprimir el informe HTML. El mismo motor funciona por CLI.» |
| 1:50–2:00 | Código y límites | «Es un proyecto de aprendizaje con pruebas y publicación estática. No audita AWS ni un IAM real. La próxima integración será Keycloak local.» |

Antes de grabar: confirmar pruebas y publicación, reiniciar escenarios, probar los enlaces. Si no está publicado, describirlo como demo local. No decir que CI pasó hasta consultar una ejecución remota.
