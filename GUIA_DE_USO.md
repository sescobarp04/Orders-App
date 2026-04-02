# Guía de Uso de la Aplicación de Órdenes

Esta guía explica cómo localizar, ejecutar y utilizar la aplicación de gestión de órdenes.

## 1. Localización de la Aplicación

La aplicación se encuentra en la siguiente ruta de tu sistema:
`C:\Users\Sebastian Escobar P\.gemini\antigravity\scratch\Proyectos_Antigravity\Orders_App`

## 2. Cómo abrir una terminal y ejecutar la aplicación

Hay varias formas de abrir una terminal, pero esta es la más fácil para este caso:

### Método rápido (Recomendado):
1.  **Abre el Explorador de Archivos** y ve a la carpeta: `C:\Users\Sebastian Escobar P\.gemini\antigravity\scratch\Proyectos_Antigravity\Orders_App`
2.  **Haz clic en la barra de direcciones** (donde dice la ruta arriba).
3.  Borra lo que dice ahí, escribe `cmd` y presiona **Enter**.
4.  Se abrirá una ventana negra (la terminal) ya ubicada en esa carpeta.

### Método tradicional:
1.  Presiona la tecla **Windows** en tu teclado.
2.  Escribe **PowerShell** y presiona **Enter**.
3.  Copia y pega este comando y presiona **Enter**:
    ```powershell
    cd "C:\Users\Sebastian Escobar P\.gemini\antigravity\scratch\Proyectos_Antigravity\Orders_App"
    ```

### Una vez abierta la terminal:
1.  **Ejecuta el comando**:
    ```powershell
    npm run dev
    ```
