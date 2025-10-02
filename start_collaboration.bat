@echo off
REM ========================================
REM AIRCLOUD COLLABORATION - QUICK START
REM ========================================
REM Author: Lukasz Kolodziej
REM Company: Aircloud
REM ========================================

cls
echo.
echo ========================================
echo   AIRCLOUD COLLABORATION v3.0.0
echo ========================================
echo   Starting application...
echo ========================================
echo.

cd /d "%~dp0aircloud-platform"

REM Activate virtual environment
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
    echo Virtual environment activated!
) else (
    echo WARNING: Virtual environment not found!
    echo Please run setup_collaboration.bat first.
    pause
    exit /b 1
)

echo.
echo Starting Aircloud Platform with collaboration features...
echo.
echo Application will be available at:
echo   http://localhost:5001
echo.
echo Demo credentials:
echo   Username: lukasz.kolodziej
echo   Password: aircloud2025
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

python aircloud_legal_platform.py

pause
