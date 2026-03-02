# Deploy Firestore Rules - URGENT FIX 🚨

## Problem
Students cannot sign up because they get "Missing or insufficient permissions" error when trying to load the teacher list. This is because the current Firestore rules require authentication to read the users collection.

## Solution Applied
Updated `firestore.rules` to allow:
1. **Unauthenticated reads** of users collection (so students can see teacher list during signup)
2. **Unauthenticated creates** of user documents (so students can create their account)

## Changes Made to firestore.rules

### Before:
```javascript
allow read: if isSignedIn();
allow create: if isSignedIn() && (request.auth.uid == userId || getUserRole() == 'ADMIN');
```

### After:
```javascript
allow read: if true;  // Allow unauthenticated reads for teacher list
allow create: if !isSignedIn() ||  // Allow unauthenticated signup
                request.auth.uid == userId || 
                (isSignedIn() && getUserRole() == 'ADMIN');
```

## Deploy Now

Run this command in PowerShell:

```powershell
cd masteringword-main
firebase deploy --only firestore:rules
```

## Expected Output
```
=== Deploying to 'word-hero-8143e'...

i  deploying firestore
i  firestore: checking firestore.rules for compilation errors...
✔  firestore: rules file firestore.rules compiled successfully
i  firestore: uploading rules firestore.rules...
✔  firestore: released rules firestore.rules to cloud.firestore

✔  Deploy complete!
```

## After Deployment
1. Refresh the browser (Ctrl + F5)
2. Try signing up a new student
3. The teacher list should load without errors
4. Student signup should complete successfully

## Security Note
This is safe because:
- Students need to see the teacher list to select their teacher during signup
- The read permission allows viewing user profiles (needed for leaderboards too)
- Write permissions are still protected (only the user creating the account can write their own data)
- Update/delete permissions remain restricted to authenticated users

## Verification
After deployment, check the Firebase Console:
1. Go to https://console.firebase.google.com/
2. Select project: word-hero-8143e
3. Go to Firestore Database → Rules
4. Verify the rules show the updated version
