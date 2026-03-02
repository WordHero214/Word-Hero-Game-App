# Manual Firestore Rules Deployment Guide

## Issue
The Firebase project `word-hero-8143e` needs to have the updated Firestore rules deployed to allow unauthenticated users to read teacher profiles during student registration.

## Solution: Deploy Rules via Firebase Console

### Step 1: Open Firebase Console
1. Go to https://console.firebase.google.com/
2. Click on your project: **word-hero-8143e**

### Step 2: Navigate to Firestore Rules
1. In the left sidebar, click on **Firestore Database**
2. Click on the **Rules** tab at the top

### Step 3: Update the Rules
Copy and paste the following rules into the Firebase Console:

```
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
      // Allow unauthenticated users to read teacher profiles (for student registration dropdown)
      // Allow authenticated users to read all profiles (for leaderboards)
      allow read: if isSignedIn() || 
        (resource.data.role == 'TEACHER' && resource.data.get('deleted', false) == false);
      
      // Users can create their own profile during signup
      // Admins can create profiles for other users (teacher creation)
      allow create: if isSignedIn() && 
        (request.auth.uid == userId || getUserRole() == 'ADMIN');
      
      // Users can update their own data
      // Admins can update any user
      // Teachers can update student data (for teacher name assignment)
      allow update: if isSignedIn() && 
        (request.auth.uid == userId || 
         getUserRole() == 'ADMIN' || 
         getUserRole() == 'TEACHER');
      
      // Only admins can delete users
      allow delete: if isSignedIn() && getUserRole() == 'ADMIN';
    }
    
    // Words collection
    match /words/{wordId} {
      // Everyone can read words (even unauthenticated for initial load)
      allow read: if true;
      
      // Only teachers and admins can create/update/delete words
      allow create, update, delete: if isSignedIn() && 
        (getUserRole() == 'TEACHER' || getUserRole() == 'ADMIN');
    }
  }
}
```

### Step 4: Publish the Rules
1. Click the **Publish** button in the top right
2. Confirm the deployment

### Step 5: Verify
1. Refresh your application at http://localhost:3000
2. The teacher dropdown should now load without permission errors

## What Changed?
The key change is in the `users` collection read rule:
- **Before**: Only authenticated users could read user profiles
- **After**: Unauthenticated users can read TEACHER profiles (but not students or admins), and authenticated users can read all profiles

This allows the student registration form to load the list of teachers before the student creates an account.

## Security Note
This is secure because:
- Only teacher profiles are exposed (not students or admins)
- Only non-deleted teachers are visible
- Students and admins still require authentication to view
- Write operations still require proper authentication and authorization
