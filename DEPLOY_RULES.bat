@echo off
echo ========================================
echo Firebase Firestore Rules Deployment
echo ========================================
echo.
echo Step 1: Logging in to Firebase...
firebase login
echo.
echo Step 2: Setting project to word-hero-8143e...
firebase use --add
echo.
echo Step 3: Deploying Firestore rules...
firebase deploy --only firestore:rules
echo.
echo ========================================
echo Deployment Complete!
echo ========================================
pause
