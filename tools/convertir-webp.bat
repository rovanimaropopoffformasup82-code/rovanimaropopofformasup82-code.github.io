@echo off
REM Glisse une image ou un dossier sur ce fichier pour le convertir en WebP.
REM Sans rien glisser : convertit tout le dossier assets/images.
setlocal
cd /d "%~dp0.."
if "%~1"=="" (
    python "tools\to-webp.py"
) else (
    python "tools\to-webp.py" %*
)
echo.
pause
