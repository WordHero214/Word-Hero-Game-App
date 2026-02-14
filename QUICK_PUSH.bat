@echo off
REM ========================================
REM Quick Push to GitHub with Login Check
REM ========================================

echo.
echo ========================================
echo   Quick Push to GitHub
echo ========================================
echo.

REM Get commit message from user
set /p message="Enter commit message: "

if "%message%"=="" (
    echo [ERROR] Commit message cannot be empty!
    pause
    exit /b 1
)

echo.
echo [1/4] Adding all changes...
git add .
echo [OK] Changes staged

echo.
echo [2/4] Committing changes...
git commit -m "%message%"
if errorlevel 1 (
    echo [WARNING] Nothing to commit or commit failed
)

echo.
echo [3/4] Verifying authentication...
git push origin main --dry-run >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Authentication failed!
    echo.
    echo You need to login to GitHub first.
    echo See docs/GITHUB_PUSH_SETUP.md for instructions.
    echo.
    pause
    exit /b 1
)
echo [OK] Authenticated

echo.
echo [4/4] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo [ERROR] Push failed!
    echo.
    echo Common issues:
    echo   - Not logged in to GitHub
    echo   - No internet connection
    echo   - Branch protection rules
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Pushed to GitHub
echo ========================================
echo.
echo Commit: %message%
echo.
pause
