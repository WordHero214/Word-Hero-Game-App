# 🚀 Deployment Guide

## Pre-Deployment Checklist

### ✅ Configuration
- [ ] Firebase project created (word-hero-8143e)
- [ ] Firebase configuration updated in `firebase.ts`
- [ ] Gemini API key added to `.env.local`
- [ ] Admin account created in Firestore
- [ ] Firestore security rules deployed

### ✅ Testing
- [ ] All features tested locally
- [ ] Forms working correctly
- [ ] Authentication working
- [ ] Word generation working
- [ ] Certificates generating
- [ ] PWA installable

### ✅ Security
- [ ] `.env.local` not committed to git
- [ ] API keys secured
- [ ] Firestore rules deployed
- [ ] No sensitive data in code

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: `word-hero-8143e`
3. Enable Google Analytics (optional)

### 2. Enable Authentication

1. Go to Authentication → Sign-in method
2. Enable Email/Password authentication
3. No additional configuration needed

### 3. Create Firestore Database

1. Go to Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose your region (closest to users)

### 4. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

Or manually copy rules from `firestore.rules` to Firebase Console.

### 5. Create Admin Account

In Firestore Console:

1. Go to Firestore Database
2. Create collection: `users`
3. Add document with ID: `4xym5a87V6MPAXz5byttspmBAG2`
4. Add fields:
   ```json
   {
     "email": "admin@wordhero.com",
     "id": "4xym5a87V6MPAXz5byttspmBAG2",
     "name": "Admin Controller",
     "role": "ADMIN",
     "username": "admin"
   }
   ```

5. Create the admin user in Authentication:
   - Go to Authentication → Users
   - Add user with email: `admin@wordhero.com`
   - Set password
   - Copy the UID and update the Firestore document ID to match

---

## Environment Variables

### Development (.env.local)

```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
```

### Production

Set environment variables in your hosting platform:

**Vercel/Netlify:**
- Add `VITE_GEMINI_API_KEY` in dashboard

**Firebase Hosting:**
- Use Firebase Functions environment config

---

## Build for Production

### 1. Install Dependencies

```bash
npm install
```

### 2. Build

```bash
npm run build
```

This creates optimized files in `dist/` folder.

### 3. Preview Build

```bash
npm run preview
```

Test at `http://localhost:4173`

---

## Deploy to Firebase Hosting

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login

```bash
firebase login
```

### 3. Initialize

```bash
firebase init hosting
```

Configuration:
- Public directory: `dist`
- Single-page app: `Yes`
- Automatic builds: `No`

### 4. Deploy

```bash
firebase deploy --only hosting
```

Your app will be live at: `https://word-hero-8143e.web.app`

---

## Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
vercel
```

Follow prompts to deploy.

### 4. Set Environment Variables

In Vercel dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add `VITE_GEMINI_API_KEY`

---

## Deploy to Netlify

### 1. Build Settings

- Build command: `npm run build`
- Publish directory: `dist`

### 2. Environment Variables

In Netlify dashboard:
1. Site settings → Build & deploy
2. Environment → Environment variables
3. Add `VITE_GEMINI_API_KEY`

### 3. Deploy

```bash
netlify deploy --prod
```

---

## Post-Deployment

### 1. Test Production App

- [ ] Login works
- [ ] Registration works
- [ ] Word generation works
- [ ] Games work
- [ ] Certificates generate
- [ ] PWA installs
- [ ] Mobile responsive

### 2. Monitor

- Check Firebase Console for errors
- Monitor Firestore usage
- Check Authentication logs

### 3. Update DNS (if custom domain)

Point your domain to:
- Firebase: Follow Firebase Hosting custom domain guide
- Vercel: Add domain in Vercel dashboard
- Netlify: Add domain in Netlify dashboard

---

## Firestore Security Rules

Ensure these rules are deployed:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
    
    // Words collection
    match /words/{wordId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['ADMIN', 'TEACHER'];
    }
    
    // Certificates collection
    match /certificates/{certId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
```

---

## Troubleshooting

### Build Errors

**Error**: `Module not found`
```bash
npm install
npm run build
```

**Error**: `TypeScript errors`
```bash
npm run build -- --mode production
```

### Deployment Errors

**Error**: `Firebase deploy failed`
- Check Firebase CLI is logged in: `firebase login`
- Verify project: `firebase use word-hero-8143e`

**Error**: `Environment variables not working`
- Ensure variables start with `VITE_`
- Rebuild after adding variables

### Runtime Errors

**Error**: `Firebase not initialized`
- Check `firebase.ts` configuration
- Verify Firebase project ID

**Error**: `API key invalid`
- Check Gemini API key in environment variables
- Verify key is active in Google Cloud Console

---

## Performance Optimization

### 1. Enable Compression

Firebase Hosting automatically compresses files.

### 2. Cache Strategy

Service Worker caches:
- App shell
- Static assets
- Background music
- Button sounds

### 3. Lazy Loading

Components are already optimized with React lazy loading.

### 4. Image Optimization

- Use WebP format for images
- Compress PNG files
- Optimize SVG files

---

## Monitoring

### Firebase Console

Monitor:
- Authentication usage
- Firestore reads/writes
- Storage usage
- Hosting bandwidth

### Analytics

Google Analytics is enabled:
- Track user engagement
- Monitor page views
- Analyze user flow

---

## Backup Strategy

### 1. Firestore Backup

```bash
gcloud firestore export gs://word-hero-8143e-backup
```

### 2. Code Backup

- Push to GitHub regularly
- Tag releases
- Keep production branch

### 3. Environment Variables

- Document all variables
- Keep secure backup
- Use secret management

---

## Scaling Considerations

### Firestore Limits

- Free tier: 50K reads/day, 20K writes/day
- Upgrade to Blaze plan for production

### Authentication

- Free tier: Unlimited users
- Monitor for abuse

### Storage

- Free tier: 5GB
- Certificates and audio files count

---

## Security Best Practices

1. **Never commit**:
   - `.env.local`
   - API keys
   - Firebase config with sensitive data

2. **Use environment variables** for:
   - API keys
   - Database credentials
   - Third-party tokens

3. **Enable Firestore rules** for:
   - Data protection
   - Role-based access
   - Input validation

4. **Monitor** for:
   - Unusual activity
   - Failed login attempts
   - Excessive API calls

---

## Rollback Plan

If deployment fails:

1. **Revert to previous version**:
   ```bash
   firebase hosting:rollback
   ```

2. **Check logs**:
   ```bash
   firebase functions:log
   ```

3. **Restore database** (if needed):
   ```bash
   gcloud firestore import gs://word-hero-8143e-backup
   ```

---

## Support

For deployment issues:
- Check Firebase Status: https://status.firebase.google.com/
- Firebase Support: https://firebase.google.com/support
- Vercel Support: https://vercel.com/support
- Netlify Support: https://www.netlify.com/support/

---

## Summary

✅ Firebase project configured
✅ Environment variables set
✅ Build successful
✅ Deployment complete
✅ Security rules deployed
✅ Admin account created
✅ Monitoring enabled

**Your app is now live!** 🎉
