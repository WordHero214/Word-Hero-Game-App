@echo off
echo ========================================
echo   DEPLOYING VERCEL FIXES
echo ========================================
echo.

echo Step 1: Deploying Firestore Rules...
echo.
firebase deploy --only firestore:rules
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Firestore rules deployment failed!
    echo Please deploy manually from Firebase Console.
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Adding changes to git...
git add .

echo.
echo Step 3: Committing changes...
git commit -m "Fix: Student name overlap, background music, logo quality, and registration error"

echo.
echo Step 4: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Vercel will automatically deploy from GitHub.
echo.
echo NEXT STEPS:
echo 1. Wait 2-3 minutes for Vercel deployment
echo 2. Visit: https://word-hero-game-app.vercel.app
echo 3. Test all features (see VERCEL_DEPLOYMENT_FIXES.md)
echo.
echo Full guide: docs/VERCEL_DEPLOYMENT_FIXES.md
echo.
pause
