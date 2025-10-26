@echo off
REM AI Browser - Windows Launch Script
REM ===================================

echo.
echo ======================================
echo   AI Browser - Starting...
echo ======================================
echo.

REM Check if dist folder exists
if not exist "dist\" (
    echo [ERROR] Project not built!
    echo Please run install.bat first, or run: npm run build
    echo.
    pause
    exit /b 1
)

REM Check if LM Studio might be running (optional check)
echo [INFO] Make sure LM Studio is running with:
echo        - A model loaded
echo        - Local server started on port 1234
echo.
echo Press any key to launch AI Browser...
pause >nul

REM Start the application
echo.
echo [INFO] Launching AI Browser...
echo.
npm start

