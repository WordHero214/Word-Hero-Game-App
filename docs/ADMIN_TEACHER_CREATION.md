# Admin Teacher Account Creation Issue

## Problem
When an admin creates a teacher account using Firebase's `createUserWithEmailAndPassword()`, Firebase automatically signs in as the new user, which logs out the admin.

## Current Workaround
The app now:
1. Creates the teacher account
2. Signs out the new teacher
3. Shows a success message
4. Reloads the page after 3 seconds
5. Admin needs to log back in

## Better Solutions

### Option 1: Use Firebase Admin SDK (Recommended for Production)

Create a Cloud Function that uses Firebase Admin SDK:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createTeacher = functions.https.onCall(async (data, context) => {
  // Check if caller is admin
  if (!context.auth || context.auth.token.role !== 'ADMIN') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can create teachers');
  }

  const { email, password, name, subject } = data;

  try {
    // Create user without signing in
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name
    });

    // Create Firestore document
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      id: userRecord.uid,
      name: name,
      email: email,
      username: email.split('@')[0],
      role: 'TEACHER',
      subject: subject,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

Then in your app:
```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const createTeacher = httpsCallable(functions, 'createTeacher');

const result = await createTeacher({ email, password, name, subject });
```

### Option 2: Use Secondary Firebase App Instance

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Create a secondary app instance for creating users
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
const secondaryAuth = getAuth(secondaryApp);

export const createTeacherAccount = async (
  email: string,
  password: string,
  name: string,
  subject?: string
): Promise<User> => {
  // Use secondary auth to create user (won't affect main session)
  const userCredential = await createUserWithEmailAndPassword(
    secondaryAuth, 
    email, 
    password
  );
  
  const firebaseUser = userCredential.user;

  // Create Firestore document using main app
  const newUser = {
    id: firebaseUser.uid,
    name,
    email,
    username: email.split('@')[0],
    role: UserRole.TEACHER,
    subject
  };

  await setDoc(doc(db, "users", firebaseUser.uid), {
    ...newUser,
    createdAt: Timestamp.now()
  });

  // Sign out from secondary auth
  await signOut(secondaryAuth);

  return newUser;
};
```

### Option 3: Manual Account Creation (Current Temporary Solution)

The admin creates the account, gets logged out, and needs to log back in. The teacher account is created successfully in the database.

## Recommended Implementation

For production, use **Option 1 (Cloud Functions)** because:
- ✅ Admin stays logged in
- ✅ More secure (server-side validation)
- ✅ Can set custom claims for roles
- ✅ Better error handling
- ✅ No client-side password exposure

For development/testing, **Option 2 (Secondary App)** works well:
- ✅ Admin stays logged in
- ✅ No backend required
- ✅ Quick to implement
- ⚠️ Requires careful session management

## Setup Instructions for Option 2 (Quick Fix)

I'll implement Option 2 now as it's the best balance between functionality and simplicity.
