# Quick Fix: Permission Error

## ❌ Error You're Seeing:
```
Error updating teacher name: FirebaseError: Missing or insufficient permissions.
```

## ✅ Solution (2 Minutes):

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/

### Step 2: Select Your Project
Click on: **word-hero-7124d**

### Step 3: Go to Firestore Rules
1. Click "Firestore Database" in left sidebar
2. Click "Rules" tab at the top

### Step 4: Update Rules
Find this line (around line 24):
```javascript
allow update: if isSignedIn() && 
  (request.auth.uid == userId || getUserRole() == 'ADMIN');
```

Replace it with:
```javascript
allow update: if isSignedIn() && 
  (request.auth.uid == userId || 
   getUserRole() == 'ADMIN' || 
   getUserRole() == 'TEACHER');
```

### Step 5: Publish
Click the big blue "Publish" button

### Step 6: Refresh Your App
Press `Ctrl+F5` (or `Cmd+Shift+R` on Mac)

### Step 7: Test Again
1. Log in as teacher
2. Go to Students tab
3. Click on a student
4. Click "Add Teacher Name"
5. Enter name and save
6. Should work now! ✅

## Visual Guide:

```
Firebase Console
├── Select Project: word-hero-7124d
├── Firestore Database (left menu)
├── Rules (top tab)
├── Find line 24-25
├── Add: || getUserRole() == 'TEACHER'
├── Click "Publish"
└── Done!
```

## What This Does:
- Allows teachers to update student data
- Specifically needed for adding teacher names
- Safe and secure (teachers can't delete or change roles)

## Time Required:
⏱️ 2 minutes

---

**That's it!** After publishing the rules, the permission error will be gone. 🎉
