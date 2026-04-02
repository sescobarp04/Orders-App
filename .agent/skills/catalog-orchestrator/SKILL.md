---
name: catalog-orchestrator
description: Gestiona el ciclo de vida completo del catálogo de 'Orders_Catalog'. Úsalo cuando el usuario pida "actualizar precios", "generar catálogo", "verificar productos" o "preparar envíos".
---

# 📦 Catalog Orchestrator Skill

Esta skill permite al agente gestionar de forma autónoma el catálogo de productos de SESCOP, asegurando que los datos del Excel se sincronicen correctamente con la web y se generen materiales de marketing (PDF/HTML) de alta calidad.

## 🚀 Flujo de Trabajo Estándar

### 1. Sincronización de Datos (Excel → JSON)
- **Acción:** Ejecutar `python scripts/update_products.py`.
- **Validación:** Verificar que el archivo `data/products.json` se haya actualizado y contenga el número esperado de productos.
- **Mecanismo de Error:** Si falla (ej. columnas faltantes), analizar el Excel `lista_precios.xlsx` y proponer correcciones.

### 2. Generación de Catálogos (Visual & Email)
- **Acción:** Ejecutar `node generate-email-catalog.js`.
- **Validación:** Confirmar la creación de:
  - `catalog-email-EN.html` / `catalog-email-ES.html`
  - `catalog-full.pdf`
  - `catalog-product-list.pdf`

### 3. Auditoría de Calidad Visual
- **Acción:** Abrir el catálogo generado en el navegador integrado.
- **Puntos a Revisar:**
  - ¿Se ven las imágenes de los productos? (Verificar rutas 404).
  - ¿El diseño es "Premium" (sombras, redondeados, espaciado)?
  - ¿Los precios y unidades están alineados?

### 4. Despliegue (Opcional)
- **Acción:** Preguntar al usuario si desea subir los cambios a la web (`2-Subir_Cambios_Web.bat`).

---

## 🎨 Guía Estética (Efecto WOW)
- Las imágenes deben ser grandes y claras (3 productos por fila en PDF).
- El fondo de las tarjetas debe ser blanco puro con un borde suave.
- Usar tipografía legible y profesional (preferiblemente familia Helvetica/Arial o Google Fonts si está disponible).

## ⚠️ Restricciones
- No modificar el Excel original sin permiso explícito.
- Siempre realizar una captura de pantalla del catálogo generado para que el usuario lo valide.
