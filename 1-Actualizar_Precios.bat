@echo off
cd /d "%~dp0"
echo ==========================================
echo   ACTUALIZADOR DE PRECIOS (EXCEL)
echo ==========================================
python scripts\update_products.py
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
