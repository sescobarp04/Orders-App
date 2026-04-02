@echo off
cd /d "%~dp0"
echo ==========================================
echo   SUBIR CAMBIOS A LA WEB (VERCEL)
echo ==========================================
echo Enviando cambios desde Orders_App...
call npx vercel --prod
echo.
echo Proceso terminado.
echo Presiona cualquier tecla para cerrar...
pause > nul
