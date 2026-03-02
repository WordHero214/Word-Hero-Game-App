# Words Not Appearing - Complete Fix Guide

## Problem
Students only see mock/hardcoded words and don't see words added by teachers.

## Root Causes
1. Words aren't being saved to Firebase properly
2. Words are saved but filtering is excluding them
3. Students need to refresh to see new words
4. Section/grade level mismatch

---

## ✅ Solutions Implemented

### 1. Added Word Debugger Tool
- Click the **"🐛 Debug Words"** button (bottom right)
- Shows how many words are loaded
- Shows words by difficulty
- Lists all loaded words
- Has a **"Refresh Words"** button
- Check browser console for detailed logs

### 2. Enhanced Logging
The app now logs detailed information in the browser console:
```
🔍 Loading words from Firebase...
   User role: STUDENT
   Grade level: 1
   Section: A
✅ Loaded 15 words from Firebase
   Words: APPLE, HOUSE, BREAD, ...
```

### 3. Manual Refresh Function
Students can now click "Refresh Words" in the debugger to reload without logging out.

---

## 🔍 Troubleshooting Steps

### Step 1: Check if Words are in Firebase

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project: `word-hero-7124d`
3. Go to **Firestore Database**
4. Look for **"words"** collection
5. Check if words exist there

**If NO words exist:**
- Teachers need to add words using the Word Bank
- Or use the AI Word Generator
- Or manually add words in Firebase Console

**If words exist:**
- Continue to Step 2

### Step 2: Check Word Assignment

For each word in Firebase, verify:
- `gradeLevels` field: Should be array like `["1", "2"]` or empty `[]`
- `sections` field: Should be array like `["A", "B"]` or empty `[]`
- Empty arrays mean "available to all"

**Example of correct word:**
```json
{
  "id": "w1",
  "term": "APPLE",
  "difficulty": "EASY",
  "category": "Fruits",
  "hint": "A red fruit",
  "gradeLevels": ["1", "2"],  // Available to grades 1 and 2
  "sections": ["A", "B"],      // Available to sections A and B
  "createdAt": "..."
}
```

**Example of word for ALL students:**
```json
{
  "id": "w2",
  "term": "HOUSE",
  "difficulty": "EASY",
  "category": "Places",
  "hint": "Where you live",
  "gradeLevels": [],  // Empty = all grades
  "sections": [],      // Empty = all sections
  "createdAt": "..."
}
```

### Step 3: Check Student Profile

1. In Firebase Console → Firestore → users collection
2. Find the student document
3. Verify:
   - `gradeLevel`: Should be "1", "2", "3", "4", "5", or "6"
   - `section`: Should be "A", "B", "C", "D", "E", or "F" (or empty)
   - `role`: Should be "STUDENT"

### Step 4: Test the Filtering Logic

**Scenario 1: Student sees NO words**
- Check if ANY words exist in Firebase
- Check if words have matching grade/section
- Try creating a word with empty gradeLevels and sections (should be visible to all)

**Scenario 2: Student sees only mock words**
- This means Firebase returned 0 words
- Check Firebase connection
- Check Firestore rules allow reading
- Check console for errors

**Scenario 3: Student sees some words but not new ones**
- Student needs to refresh
- Click "🐛 Debug Words" → "Refresh Words"
- Or log out and log back in

---

## 🎯 Quick Fix Checklist

### For Teachers:

1. **Add a test word:**
   - Go to Word Bank
   - Click "Add Word"
   - Enter: BALL, EASY, sport
   - Leave grade levels EMPTY
   - Leave sections EMPTY
   - Save

2. **Verify in Firebase:**
   - Open Firebase Console
   - Check "words" collection
   - Find the BALL word
   - Verify it exists

3. **Test as student:**
   - Log in as student
   - Click "🐛 Debug Words"
   - Should see BALL in the list
   - If not, click "Refresh Words"

### For Students:

1. **Check what words you have:**
   - Click "🐛 Debug Words" button (bottom right)
   - See how many words are loaded
   - See the word list

2. **If you see 0 or only mock words:**
   - Ask teacher to add words
   - Make sure your grade/section matches the words

3. **If teacher just added words:**
   - Click "Refresh Words" in the debugger
   - Or log out and log back in

---

## 🔧 Advanced Debugging

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for these messages:

**Good signs:**
```
🔍 Loading words from Firebase...
✅ Loaded 15 words from Firebase
```

**Bad signs:**
```
⚠️ No words found in Firebase!
❌ Error loading words from Firebase
```

### Check Network Tab

1. Open DevTools → Network tab
2. Filter by "firestore"
3. Look for requests to Firebase
4. Check if they return data

### Check Firestore Rules

In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Words should be readable by everyone
    match /words/{wordId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 💡 Common Issues & Solutions

### Issue 1: "I added a word but students don't see it"

**Solution:**
- Students need to refresh (click "Refresh Words" in debugger)
- Or log out and log back in
- Words load once when logging in

### Issue 2: "Students see mock words only"

**Solution:**
- No words in Firebase database
- Teacher needs to add words via Word Bank
- Or use AI Word Generator

### Issue 3: "Some students see words, others don't"

**Solution:**
- Check grade level and section matching
- Create words with empty grade/section for "all students"
- Verify student profiles have correct grade/section

### Issue 4: "Word appears in Firebase but not in app"

**Solution:**
- Check the word's gradeLevels and sections arrays
- Make sure they match the student's profile
- Try making them empty arrays (available to all)

### Issue 5: "Getting Firebase errors"

**Solution:**
- Check internet connection
- Verify Firebase project is active
- Check Firestore rules allow reading
- Check .env.local has correct Firebase config

---

## 🎓 Best Practices

1. **For "All Students" words:**
   - Leave gradeLevels empty: `[]`
   - Leave sections empty: `[]`

2. **For Specific Grade:**
   - Set gradeLevels: `["1"]`
   - Leave sections empty: `[]`

3. **For Specific Section:**
   - Set gradeLevels: `["1"]`
   - Set sections: `["A"]`

4. **Testing New Words:**
   - Add a test word with empty grade/section
   - Verify it appears in debugger
   - Then add real words

5. **Student Refresh:**
   - Teach students to use the debugger
   - Or have them log out/in after teacher adds words

---

## 📊 Using the Word Debugger

The debugger shows:
- **Total Words**: How many words are loaded
- **By Difficulty**: Easy, Medium, Hard counts
- **Word List**: All loaded words with difficulty
- **Refresh Button**: Reload words from Firebase

**How to use:**
1. Click "🐛 Debug Words" (bottom right)
2. Check the word count
3. If it's wrong, click "Refresh Words"
4. Check browser console for detailed logs

---

## ✅ Success Criteria

You'll know it's working when:
- ✅ Debugger shows correct number of words
- ✅ Console logs show words loading from Firebase
- ✅ Students see words in Play mode
- ✅ New words appear after refresh
- ✅ Filtering by grade/section works correctly

---

## 🆘 Still Not Working?

1. Check all steps above
2. Review browser console for errors
3. Verify Firebase connection
4. Check Firestore rules
5. Try with a fresh student account
6. Contact support with console logs
