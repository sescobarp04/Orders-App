@echo off
cd /d "%~dp0"
echo ==========================================
echo GENERANDO CATALOGO DE PRODUCTOS (DETROIT)
echo ==========================================
echo.
echo 1. Leyendo productos del sistema...
echo 2. Generando archivos HTML...
echo.

node generate-email-catalog.js

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al generar los archivos.
    echo Por favor reporte este error con una captura de pantalla.
    pause
    exit /b %errorlevel%
)

echo.
echo ==========================================
echo [EXITO] Archivos generados correctamente en:
echo     exports/catalogs/
echo ==========================================
echo.
echo Presione cualquier tecla para cerrar esta ventana...
pause > nul
