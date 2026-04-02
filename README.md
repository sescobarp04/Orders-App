# Orders App Vendedora

Aplicación de gestión de pedidos y catálogo digital para SESCOP.

## Localización
`C:\Users\Sebastian Escobar P\.gemini\antigravity\scratch\Proyectos_Antigravity\Orders_App`

## Comandos Rápidos
- `npm run dev`: Inicia el servidor de desarrollo local.
- `npm run build`: Genera la versión de producción.

## Automatización
El proyecto incluye scripts `.bat` para facilitar las tareas comunes:
1. `1-Actualizar_Precios.bat`: Sincroniza el catálogo con el archivo Excel de precios.
2. `2-Subir_Cambios_Web.bat`: Despliega la versión más reciente a Vercel.
3. `3-Generar_Ordenes_Compra.bat`: Procesa los JSON de pedidos y genera órdenes por proveedor.
4. `4-Generar_Catalogo_Email.bat`: Crea los archivos HTML y PDF para el catálogo de marketing (Detroit).

## Estructura de Exportación
Todos los archivos generados automáticamente se guardan en:
- `exports/catalogs/`: Catálogos HTML y PDF.
- `exports/orders/`: Datos de órdenes procesadas (próximamente).

## Guía Detallada
Consulta [GUIA_DE_USO.md](./GUIA_DE_USO.md) para instrucciones paso a paso.
