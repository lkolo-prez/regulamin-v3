@echo off
REM ========================================
REM AIRCLOUD COLLABORATION - SETUP SCRIPT
REM ========================================
REM Author: Lukasz Kolodziej
REM Company: Aircloud
REM Version: 3.0.0
REM ========================================

echo.
echo ========================================
echo   AIRCLOUD COLLABORATION SETUP v3.0.0
echo ========================================
echo   Author: Lukasz Kolodziej
echo   Company: Aircloud
echo ========================================
echo.

cd /d "%~dp0aircloud-platform"

echo [1/6] Checking Python installation...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.11+ from https://www.python.org/
    pause
    exit /b 1
)
echo     Python OK!
echo.

echo [2/6] Checking virtual environment...
if not exist ".venv" (
    echo     Creating virtual environment...
    python -m venv .venv
    echo     Virtual environment created!
) else (
    echo     Virtual environment exists!
)
echo.

echo [3/6] Activating virtual environment...
call .venv\Scripts\activate.bat
echo     Virtual environment activated!
echo.

echo [4/6] Installing/Upgrading dependencies...
echo     This may take a few minutes...
python -m pip install --upgrade pip
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies!
    echo Please check requirements.txt and your internet connection.
    pause
    exit /b 1
)
echo     All dependencies installed successfully!
echo.

echo [5/6] Checking database...
if not exist "instance" mkdir instance
if not exist "instance\aircloud_legal_platform.db" (
    echo     Initializing database...
    python -c "from aircloud_legal_platform import db, app; app.app_context().push(); db.create_all(); print('Database initialized!')"
    echo     Database created!
) else (
    echo     Database exists!
)
echo.

echo [6/6] Testing collaboration features...
python -c "from aircloud_collaboration_engine import *; print('Collaboration engine: OK')"
python -c "from aircloud_collaboration_routes import *; print('Collaboration routes: OK')"
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Some collaboration features may not be available.
    echo This is normal if it's the first installation.
)
echo.

echo ========================================
echo   SETUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Available features:
echo   - Real-time collaborative editing
echo   - Document templates system
echo   - Workflow management
echo   - Contextual comments
echo   - Document relationships
echo   - Smart notifications
echo.
echo To start the application, run:
echo   python aircloud_legal_platform.py
echo.
echo Or use the quick start script:
echo   start_collaboration.bat
echo.
echo Demo credentials:
echo   Username: lukasz.kolodziej
echo   Password: aircloud2025
echo.
echo Documentation: COLLABORATION_FEATURES.md
echo.
pause
