# Quick Timer Test Guide

## 🚀 Fast Testing Steps

### Test Timer (2 minutes)

1. **Start the app**
   ```bash
   npm run dev
   ```

2. **Login as student**
   - Email: `student1@test.com`
   - Password: (your password)

3. **Start any game**
   - Click "Start Playing" → Choose difficulty

4. **Watch the timer**
   - Top center: Circular timer counting down
   - Green → Orange → Red as time decreases
   - Shows seconds remaining

5. **Let it run out**
   - Don't answer
   - Wait for 0 seconds
   - See "Time's Up!" screen
   - Game ends automatically

---

### Test 10-Word Requirement (5 minutes)

#### Setup (Teacher Account)
1. Login as teacher
2. Go to "Word Bank" tab
3. Add exactly 10 words to Easy mode
4. Assign to student's grade/section

#### Test (Student Account)
1. Login as student
2. Play Easy mode
3. Answer all 10 correctly (100%)
4. Check if certificate appears

#### Verify
- Open browser console (F12)
- Look for: `🏆 Certificate earned! EASY mode with 10 words`

#### Test Failure Case
1. Teacher: Remove words (leave only 5)
2. Student: Play and get 100%
3. Console shows: `⚠️ Perfect score but need 10 words for certificate. Current: 5`
4. No certificate awarded ✅

---

## ✅ What to Look For

### Timer Working
- ✅ Circular progress indicator visible
- ✅ Countdown shows correct seconds
- ✅ Color changes (green → orange → red)
- ✅ Resets for each new word
- ✅ Time-up screen appears at 0
- ✅ Game ends automatically

### 10-Word Requirement Working
- ✅ Certificate awarded with 10+ words at 100%
- ✅ NO certificate with < 10 words at 100%
- ✅ Console logs explain why
- ✅ Badges require 10+ words
- ✅ Achievements require 10+ words

---

## 🎯 Time Limits by Difficulty

| Difficulty | Time Per Word | Why? |
|------------|---------------|------|
| Easy | 60 seconds | Beginners need more time |
| Medium | 45 seconds | Audio spelling is faster |
| Hard | 90 seconds | Complex scenarios need thinking |

---

## 🐛 Quick Troubleshooting

**Timer not showing?**
- Refresh the page
- Check console for errors

**Timer not counting down?**
- Make sure you started a game
- Check if feedback is showing (timer pauses)

**Certificate awarded with < 10 words?**
- Check console logs
- Verify `minWordsForCertificate: 10` in constants.tsx

**No certificate with 10+ words?**
- Check if score was 100%
- Verify all 10 words were answered
- Check console for certificate logs

---

## 📊 Console Commands

Open browser console (F12) and check for these logs:

### When timer runs out:
```
⏰ Time is up!
🏁 Game ending due to time up
```

### When certificate earned:
```
🏆 Certificate earned! EASY mode with 10 words
```

### When not enough words:
```
⚠️ Perfect score but need 10 words for certificate. Current: 5
```

---

## 🎉 Success!

If you see all these working, the implementation is complete:
- ✅ Timer displays and counts down
- ✅ Time-up screen appears
- ✅ Game ends when time runs out
- ✅ Certificates require 10+ words
- ✅ Console logs help debug

Ready to test! 🚀
