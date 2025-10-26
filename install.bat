@echo off
REM AI Browser - Windows Installation Script
REM =========================================

echo.
echo ======================================
echo   AI Browser - Installation Script
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Display Node.js version
echo [INFO] Node.js version:
node --version
echo.

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [INFO] npm version:
npm --version
echo.

REM Install dependencies
echo [STEP 1/2] Installing dependencies...
echo This may take a few minutes...
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Installation failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Dependencies installed!
echo.

REM Build TypeScript
echo [STEP 2/2] Building TypeScript...
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Build completed!
echo.
echo ======================================
echo   Installation Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Start LM Studio and load a model
echo 2. Start LM Studio's local server (port 1234)
echo 3. Run: start.bat (or: npm start)
echo.
echo For help, read START_HERE.md
echo.
pause

