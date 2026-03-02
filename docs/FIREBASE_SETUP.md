# Firebase Backend Setup Guide

## Overview
This application now uses Firebase for:
- **Authentication**: User login/signup with email and password
- **Firestore Database**: Persistent storage for users, words, and progress
- **Real-time Sync**: Data syncs across devices automatically

## Firebase Configuration

The Firebase configuration is already set up in `firebase.ts` with your project credentials:
- Project ID: `word-hero-7124d`
- Auth Domain: `word-hero-7124d.firebaseapp.com`

## Firestore Database Structure

### Collections

#### 1. `users` Collection
Stores all user data (students, teachers, admins)

**Student Document:**
```
users/{userId}
  - id: string
  - name: string
  - email: string
  - username: string
  - role: "STUDENT"
  - sparkies: number
  - totalGames: number
  - wordsLearned: number
  - bestStreak: number
  - badges: string[]
  - certificates: Certificate[]
  - achievements: string[]
  - levelProgress: {
      EASY: { difficulty, mastery, gamesPlayed }
      MEDIUM: { difficulty, mastery, gamesPlayed }
      HARD: { difficulty, mastery, gamesPlayed }
    }
  - gradeLevel: string
  - section: string
  - createdAt: Timestamp
  - lastPlayed?: Timestamp
```

**Teacher Document:**
```
users/{userId}
  - id: string
  - name: string
  - email: string
  - username: string
  - role: "TEACHER"
  - subject?: string
  - managedClassIds?: string[]
  - createdAt: Timestamp
```

**Admin Document:**
```
users/{userId}
  - id: string
  - name: string
  - email: string
  - username: string
  - role: "ADMIN"
  - createdAt: Timestamp
```

**Note:** Only students have game-related fields (sparkies, badges, levelProgress, etc.). Teachers and admins only need basic profile information.

#### 2. `words` Collection
Stores all spelling words

```
words/{wordId}
  - id: string
  - term: string
  - difficulty: "EASY" | "MEDIUM" | "HARD"
  - category: string
  - hint?: string (for EASY mode)
  - scenario?: string (for HARD mode)
  - createdAt: Timestamp
  - deleted?: boolean
```

## Firebase Console Setup Steps

### 1. Enable Authentication
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `word-hero-7124d`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Click **Save**

### 2. Create Firestore Database
1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll set rules next)
4. Select your preferred location (e.g., `us-central`)
5. Click **Enable**

### 3. Set Firestore Security Rules
Go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to check user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles (for leaderboards)
      allow read: if isSignedIn();
      
      // Users can only create their own profile during signup
      allow create: if isSignedIn() && request.auth.uid == userId;
      
      // Users can update their own data
      // Admins can update any user
      allow update: if isSignedIn() && 
        (request.auth.uid == userId || getUserRole() == 'ADMIN');
      
      // Only admins can delete users
      allow delete: if isSignedIn() && getUserRole() == 'ADMIN';
    }
    
    // Words collection
    match /words/{wordId} {
      // Everyone can read words
      allow read: if isSignedIn();
      
      // Only teachers and admins can create/update/delete words
      allow create, update, delete: if isSignedIn() && 
        (getUserRole() == 'TEACHER' || getUserRole() == 'ADMIN');
    }
  }
}
```

### 4. Create Initial Admin Account
Since you need an admin to create teacher accounts, create the first admin manually:

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Email: `admin@wordhero.com`
4. Password: `Admin123!` (change this after first login)
5. Click **Add user**
6. Copy the User UID
7. Go to **Firestore Database**
8. Create a new document in `users` collection:
   - Document ID: [paste the User UID]
   - Fields:
     ```
     id: [User UID]
     name: "Admin Controller"
     email: "admin@wordhero.com"
     username: "admin"
     role: "ADMIN"
     createdAt: [current timestamp]
     ```

**Note:** Admin accounts don't need student-specific fields (sparkies, badges, levelProgress, etc.).

## Seeding Initial Words

To add the initial 30 words to Firebase:

1. Run the development server: `npm run dev`
2. Open browser console (F12)
3. Import and run the seed function:
   ```javascript
   import('./seedWords.js').then(m => m.seedInitialWords())
   ```

Or create a temporary button in the UI to trigger seeding.

## User Roles & Permissions

### Student
- Can register themselves via the app
- Can play games and track progress
- Can view leaderboards
- Can download certificates

### Teacher
- Must be created by Admin
- Can view student progress
- Can manage word lists (add/edit/delete words)
- Can configure class settings

### Admin
- Must be created manually in Firebase Console
- Can create teacher accounts
- Can manage all users
- Can configure system settings
- Full access to all features

## Testing the Setup

1. **Test Student Registration**:
   - Open the app
   - Click "Not registered? Create a student account"
   - Fill in details and register
   - Check Firebase Console → Authentication (user should appear)
   - Check Firestore → users collection (document should be created)

2. **Test Admin Login**:
   - Login with admin credentials
   - Try creating a teacher account
   - Verify teacher appears in Firebase

3. **Test Game Progress**:
   - Login as student
   - Play a game
   - Check Firestore → users → [userId] (progress should update)

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules are properly set
- Verify user is authenticated
- Check user role in Firestore

### "User data not found" after login
- Ensure user document was created in Firestore during signup
- Check document ID matches Firebase Auth UID

### Words not loading
- Run the seed script to add initial words
- Check Firestore rules allow read access to words collection

## Environment Variables

For production deployment, consider moving Firebase config to environment variables:

Create `.env.local`:
```
VITE_FIREBASE_API_KEY=AIzaSyBzDRGuk1QYmwK6nv87KhjYTm1im452FlE
VITE_FIREBASE_AUTH_DOMAIN=word-hero-7124d.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=word-hero-7124d
VITE_FIREBASE_STORAGE_BUCKET=word-hero-7124d.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=53192346517
VITE_FIREBASE_APP_ID=1:53192346517:web:10183eb230d6c75949049c
VITE_FIREBASE_MEASUREMENT_ID=G-5EGF8PZWZD
```

Then update `firebase.ts` to use these variables.

## Next Steps

After Firebase is set up:
1. Test all authentication flows
2. Seed initial words
3. Create teacher accounts via admin panel
4. Test student gameplay and progress tracking
5. Verify data persistence across sessions
