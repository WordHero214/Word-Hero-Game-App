@echo off
echo ========================================
echo  Mastering Words - Quick Error Fix
echo ========================================
echo.
echo This will:
echo 1. Stop any running dev server
echo 2. Clear npm cache
echo 3. Restart the dev server
echo.
echo After this runs:
echo - Press Ctrl+Shift+R in your browser to hard refresh
echo - Or open an Incognito window
echo.
pause

echo.
echo Stopping any running processes...
taskkill /F /IM node.exe 2>nul

echo.
echo Clearing npm cache...
call npm cache clean --force

echo.
echo Starting dev server...
echo.
echo ========================================
echo  Server starting...
echo  Open: http://localhost:3000
echo  Then press: Ctrl + Shift + R
echo ========================================
echo.

call npm run dev
