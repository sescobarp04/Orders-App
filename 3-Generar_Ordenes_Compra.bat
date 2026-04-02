@echo off
cd /d "%~dp0"
echo ==========================================
echo   GENERADOR DE ORDENES (PROVEEDORES)
echo ==========================================
python scripts\generar_compras.py
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
