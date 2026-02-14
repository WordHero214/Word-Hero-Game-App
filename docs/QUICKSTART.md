# 🚀 Quick Start Guide

## Firebase Backend is Now Integrated!

Your Mastering Words app now has a fully functional Firebase backend with authentication and data persistence.

## ⚡ Quick Setup (5 minutes)

### Step 1: Enable Firebase Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **word-hero-7124d**
3. Click **Authentication** → **Get Started**
4. Click **Email/Password** → Toggle **Enable** → **Save**

### Step 2: Create Firestore Database
1. Click **Firestore Database** → **Create database**
2. Select **Start in production mode** → **Next**
3. Choose location (e.g., **us-central**) → **Enable**
4. Wait for database to be created (~30 seconds)

### Step 3: Set Security Rules
1. In Firestore, click **Rules** tab
2. Replace all content with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isSignedIn() && (request.auth.uid == userId || getUserRole() == 'ADMIN');
      allow delete: if isSignedIn() && getUserRole() == 'ADMIN';
    }
    
    match /words/{wordId} {
      allow read: if isSignedIn();
      allow create, update, delete: if isSignedIn() && (getUserRole() == 'TEACHER' || getUserRole() == 'ADMIN');
    }
  }
}
```

3. Click **Publish**

### Step 4: Create Admin Account
1. In Firebase Console, go to **Authentication** → **Users**
2. Click **Add user**
3. Email: `admin@wordhero.com`
4. Password: `Admin123!`
5. Click **Add user**
6. **Copy the User UID** (you'll need it next)

7. Go to **Firestore Database** → **Start collection**
8. Collection ID: `users`
9. Document ID: [paste the User UID you copied]
10. Add these fields:

| Field | Type | Value |
|-------|------|-------|
| id | string | [User UID] |
| name | string | Admin Controller |
| email | string | admin@wordhero.com |
| username | string | admin |
| role | string | ADMIN |
| createdAt | timestamp | [click "Set to current time"] |

11. Click **Save**

**Note:** Admin accounts don't need student-specific fields like sparkies, badges, levelProgress, etc. They're only for user management.

### Step 5: Run the App
```bash
npm run dev
```

### Step 6: Seed Initial Words
1. Open the app in browser
2. Login as admin: `admin@wordhero.com` / `Admin123!`
3. Open browser console (F12)
4. Run this command:
```javascript
import('./seedWords.js').then(m => m.seedInitialWords())
```
5. Wait for "Seeding complete!" message

## ✅ You're Done!

Now you can:
- **Register students** via the app (they can self-register)
- **Create teachers** via admin panel
- **Play games** and progress will save automatically
- **Close browser** and come back - all data persists!

## 🧪 Test It

1. **Test Student Registration**:
   - Click "Not registered? Create a student account"
   - Fill in: name, email, password, grade, section
   - Click "Join the Class"
   - You should be logged in automatically

2. **Test Gameplay**:
   - Click "Start Playing"
   - Choose "Easy Mode"
   - Play a game
   - Check your sparkies increase
   - Refresh page - progress should persist

3. **Test Admin**:
   - Logout
   - Login as admin
   - Go to admin dashboard
   - Create a teacher account
   - Check Firebase Console - teacher should appear

## 🐛 Troubleshooting

**"Permission denied" error**
- Make sure security rules are published
- Verify you're logged in

**"User data not found"**
- Check Firestore has user document
- Document ID must match Auth UID

**Words not loading**
- Run the seed script from console
- Check Firestore has `words` collection

**Can't login**
- Verify Email/Password auth is enabled
- Check password is at least 6 characters

## 📚 Next Steps

Now that backend is working, you can implement:
- Enhanced analytics dashboard
- Real-time leaderboards
- Parent portal
- Multiplayer features
- Mobile app

See **IMPLEMENTATION_SUMMARY.md** for what was implemented.

## 🎉 Success!

Your app now has:
- ✅ Secure authentication
- ✅ Cloud data storage
- ✅ Real-time sync
- ✅ Multi-device support
- ✅ Role-based access
- ✅ Production-ready backend

**What feature would you like to add next?**
