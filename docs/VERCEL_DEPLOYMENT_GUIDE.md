# Vercel Deployment Guide - Fix Firebase API Key Error

## Problem
After deploying to Vercel, you see this error:
```
An API Key must be set when running in a browser
```

## Root Cause
Vercel doesn't have access to your `.env.local` file. Environment variables must be added directly in the Vercel dashboard.

---

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your project: `word-hero-game-app`
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add All Environment Variables

Add these 8 environment variables one by one:

#### Firebase Variables (7 total)
```
Name: VITE_FIREBASE_API_KEY
Value: AIzaSyChqt1VSOu7XIGqexvJm6ng2iI7vlut_6s

Name: VITE_FIREBASE_AUTH_DOMAIN
Value: word-hero-8143e.firebaseapp.com

Name: VITE_FIREBASE_PROJECT_ID
Value: word-hero-8143e

Name: VITE_FIREBASE_STORAGE_BUCKET
Value: word-hero-8143e.firebasestorage.app

Name: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 1047515656125

Name: VITE_FIREBASE_APP_ID
Value: 1:1047515656125:web:3eefc5a475535f88836cd4

Name: VITE_FIREBASE_MEASUREMENT_ID
Value: G-HWZBHG29MW
```

#### Gemini API Variable (1 total)
```
Name: VITE_GEMINI_API_KEY
Value: AIzaSyAnsFIsCLvE5JSCdgZy4oUJ1JktTcOjiOA
```

### Step 3: Select Environment Scope
For each variable, select:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 4: Redeploy
After adding all variables:
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## Quick Copy-Paste Format

If Vercel allows bulk import, use this format:

```env
VITE_FIREBASE_API_KEY=AIzaSyChqt1VSOu7XIGqexvJm6ng2iI7vlut_6s
VITE_FIREBASE_AUTH_DOMAIN=word-hero-8143e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=word-hero-8143e
VITE_FIREBASE_STORAGE_BUCKET=word-hero-8143e.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1047515656125
VITE_FIREBASE_APP_ID=1:1047515656125:web:3eefc5a475535f88836cd4
VITE_FIREBASE_MEASUREMENT_ID=G-HWZBHG29MW
VITE_GEMINI_API_KEY=AIzaSyAnsFIsCLvE5JSCdgZy4oUJ1JktTcOjiOA
```

---

## Verification

After redeployment:
1. Visit your Vercel URL: https://word-hero-game-app.vercel.app
2. Open browser console (F12)
3. Check for Firebase errors - should be gone
4. Try logging in - should work
5. Test word generation - should work

---

## Troubleshooting

### Error Still Appears
- Double-check all variable names (case-sensitive)
- Ensure all values are correct (no extra spaces)
- Make sure you clicked "Save" for each variable
- Redeploy after adding variables

### Firebase Connection Issues
- Verify Firebase project is active
- Check Firebase console for any restrictions
- Ensure Vercel domain is whitelisted in Firebase

### Build Fails
- Check build logs in Vercel
- Ensure `package.json` has all dependencies
- Try clearing Vercel cache and redeploying

---

## Security Note

These API keys are client-side keys and are safe to expose in the browser. However:
- Firebase security rules protect your data
- Gemini API key should have usage limits set
- Monitor usage in respective consoles

---

## Next Steps

After successful deployment:
1. Test all features on Vercel URL
2. Update Firebase authorized domains if needed
3. Set up custom domain (optional)
4. Monitor Firebase and Gemini usage

---

**Deployment URL**: https://word-hero-game-app.vercel.app
**Firebase Console**: https://console.firebase.google.com/project/word-hero-8143e
**Vercel Dashboard**: https://vercel.com/dashboard
