# PWA Installation & Testing Commands

## ✅ Icons Setup Complete!

Your logo files are now configured and ready to use.

---

## 🚀 Development Server Commands

### Start Development Server
```bash
# Navigate to project directory
cd masteringword-main

# Start the dev server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

## 🔍 Testing PWA Installation

### 1. Desktop (Chrome/Edge)

**Step 1: Open DevTools**
```
Press F12 or Ctrl+Shift+I (Windows)
Press Cmd+Option+I (Mac)
```

**Step 2: Check PWA Status**
```
1. Go to "Application" tab
2. Click "Manifest" in left sidebar
3. Verify:
   ✅ Name: "Mastering Words - Gamified Spelling Learning"
   ✅ Short name: "Mastering Words"
   ✅ Icons: 192x192 and 512x512 visible
   ✅ Theme color: #00c2a0
   ✅ Background color: #0b1221
```

**Step 3: Check Service Worker**
```
1. Still in "Application" tab
2. Click "Service Workers" in left sidebar
3. Verify:
   ✅ Status: "activated and is running"
   ✅ Source: sw.js
```

**Step 4: Install PWA**
```
1. Look for install icon in address bar (⊕ or computer icon)
2. Click it
3. Click "Install"
4. App opens in standalone window
```

**Alternative Install Method:**
```
1. Click three dots menu (⋮)
2. Select "Install Mastering Words..."
3. Click "Install"
```

---

### 2. Mobile (Android - Chrome)

**Step 1: Access on Mobile**
```
Option A: Same Network
1. On desktop, run: npm run dev -- --host
2. Note the Network URL (e.g., http://192.168.1.x:3000)
3. Open that URL on mobile Chrome

Option B: Deploy to Hosting
1. Deploy to Vercel/Netlify/Firebase
2. Access the deployed URL on mobile
```

**Step 2: Install PWA**
```
1. Open site in Chrome
2. Tap three dots menu (⋮)
3. Tap "Add to Home screen"
4. Edit name if desired
5. Tap "Add"
6. Icon appears on home screen
```

**Step 3: Launch App**
```
1. Tap the icon on home screen
2. App opens in fullscreen (no browser UI)
3. Works like a native app!
```

---

### 3. Mobile (iOS - Safari)

**Step 1: Access on Mobile**
```
Same as Android - use network URL or deployed URL
```

**Step 2: Install PWA**
```
1. Open site in Safari
2. Tap Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Edit name if desired
5. Tap "Add"
6. Icon appears on home screen
```

**Step 3: Launch App**
```
1. Tap the icon on home screen
2. App opens in fullscreen
3. Works like a native app!
```

---

## 🌐 Expose Dev Server to Network

### Allow Mobile Access (Same WiFi)

**Windows (PowerShell):**
```powershell
cd masteringword-main
npm run dev -- --host
```

**Mac/Linux:**
```bash
cd masteringword-main
npm run dev -- --host
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.x:3000/  ← Use this on mobile
```

**Then on Mobile:**
```
1. Connect to same WiFi
2. Open browser
3. Go to: http://192.168.1.x:3000
4. Install PWA as described above
```

---

## 🔧 Troubleshooting Commands

### Clear Service Worker Cache
```bash
# In browser DevTools Console:
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});

# Then refresh page (Ctrl+Shift+R or Cmd+Shift+R)
```

### Check if Service Worker is Registered
```bash
# In browser DevTools Console:
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Registered Service Workers:', registrations.length);
  registrations.forEach(reg => console.log(reg.scope));
});
```

### Force Service Worker Update
```bash
# In browser DevTools:
# 1. Go to Application > Service Workers
# 2. Check "Update on reload"
# 3. Click "Unregister"
# 4. Refresh page (Ctrl+R)
```

### Check PWA Install Status
```bash
# In browser DevTools Console:
window.matchMedia('(display-mode: standalone)').matches
# Returns: true if installed, false if in browser
```

---

## 📱 Build for Production

### Build Command
```bash
cd masteringword-main
npm run build
```

**Expected Output:**
```
vite v5.x.x building for production...
✓ xxx modules transformed.
dist/index.html                  x.xx kB
dist/assets/index-xxxxx.js      xxx.xx kB
✓ built in x.xxs
```

### Preview Production Build
```bash
npm run preview
```

**Then test PWA installation with production build**

---

## 🚀 Deploy to Hosting

### Option 1: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd masteringword-main
vercel

# Follow prompts, then access deployed URL
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
cd masteringword-main
npm run build
netlify deploy --prod --dir=dist

# Access deployed URL
```

