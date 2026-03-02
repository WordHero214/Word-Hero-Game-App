@echo off
echo ========================================
echo   DEPLOYING FIRESTORE RULES FIX
echo ========================================
echo.
echo This will deploy the updated Firestore rules
echo to fix the student signup permissions error.
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Deploying rules to Firebase...
firebase deploy --only firestore:rules

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo   DEPLOYMENT SUCCESSFUL!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Refresh your browser (Ctrl + F5)
    echo 2. Try signing up a new student
    echo 3. Teacher list should load without errors
    echo.
) else (
    echo   DEPLOYMENT FAILED!
    echo ========================================
    echo.
    echo Please check:
    echo 1. You are logged in to Firebase CLI
    echo 2. You have permissions for project: word-hero-8143e
    echo 3. Run: firebase login
    echo.
)

pause
