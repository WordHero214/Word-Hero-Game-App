@echo off
REM ========================================
REM Setup GitHub Remote and Push
REM Repository: Word-Hero-Game-App
REM ========================================

echo.
echo ========================================
echo   Word Hero - GitHub Setup and Push
echo ========================================
echo.

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo [STEP 1] Initializing Git repository...
    git init
    echo [OK] Git repository initialized
) else (
    echo [OK] Already a Git repository
)
echo.

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [STEP 2] Adding GitHub remote repository...
    git remote add origin https://github.com/WordHero214/Word-Hero-Game-App.git
    echo [OK] Remote added: Word-Hero-Game-App
) else (
    echo [STEP 2] Updating remote repository URL...
    git remote set-url origin https://github.com/WordHero214/Word-Hero-Game-App.git
    echo [OK] Remote updated: Word-Hero-Game-App
)
echo.

echo [STEP 3] Verifying Git configuration...
git config user.name >nul 2>&1
if errorlevel 1 (
    echo Setting user name...
    git config user.name "WordHero214"
)
git config user.email >nul 2>&1
if errorlevel 1 (
    echo Setting user email...
    git config user.email "whero0085@gmail.com"
)
echo [OK] Git user: 
git config user.name
git config user.email
echo.

echo [STEP 4] Checking repository status...
git status --short
echo.

echo [STEP 5] Preparing to commit all changes...
set /p commit="Do you want to commit all changes? (y/n): "
if /i "%commit%"=="y" (
    set /p message="Enter commit message (or press Enter for default): "
    if "!message!"=="" (
        set message=Volume control feature and documentation organization
    )
    
    echo.
    echo Adding all files...
    git add .
    
    echo Committing changes...
    git commit -m "!message!"
    
    echo [OK] Changes committed!
) else (
    echo [SKIPPED] No commit made
    echo.
    echo You can commit manually later with:
    echo   git add .
    echo   git commit -m "Your message"
)
echo.

echo ========================================
echo   IMPORTANT: Authentication Required
echo ========================================
echo.
echo To push to GitHub, you need to authenticate.
echo.
echo Option 1: Personal Access Token (Recommended)
echo   1. Go to: https://github.com/settings/tokens
echo   2. Click "Generate new token (classic)"
echo   3. Select: repo and workflow
echo   4. Copy the token
echo   5. Use it as password when pushing
echo.
echo Option 2: Git Credential Manager
echo   - First push will open browser for login
echo   - Credentials will be saved automatically
echo.
echo ========================================
echo.

set /p push="Ready to push to GitHub? (y/n): "
if /i "%push%"=="y" (
    echo.
    echo Pushing to GitHub...
    echo Repository: https://github.com/WordHero214/Word-Hero-Game-App.git
    echo.
    
    git push -u origin main
    
    if errorlevel 1 (
        echo.
        echo ========================================
        echo   Push Failed - Trying 'master' branch
        echo ========================================
        echo.
        git push -u origin master
        
        if errorlevel 1 (
            echo.
            echo [ERROR] Push failed!
            echo.
            echo Common issues:
            echo   1. Authentication failed - Need Personal Access Token
            echo   2. Branch name mismatch - Check your default branch
            echo   3. No internet connection
            echo.
            echo To get a Personal Access Token:
            echo   https://github.com/settings/tokens
            echo.
            pause
            exit /b 1
        )
    )
    
    echo.
    echo ========================================
    echo   SUCCESS! Pushed to GitHub
    echo ========================================
    echo.
    echo Your code is now at:
    echo https://github.com/WordHero214/Word-Hero-Game-App
    echo.
) else (
    echo.
    echo [CANCELLED] Push cancelled
    echo.
    echo When you're ready to push, run:
    echo   git push -u origin main
    echo.
)

pause
