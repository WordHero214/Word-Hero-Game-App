@echo off
REM ========================================
REM GitHub Push Checklist - Login Verification
REM ========================================

echo.
echo ========================================
echo   GitHub Push Checklist
echo ========================================
echo.

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not a git repository!
    echo Please run this script from your project root.
    pause
    exit /b 1
)

echo [1/5] Checking Git configuration...
git config user.name >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git user.name not set!
    echo Please run: git config --global user.name "Your Name"
    pause
    exit /b 1
)

git config user.email >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git user.email not set!
    echo Please run: git config --global user.email "your.email@example.com"
    pause
    exit /b 1
)

echo [OK] Git user: 
git config user.name
git config user.email
echo.

echo [2/5] Checking remote repository...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No remote 'origin' configured!
    echo Please add a remote: git remote add origin YOUR_REPO_URL
    pause
    exit /b 1
)

echo [OK] Remote: 
git remote get-url origin
echo.

echo [3/5] Checking for uncommitted changes...
git diff-index --quiet HEAD --
if errorlevel 1 (
    echo [WARNING] You have uncommitted changes!
    echo.
    git status --short
    echo.
    set /p commit="Do you want to commit these changes? (y/n): "
    if /i "%commit%"=="y" (
        set /p message="Enter commit message: "
        git add .
        git commit -m "!message!"
        echo [OK] Changes committed!
    ) else (
        echo [SKIPPED] Continuing without committing...
    )
) else (
    echo [OK] No uncommitted changes
)
echo.

echo [4/5] Testing authentication...
echo Attempting dry-run push to verify login...
git push origin main --dry-run >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Authentication failed!
    echo.
    echo Please login to GitHub:
    echo   - If using HTTPS: You need a Personal Access Token
    echo   - If using SSH: Check your SSH keys with 'ssh -T git@github.com'
    echo.
    echo See docs/GITHUB_PUSH_SETUP.md for detailed instructions.
    pause
    exit /b 1
)

echo [OK] Authentication successful!
echo.

echo [5/5] Ready to push!
echo.
set /p push="Push to GitHub now? (y/n): "
if /i "%push%"=="y" (
    echo.
    echo Pushing to GitHub...
    git push origin main
    if errorlevel 1 (
        echo [ERROR] Push failed!
        pause
        exit /b 1
    )
    echo.
    echo ========================================
    echo   SUCCESS! Changes pushed to GitHub
    echo ========================================
) else (
    echo [CANCELLED] Push cancelled by user
)

echo.
pause
