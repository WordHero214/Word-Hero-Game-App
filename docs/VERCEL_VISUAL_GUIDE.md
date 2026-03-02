# Vercel Environment Variables - Visual Guide

## 🎯 Goal
Fix the "API Key must be set" error by adding environment variables to Vercel.

---

## 📍 Step-by-Step with Screenshots

### Step 1: Access Vercel Dashboard

```
1. Open browser
2. Go to: https://vercel.com/dashboard
3. You should see your projects list
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│  Vercel Dashboard                       │
├─────────────────────────────────────────┤
│  Projects:                              │
│  ┌───────────────────────────────────┐ │
│  │ word-hero-game-app                │ │
│  │ Last deployed: X minutes ago      │ │
│  │ [Visit] [Settings]                │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Action:** Click on "word-hero-game-app" project

---

### Step 2: Navigate to Settings

```
1. You're now in the project page
2. Look for tabs at the top
3. Click "Settings" tab
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│ [Overview] [Deployments] [Settings]     │
├─────────────────────────────────────────┤
│  word-hero-game-app                     │
└─────────────────────────────────────────┘
```

**Action:** Click "Settings"

---

### Step 3: Find Environment Variables

```
1. You're now in Settings
2. Look at left sidebar
3. Find "Environment Variables"
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│ Settings                                │
├──────────────┬──────────────────────────┤
│ General      │                          │
│ Domains      │  Environment Variables   │
│ Environment  │                          │
│ Variables ◄──┤  Add environment         │
│ Git          │  variables to your       │
│ Functions    │  project                 │
│              │                          │
└──────────────┴──────────────────────────┘
```

**Action:** Click "Environment Variables" in sidebar

---

### Step 4: Add First Variable

```
1. You'll see "Add New" button or form
2. Click to add a new variable
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ [+ Add New]                             │
│                                         │
│ Or use form below:                      │
│                                         │
│ Key:   [________________]               │
│ Value: [________________]               │
│                                         │
│ Environment:                            │
│ ☐ Production                            │
│ ☐ Preview                               │
│ ☐ Development                           │
│                                         │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

---

### Step 5: Enter Variable Details

**For FIRST variable:**

```
Key:   VITE_FIREBASE_API_KEY
Value: AIzaSyChqt1VSOu7XIGqexvJm6ng2iI7vlut_6s

Environment:
☑ Production
☑ Preview
☑ Development
```

**Action:** Click "Save"

---

### Step 6: Repeat for All 8 Variables

**Variable 2:**
```
Key:   VITE_FIREBASE_AUTH_DOMAIN
Value: word-hero-8143e.firebaseapp.com
```

**Variable 3:**
```
Key:   VITE_FIREBASE_PROJECT_ID
Value: word-hero-8143e
```

**Variable 4:**
```
Key:   VITE_FIREBASE_STORAGE_BUCKET
Value: word-hero-8143e.firebasestorage.app
```

**Variable 5:**
```
Key:   VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 1047515656125
```

**Variable 6:**
```
Key:   VITE_FIREBASE_APP_ID
Value: 1:1047515656125:web:3eefc5a475535f88836cd4
```

**Variable 7:**
```
Key:   VITE_FIREBASE_MEASUREMENT_ID
Value: G-HWZBHG29MW
```

**Variable 8:**
```
Key:   VITE_GEMINI_API_KEY
Value: AIzaSyAnsFIsCLvE5JSCdgZy4oUJ1JktTcOjiOA
```

**For each:** Select Production, Preview, Development, then Save

---

### Step 7: Verify All Variables Added

**What you should see:**
```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables                    [+ Add New]    │
├─────────────────────────────────────────────────────────┤
│ VITE_FIREBASE_API_KEY                                   │
│ Value: AIzaSy... (hidden)                               │
│ Environments: Production, Preview, Development          │
│ [Edit] [Delete]                                         │
├─────────────────────────────────────────────────────────┤
│ VITE_FIREBASE_AUTH_DOMAIN                               │
│ Value: word-hero-8143e.firebaseapp.com                  │
│ Environments: Production, Preview, Development          │
│ [Edit] [Delete]                                         │
├─────────────────────────────────────────────────────────┤
│ ... (6 more variables)                                  │
└─────────────────────────────────────────────────────────┘
```