### Option 3: Firebase Hosting
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting

# Access deployed URL
```

---

## ✅ Verification Checklist

### Desktop Installation:
- [ ] Dev server running (`npm run dev`)
- [ ] Open http://localhost:3000
- [ ] F12 > Application > Manifest shows correct info
- [ ] F12 > Application > Service Workers shows "activated"
- [ ] Install icon appears in address bar
- [ ] Click install, app opens in standalone window
- [ ] App icon visible in Start Menu/Applications
- [ ] Favicon shows in browser tab

### Mobile Installation (Android):
- [ ] Dev server exposed (`npm run dev -- --host`)
- [ ] Mobile connected to same WiFi
- [ ] Open network URL on mobile Chrome
- [ ] Menu > "Add to Home screen" available
- [ ] Install completes successfully
- [ ] Icon appears on home screen
- [ ] Tap icon, app opens fullscreen
- [ ] No browser UI visible

### Mobile Installation (iOS):
- [ ] Open URL in Safari
- [ ] Share button > "Add to Home Screen" available
- [ ] Install completes successfully
- [ ] Icon appears on home screen
- [ ] Tap icon, app opens fullscreen
- [ ] Works like native app

### Offline Functionality:
- [ ] Install PWA
- [ ] Use app normally
- [ ] Turn off WiFi/mobile data
- [ ] Close and reopen app
- [ ] App still loads (cached)
- [ ] Basic features work offline

---

## 🎯 Quick Test Script

**Copy and paste this in browser console:**
```javascript
// Check PWA Status
console.log('=== PWA Status Check ===');
console.log('Service Worker:', 'serviceWorker' in navigator ? '✅ Supported' : '❌ Not supported');
console.log('Manifest:', document.querySelector('link[rel="manifest"]') ? '✅ Found' : '❌ Missing');
console.log('Standalone Mode:', window.matchMedia('(display-mode: standalone)').matches ? '✅ Installed' : '❌ In browser');

// Check Service Worker Registration
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs.length > 0 ? `✅ ${regs.length} registered` : '❌ None registered');
});

// Check Icons
fetch('/logo/web-app-manifest-192x192.png')
  .then(r => console.log('Icon 192x192:', r.ok ? '✅ Found' : '❌ Missing'))
  .catch(() => console.log('Icon 192x192: ❌ Error'));

fetch('/logo/web-app-manifest-512x512.png')
  .then(r => console.log('Icon 512x512:', r.ok ? '✅ Found' : '❌ Missing'))
  .catch(() => console.log('Icon 512x512: ❌ Error'));
```

---

## 📊 Expected Results

### Successful Installation:
```
✅ Service Worker: activated and running
✅ Manifest: loaded correctly
✅ Icons: 192x192 and 512x512 visible
✅ Install prompt: available
✅ Standalone mode: working
✅ Offline: basic functionality works
✅ Home screen: icon added
✅ Launch: opens in fullscreen
```

---

## 🆘 Common Issues

### Issue: Install button not showing
**Solution:**
```bash
# Check HTTPS (required for PWA)
# localhost is exempt, but deployed sites need HTTPS

# Check manifest is valid
# Open: http://localhost:3000/manifest.json
# Should show JSON without errors

# Check service worker registered
# F12 > Application > Service Workers
# Should show "activated"
```

### Issue: Icons not loading
**Solution:**
```bash
# Verify files exist
dir logo  # Windows
ls logo   # Mac/Linux

# Should show:
# - web-app-manifest-192x192.png
# - web-app-manifest-512x512.png

# Check file paths in manifest.json
# Should be: /logo/web-app-manifest-192x192.png
```

### Issue: Service worker not registering
**Solution:**
```bash
# Check sw.js exists
# Open: http://localhost:3000/sw.js
# Should show service worker code

# Check console for errors
# F12 > Console
# Look for service worker errors

# Try hard refresh
# Ctrl+Shift+R (Windows)
# Cmd+Shift+R (Mac)
```

---

## 📝 Summary

**Your PWA is ready!** 

**To test locally:**
```bash
cd masteringword-main
npm run dev
# Open http://localhost:3000
# Click install icon in address bar
```

**To test on mobile:**
```bash
cd masteringword-main
npm run dev -- --host
# Use network URL on mobile
# Add to home screen
```

**To deploy:**
```bash
npm run build
# Deploy dist folder to hosting
# Test PWA on deployed URL
```

🎉 **Your app is now installable as a PWA!**
