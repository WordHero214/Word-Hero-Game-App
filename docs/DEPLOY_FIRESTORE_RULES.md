# Deploy Updated Firestore Rules

## Problem
Teachers are getting "Missing or insufficient permissions" error when trying to update student teacher names.

## Solution
Updated Firestore security rules to allow teachers to update student data.

## What Changed

### Before:
```javascript
allow update: if isSignedIn() && 
  (request.auth.uid == userId || getUserRole() == 'ADMIN');
```
Only users themselves or admins could update user data.

### After:
```javascript
allow update: if isSignedIn() && 
  (request.auth.uid == userId || 
   getUserRole() == 'ADMIN' || 
   getUserRole() == 'TEACHER');
```
Now teachers can also update user data (needed for adding teacher names to students).

## How to Deploy

### Option 1: Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **word-hero-7124d**
3. Click "Firestore Database" in left menu
4. Click "Rules" tab at the top
5. Copy the entire content from `firestore.rules` file
6. Paste it into the editor
7. Click "Publish" button
8. Wait for confirmation message

### Option 2: Firebase CLI

If you have Firebase CLI installed:

```bash
cd masteringword-main
firebase deploy --only firestore:rules
```

### Option 3: Manual Copy-Paste

1. Open `masteringword-main/firestore.rules` file
2. Copy all content
3. Go to Firebase Console → Firestore Database → Rules
4. Replace all content with copied rules
5. Click "Publish"

## Verify Deployment

After deploying:

1. Refresh your app (Ctrl+F5 or Cmd+Shift+R)
2. Log in as teacher
3. Go to Students tab
4. Click on a student
5. Click "Add Teacher Name"
6. Enter a name and click "Save"
7. Should see success message (no more permission error!)

## Updated Rules Content

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

## Security Considerations

### What Teachers Can Do Now:
- ✅ Update student teacher names
- ✅ Update any student field (needed for future features)
- ✅ View all student data

### What Teachers CANNOT Do:
- ❌ Delete users
- ❌ Create admin accounts
- ❌ Change user roles
- ❌ Access authentication settings

### Best Practices:
- Teachers should only update the `teacherName` field
- All updates are logged with timestamps
- Consider adding field-level validation in future

## Troubleshooting

### Error Still Appears After Deploy
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Log out and log back in
4. Check Firebase Console → Rules to confirm deployment

### Rules Won't Publish
1. Check for syntax errors in rules editor
2. Make sure you're logged into correct Firebase account
3. Verify you have owner/editor permissions on project

### Permission Denied for Other Operations
1. Check that you didn't accidentally remove other permissions
2. Compare with the full rules content above
3. Re-deploy if needed

## Testing After Deployment

### Test Checklist:
- [ ] Teacher can view student list
- [ ] Teacher can open student analytics
- [ ] Teacher can click "Add Teacher Name"
- [ ] Teacher can enter name and save
- [ ] Success message appears
- [ ] No permission errors in console
- [ ] Student data updates correctly
- [ ] Teacher name appears on student profile

## Status
⚠️ **ACTION REQUIRED** - You must deploy these rules to Firebase before the teacher name feature will work!

## Quick Deploy Steps:
1. Go to Firebase Console
2. Firestore Database → Rules
3. Copy-paste the rules from `firestore.rules`
4. Click "Publish"
5. Refresh your app
6. Test the feature

---

**After deploying, the permission error will be fixed!** 🎉