**Check:** You should see all 8 variables listed

---

### Step 8: Redeploy

```
1. Click "Deployments" tab at top
2. Find the latest deployment
3. Click three dots (...) menu
4. Select "Redeploy"
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│ [Overview] [Deployments] [Settings]     │
├─────────────────────────────────────────┤
│ Deployments                             │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Production                          │ │
│ │ main branch                         │ │
│ │ 2 minutes ago                  [...] │ │
│ │                                     │ │
│ │ Click [...] then:                   │ │
│ │ • Redeploy ◄── Click this           │ │
│ │ • View Deployment                   │ │
│ │ • View Source                       │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Action:** Click "Redeploy"

---

### Step 9: Wait for Deployment

```
Status will show:
1. Building... (1-2 minutes)
2. Deploying... (30 seconds)
3. Ready ✓
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│ Building...                             │
│ ████████████░░░░░░░░░░░░░░░░ 60%       │
│                                         │
│ Installing dependencies...              │
│ Running build command...                │
│ Optimizing output...                    │
└─────────────────────────────────────────┘
```

**Wait:** 2-3 minutes for completion

---

### Step 10: Test Your App

```
1. Click "Visit" button or go to:
   https://word-hero-game-app.vercel.app

2. Open browser console (F12)

3. Check for errors
```

**Before fix:**
```
❌ Error: An API Key must be set when running in a browser
```

**After fix:**
```
✅ No Firebase errors
✅ App loads correctly
✅ Login works
✅ Features work
```

---

## 🎉 Success Indicators

You'll know it worked when:

1. ✅ No console errors about API keys
2. ✅ Firebase connection established
3. ✅ Login page loads
4. ✅ Can create account
5. ✅ Can log in
6. ✅ Dashboard loads
7. ✅ Word generation works
8. ✅ Games work

---

## ⚠️ Common Mistakes

### Mistake 1: Typo in Variable Name
```
❌ VITE_FIREBASE_API_KEY  (extra space)
❌ VITE_FIREBASE_APIKEY   (missing underscore)
✅ VITE_FIREBASE_API_KEY  (correct)
```

### Mistake 2: Wrong Environment Selected
```
❌ Only Production selected
✅ Production + Preview + Development all selected
```

### Mistake 3: Forgot to Redeploy
```
❌ Added variables but didn't redeploy
✅ Added variables AND redeployed
```

### Mistake 4: Extra Spaces in Value
```
❌ " AIzaSy..." (space before)
❌ "AIzaSy... " (space after)
✅ "AIzaSy..."  (no spaces)
```

---

## 🔧 Troubleshooting

### Error Still Appears?

**Check 1:** Count your variables
- Should have exactly 8 variables
- Check the list in Step 6

**Check 2:** Verify names match exactly
- Copy from `VERCEL_ENV_SETUP.txt`
- Case-sensitive!

**Check 3:** Clear browser cache
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or use incognito/private window

**Check 4:** Check build logs
- Go to Deployments
- Click on latest deployment
- Check logs for errors

---

## 📚 Additional Resources

- **Quick copy-paste**: `VERCEL_ENV_SETUP.txt`
- **Detailed guide**: `docs/VERCEL_DEPLOYMENT_GUIDE.md`
- **Checklist**: `VERCEL_FIX_CHECKLIST.txt`
- **Summary**: `docs/VERCEL_ERROR_FIXED.md`

---

## ⏱️ Time Estimate

- Adding variables: 5 minutes
- Redeployment: 2-3 minutes
- Testing: 2 minutes
- **Total: ~10 minutes**

---

## 💡 Pro Tips

1. **Copy-paste** values from `VERCEL_ENV_SETUP.txt` to avoid typos
2. **Double-check** each variable name before saving
3. **Select all three** environments for each variable
4. **Wait** for deployment to complete before testing
5. **Use incognito** window for testing to avoid cache issues

---

**Ready?** Start with Step 1 and follow along! 🚀