2.  **Abre tu navegador** (Chrome o Edge) y ve a: [http://localhost:3000](http://localhost:3000)

---

## 3. Gestionar el Pedido (Ver, Editar y Borrar)

Ahora puedes revisar y modificar tu pedido completo antes de finalizarlo:

1.  **Ver el Pedido**: Haz clic en el botón flotante azul de **"Ver pedido"** que aparece abajo cuando tienes productos agregados.
2.  **Modificar Cantidades**: Dentro del resumen, puedes subir o bajar cantidades con los botones **(+)** y **(-)**.
3.  **Borrar Productos**: Toca el icono de la **papelera** para quitar un producto que agregaste por error.
4.  **Limpiar todo**: Tienes una opción para borrar toda la lista si quieres empezar una orden nueva.
5.  **Enviar o Descargar (NUEVO)**: Al final del resumen verás dos botones nuevos:
    *   **WhatsApp**: Abre WhatsApp con un mensaje ya listo con todos los productos y el total para enviarlo a la oficina.
    *   **PDF**: Genera y descarga un documento profesional con la orden de compra.

---

## 5. Actualizar Precios y Productos (Desde Excel)

Tienes una forma automática de actualizar todo el catálogo usando tu archivo de **Excel**. Sigue estos pasos:

1.  **Edita tu Excel**: Abre el archivo que tienes en:
    `C:\Users\Sebastian Escobar P\Documents\Sebastian\Oficina\Antigravity\inputs\lista_precios.xlsx`
    *   Puedes cambiar precios, nombres, o agregar filas nuevas.
    *   Asegúrate de mantener las columnas: **PRODUCTO**, **SKU**, **Costo**, **Don Roque**, etc.
2.  **Ejecuta el actualizador**: Abre la carpeta de la aplicación y haz **doble clic** en el archivo:
    `1-Actualizar_Precios.bat`
3.  **Listo**: El sistema leerá el Excel y actualizará la aplicación automáticamente. Solo necesitas refrescar la página en Chrome.

---

## 6. Acceso desde iPad o Tablet (Vendedora)

### Opción A: En la misma red Wi-Fi
Para probarla en casa u oficina:
1.  Asegúrate de que la computadora esté encendida y corriendo el comando `npm run dev`.
2.  En el iPad, abre el navegador y escribe: `http://192.168.1.15:3000`.

---

## 7. Actualizar la Página Web (Internet)

Cada vez que hagas cambios en el código, en el logo, o ejecutes el actualizador de Excel, debes "subir" esos cambios para que la vendedora los vea en su tablet. Sigue estos pasos:

1.  **Abre la carpeta de la aplicación**.
2.  **Cierra el servidor local** (si la ventana negra de `npm run dev` está abierta, ciérrala).
3.  **Haz doble clic** en el archivo:
    `2-Subir_Cambios_Web.bat`
4.  **Espera**: Se abrirá una ventana que mostrará el progreso. Cuando termine, se cerrará sola o te pedirá presionar una tecla.
5.  **Listo**: La vendedora ya puede entrar a [https://orders-app-kappa.vercel.app](https://orders-app-kappa.vercel.app) y verá la versión más reciente.

---

## 4. Agregar Imágenes a los Productos

La aplicación ya está preparada para mostrar fotos. Solo necesitas seguir estos pasos:

1.  **Formato**: Las fotos deben ser **JPG**.
2.  **Carpeta**: Guarda los archivos en:
    `C:\Users\Sebastian Escobar P\.gemini\antigravity\scratch\Proyectos_Antigravity\Orders_App\public\images\products\`
3.  **Nombre**: El nombre del archivo debe ser igual al **SKU** del producto. 
    - Ejemplo: Si el SKU es `A-TELA-CAJ`, el archivo debe llamarse `A-TELA-CAJ.jpg`.

---

## 5. Recomendación de Navegador
Te recomiendo usar **Google Chrome** para el día a día del desarrollo, aunque la vendedora puede usar Safari o Chrome en su iPad sin problemas.
---

## 8. Generar Órdenes para Proveedores (Solo Admin)

Este proceso te permite sumar todos los pedidos de la vendedora y generar los archivos de compra para tus proveedores.

### Paso 1: Recibir el archivo de la vendedora
1.  La vendedora seleccionará **"Finalizar y Confirmar Orden"** en su app.
2.  Ella te enviará un archivo por WhatsApp que termina en `.json` (ej: `PEDIDO_CLIENTE_123.json`).

### Paso 2: Organizar los pedidos
1.  Copia esos archivos `.json` a la siguiente carpeta en tu computadora:
    `Documents\Sebastian\Oficina\Antigravity\pedidos_recibidos`

### Paso 3: Correr el generador de compras
1.  En la carpeta de la aplicación, haz **doble clic** en:
    `3-Generar_Ordenes_Compra.bat`
2.  El sistema leerá todos los archivos JSON, los sumará por producto y separará las listas por **Proveedor**.

### Paso 4: Revisar resultados
1.  Tus órdenes de compra listas para enviar a los proveedores estarán en:
    `Documents\Sebastian\Oficina\Antigravity\compras_proveedores`
    *   Verás archivos como `COMPRA_Rikobites_Fecha.xlsx`.
    *   Estos archivos incluyen tus **costos de compra**.

---

## 9. Generar Catálogo para Correo (Detroit)

Sigue estos pasos para generar los archivos necesarios para expandir al mercado de Detroit:

### Paso 1: Generar los archivos
1.  Abre la carpeta de la aplicación en tu computadora.
2.  Haz **doble clic** en el archivo:
    `4-Generar_Catalogo_Email.bat`
3.  Se abrirá una ventana que mostrará el progreso. Al terminar, verás un mensaje de éxito.

En la carpeta **`exports/catalogs/`** se habrán creado los archivos necesarios:
*   **`catalog-email-EN.html` / `catalog-email-ES.html`**: El diseño para pegar en el cuerpo de tu correo (Inglés o Español).
*   **`catalog-full.pdf`**: El catálogo visual listo para adjuntar.
*   **`catalog-product-list.pdf`**: La lista completa de productos lista para adjuntar.

### Paso 3: Cómo enviar el correo profesional
1.  Abre **`catalog-email-EN.html`** o **`catalog-email-ES.html`** con Google Chrome (desde la carpeta `exports/catalogs/`).
2.  Presiona **Ctrl + A** (seleccionar todo) y luego **Ctrl + C** (copiar).
3.  Abre tu **Gmail** y presiona **Redactar**.
4.  Haz clic en el cuerpo del mensaje y presiona **Ctrl + V** (pegar). ¡Verás el diseño profesional listo!
5.  Adjunta los archivos **`catalog-full.pdf`** y **`catalog-product-list.pdf`** que se encuentran en la misma carpeta.
