# 🚨 URGENT: Update Firestore Rules NOW

## The Problem
Student registration is failing because Firestore rules are blocking the operation.

## The Solution (Takes 2 Minutes)

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/project/word-hero-8143e/firestore/rules

### Step 2: Log in
- Email: whero0085@gmail.com
- Password: W0rdHer02026

### Step 3: Click "Firestore Database" → "Rules" Tab

### Step 4: Delete ALL existing rules and paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - UPDATED RULES
    match /users/{userId} {
      // Allow anyone to read teacher profiles (for student registration)
      // Allow authenticated users to read all profiles
      allow read: if true;
      
      // Allow anyone to create their own user account during signup
      allow create: if true;
      
      // Users can update their own data
      // Admins and teachers can update any user
      allow update: if request.auth != null && 
        (request.auth.uid == userId || 
         request.auth.token.role == 'ADMIN' || 
         request.auth.token.role == 'TEACHER');
      
      // Only admins can delete users
      allow delete: if request.auth != null && request.auth.token.role == 'ADMIN';
    }
    
    // Words collection
    match /words/{wordId} {
      // Everyone can read words
      allow read: if true;
      
      // Only teachers and admins can create/update/delete words
      allow create, update, delete: if request.auth != null && 
        (request.auth.token.role == 'TEACHER' || request.auth.token.role == 'ADMIN');
    }
  }
}
```

### Step 5: Click "Publish" button (top right)

### Step 6: Refresh your application

## Why This Works
- `allow read: if true;` - Anyone can read user profiles (needed for teacher dropdown)
- `allow create: if true;` - Anyone can create a user account (needed for student registration)
- Update and delete still require proper authentication

## After Publishing
1. Refresh http://localhost:3000
2. Try creating a student account again
3. It should work now!
