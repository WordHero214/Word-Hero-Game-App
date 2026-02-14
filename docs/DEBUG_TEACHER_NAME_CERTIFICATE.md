# Debug: Teacher Name Not Showing on Certificate

## 🔍 The Issue

You added the teacher name to the student account, but the certificate still shows "The Word Master AI".

## ✅ Most Likely Cause

**The certificate was earned BEFORE you added the teacher name.**

Certificates are stored as static data when they're earned. They don't update retroactively.

## 🧪 Quick Test to Verify

### Open Browser Console (F12)

1. Log in as the student
2. Go to Profile tab
3. Open browser console (F12)
4. Type this command:

```javascript
// Check if teacher name is in the account
console.log('Teacher Name:', userData.teacherName);
```

### Expected Results:

**If teacher name IS saved:**
```
Teacher Name: Mrs. Garcia
```
✅ Teacher name is in the account - just need NEW certificate

**If teacher name is NOT saved:**
```
Teacher Name: undefined
```
❌ Teacher name didn't save - need to add it again

## 📊 Check Certificate Data

### In Browser Console:

```javascript
// Check all certificates
console.log('Certificates:', userData.certificates);
```

### Look for:

**Old Certificate (Before teacher name added):**
```javascript
{
  id: "cert_123",
  difficulty: "MEDIUM",
  earnedDate: "2/13/2026",
  userName: "Max Axel",
  teacherName: undefined  // ← No teacher name
}
```

**New Certificate (After teacher name added):**
```javascript
{
  id: "cert_456",
  difficulty: "EASY",
  earnedDate: "2/13/2026",
  userName: "Max Axel",
  teacherName: "Mrs. Garcia"  // ← Has teacher name ✅
}
```

## 🎯 Solution

### If Teacher Name IS Saved:
Student needs to earn a NEW certificate:

1. Log in as student
2. Play a difficulty they DON'T have a certificate for
   - Has MEDIUM? Try EASY or HARD
3. Answer 10+ words with 100% score
4. Download the NEW certificate
5. Should show teacher name ✅

### If Teacher Name is NOT Saved:
Add it again:

1. Log in as teacher
2. Go to Students tab
3. Click on the student
4. Click "Add Teacher Name" (or "Update Teacher Name")
5. Enter teacher name
6. Click "Save"
7. Verify success message
8. Then follow steps above to earn new certificate

## 🔬 Advanced Debugging

### Check Firebase Database Directly:

1. Go to Firebase Console
2. Firestore Database
3. Find `users` collection
4. Find the student's document
5. Check fields:

```json
{
  "name": "Max Axel",
  "teacherName": "Mrs. Garcia",  ← Should exist
  "certificates": [
    {
      "id": "cert_123",
      "difficulty": "MEDIUM",
      "teacherName": undefined  ← Old cert
    }
  ]
}
```

### Check Certificate Creation Code:

Add this to browser console when earning a certificate:

```javascript
// Before playing, add this listener
window.addEventListener('certificateEarned', (e) => {
  console.log('Certificate Data:', e.detail);
  console.log('Teacher Name:', e.detail.teacherName);
});
```

## 📝 Verification Checklist

- [ ] Teacher name is saved in student account (check Firebase or console)
- [ ] Student has earned a NEW certificate (after teacher name was added)
- [ ] New certificate was downloaded (not old one)
- [ ] Certificate requirements met (10+ words, 100% score)
- [ ] Different difficulty than existing certificates

## 🎮 Test Scenario

### Current Situation:
```
Student: Max Axel
Teacher Name: Mrs. Garcia (added today)
Existing Certificates:
  - MEDIUM Master (earned 2/13/2026) ← Shows "The Word Master AI"
```

### Test Plan:
```
1. Log in as Max Axel
2. Go to Play
3. Select EASY mode
4. Answer 10+ words correctly (100%)
5. Certificate earned!
6. Go to Profile
7. Download EASY certificate (not MEDIUM)
8. Check: "Authorized by: Mrs. Garcia" ✅
```

### Expected Result:
```
Student: Max Axel
Teacher Name: Mrs. Garcia
Certificates:
  - MEDIUM Master (2/13/2026) ← Still shows "The Word Master AI" (old)
  - EASY Master (2/13/2026) ← Shows "Mrs. Garcia" (new) ✅
```

## ⚠️ Common Mistakes

### Mistake 1: Checking Old Certificate
❌ Downloading the MEDIUM certificate again
✅ Download the newly earned EASY certificate

### Mistake 2: Not Meeting Requirements
❌ Only 8 words answered
❌ 90% score (not 100%)
✅ 10+ words AND 100% score

### Mistake 3: Same Difficulty
❌ Trying to earn MEDIUM again (already have it)
✅ Earn EASY or HARD (don't have yet)

### Mistake 4: Teacher Name Not Saved
❌ Assuming it saved when it didn't
✅ Verify in Firebase or console first

## 🔧 If Still Not Working

### Step 1: Verify Code is Correct

Check `firebaseService.ts` line ~275:

```typescript
teacherName: userData.teacherName || 'The Word Master AI'
```

Should be using `userData.teacherName` ✅

### Step 2: Check User Data Loading

In browser console:

```javascript
// Check if user data has teacher name
console.log('Full User Data:', userData);
```

Look for `teacherName` field.

### Step 3: Hard Refresh

1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Log out and back in
4. Try earning certificate again

### Step 4: Check Firestore Rules

Make sure rules allow teachers to update students:

```javascript
allow update: if isSignedIn() && 
  (request.auth.uid == userId || 
   getUserRole() == 'ADMIN' || 
   getUserRole() == 'TEACHER');
```

## 💡 Quick Verification Script

Paste this in browser console (on Profile page):

```javascript
// Quick check script
console.log('=== TEACHER NAME DEBUG ===');
console.log('Student Name:', userData?.name);
console.log('Teacher Name:', userData?.teacherName || 'NOT SET');
console.log('Certificates:', userData?.certificates?.length || 0);
console.log('Certificate Details:');
userData?.certificates?.forEach((cert, i) => {
  console.log(`  ${i+1}. ${cert.difficulty} - Teacher: ${cert.teacherName || 'NOT SET'}`);
});
console.log('=========================');
```

Expected output:
```
=== TEACHER NAME DEBUG ===
Student Name: Max Axel
Teacher Name: Mrs. Garcia
Certificates: 1
Certificate Details:
  1. MEDIUM - Teacher: NOT SET
=========================
```

This shows:
- ✅ Teacher name IS in account
- ❌ Existing certificate doesn't have it (expected)
- ✅ Need to earn NEW certificate

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Console shows: `Teacher Name: Mrs. Garcia`
2. ✅ Student earns NEW certificate
3. ✅ NEW certificate shows teacher name in PDF
4. ✅ Old certificates still show "The Word Master AI" (expected)

## 📞 Summary

**Most Common Issue:** Checking an old certificate instead of earning a new one.

**Solution:** Have the student earn a certificate in a different difficulty level.

**Verification:** Use browser console to check if teacher name is in the account.

---

**Next Step:** Earn a NEW certificate and check that one! 🎓
