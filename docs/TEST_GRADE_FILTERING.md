# Test Grade Level Filtering - Quick Guide 🧪

## Quick Test (5 Minutes)

### Step 1: Create Test Students (2 minutes)
Create 2 test students with different grades:

**Student 1:**
- Name: Test Grade 1
- Email: grade1@test.com
- Password: test123
- Grade: 1
- Section: A

**Student 2:**
- Name: Test Grade 6
- Email: grade6@test.com
- Password: test123
- Grade: 6
- Section: A

### Step 2: Upload Words (Already Done! ✅)
You've already uploaded 180 words with grade levels assigned.

### Step 3: Test Grade 1 Student (1 minute)
1. Log in as grade1@test.com
2. Open browser console (F12)
3. Look for this message:
   ```
   📚 Grade Level Filtering Applied:
      Student Grade: 1
      Words available for this student: 30
      Breakdown: 10 Easy, 10 Medium, 10 Hard
   ```
4. Check dashboard - should see "Grade 1 Words" indicator
5. Start a game - should only see simple Grade 1 words

### Step 4: Test Grade 6 Student (1 minute)
1. Log out
2. Log in as grade6@test.com
3. Open browser console (F12)
4. Look for this message:
   ```
   📚 Grade Level Filtering Applied:
      Student Grade: 6
      Words available for this student: 30
      Breakdown: 10 Easy, 10 Medium, 10 Hard
   ```
5. Check dashboard - should see "Grade 6 Words" indicator
6. Start a game - should only see complex Grade 6 words

### Step 5: Verify Filtering (1 minute)
Compare the words each student sees:
- Grade 1 should see: CAT, DOG, SUN, etc.
- Grade 6 should see: RESPONSIBILITY, ENVIRONMENT, etc.
- They should NOT see each other's words

## Expected Results

### ✅ Success Indicators:
- Console shows correct grade level
- Console shows 30 words per student
- Dashboard shows grade indicator
- Words match grade difficulty
- No overlap between grades

### ❌ Failure Indicators:
- Console shows 180 words (not filtered)
- Both students see same words
- No grade indicator on dashboard
- Words too easy/hard for grade

## Console Output Examples

### Grade 1 Student (Correct):
```
📡 Real-time update: Received 180 words
📚 Grade Level Filtering Applied:
   Student Grade: 1
   Student Section: A
   Total words in database: 180
   Words available for this student: 30
   Breakdown: 10 Easy, 10 Medium, 10 Hard
✅ Filtered to 30 words for user
```

### Grade 6 Student (Correct):
```
📡 Real-time update: Received 180 words
📚 Grade Level Filtering Applied:
   Student Grade: 6
   Student Section: A
   Total words in database: 180
   Words available for this student: 30
   Breakdown: 10 Easy, 10 Medium, 10 Hard
✅ Filtered to 30 words for user
```

### No Filtering (Incorrect):
```
📡 Real-time update: Received 180 words
✅ Filtered to 180 words for user
```
⚠️ If you see this, grade level is not set or filtering failed!

## Visual Verification

### Dashboard Should Show:

**Grade 1 Student:**
```
┌─────────────────────────────────────────┐
│ 📚  Grade 1 Words                       │
│                                         │
│ You're getting words specially         │
│ selected for Grade 1 students.          │
│ Each difficulty level is designed       │
│ to match your learning level!           │
│                                         │
│                          [Your Level]   │
│                              1          │
└─────────────────────────────────────────┘
```

**Grade 6 Student:**
```
┌─────────────────────────────────────────┐
│ 📚  Grade 6 Words                       │
│                                         │
│ You're getting words specially         │
│ selected for Grade 6 students.          │
│ Each difficulty level is designed       │
│ to match your learning level!           │
│                                         │
│                          [Your Level]   │
│                              6          │
└─────────────────────────────────────────┘
```

## Troubleshooting

### Problem: Console shows 180 words for student
**Cause**: Grade level not set in student profile
**Fix**: 
1. Log in as Admin
2. Go to student management
3. Edit student profile
4. Set grade level
5. Save changes

### Problem: No grade indicator on dashboard
**Cause**: Student profile missing grade level
**Fix**: Same as above

### Problem: Student sees no words
**Cause**: No words uploaded for that grade
**Fix**: Upload words for that grade using bulk upload

### Problem: Student sees wrong difficulty
**Cause**: Words assigned to wrong grade
**Fix**: Re-upload words with correct grade assignments

## Quick Verification Commands

### Check Student Grade Level:
Open browser console and type:
```javascript
// This will show current user data
console.log('Grade:', user?.gradeLevel);
console.log('Section:', user?.section);
```

### Check Available Words:
```javascript
// This will show filtered word count
console.log('Available words:', wordList?.length);
```

## Full Test Matrix

| Grade | Expected Words | Easy | Medium | Hard |
|-------|---------------|------|--------|------|
| 1     | 30            | 10   | 10     | 10   |
| 2     | 30            | 10   | 10     | 10   |
| 3     | 30            | 10   | 10     | 10   |
| 4     | 30            | 10   | 10     | 10   |
| 5     | 30            | 10   | 10     | 10   |
| 6     | 30            | 10   | 10     | 10   |

## Success Criteria

✅ All tests pass if:
1. Each grade sees exactly 30 words
2. Words match grade difficulty
3. Console logs show correct filtering
4. Dashboard shows grade indicator
5. No cross-grade word visibility

## Next Steps After Testing

Once verified:
1. ✅ Create real student accounts
2. ✅ Assign correct grade levels
3. ✅ Students can start playing
4. ✅ Monitor console logs for issues
5. ✅ Gather feedback from students

---

**Testing Time:** 5 minutes  
**Required:** 2 test student accounts  
**Tools:** Browser console (F12)  
**Status:** Ready to test!
