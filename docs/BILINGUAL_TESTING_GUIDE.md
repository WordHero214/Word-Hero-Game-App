# 🧪 Bilingual Feature Testing Guide

## Quick Start Testing

### 1. Start the Development Server
```bash
cd masteringword-main
npm run dev
```

### 2. Login as a Student
- Use any existing student account
- Or create a new student account

### 3. Test Language Switching

#### Look for the Language Selector
- Should appear in the **top-right corner** of the screen
- Shows two buttons: **🇺🇸 EN** and **🇵🇭 FIL**
- Only visible for students (not teachers or admins)

#### Switch to Filipino
1. Click the **🇵🇭 FIL** button
2. Observe the UI changes:
   - Button labels translate
   - Instructions translate
   - Dashboard text translates

#### Switch back to English
1. Click the **🇺🇸 EN** button
2. Everything should return to English

### 4. Test in Game (Easy Level)

#### English Mode
1. Select **Easy** difficulty
2. Start a game
3. You should see:
   - "Word Clue" label
   - English hint (e.g., "A crunchy red or green fruit that keeps the doctor away!")
   - "Hint" button with English text

#### Filipino Mode
1. Switch to **🇵🇭 FIL** using the language selector
2. Select **Easy** difficulty
3. Start a game
4. You should see:
   - "Pahiwatig ng Salita" label
   - Filipino hint (e.g., "Isang malutong na pula o berdeng prutas na nakakaiwas sa doktor!")
   - "Pahiwatig" button with Filipino text

### 5. Test in Game (Hard Level)

#### English Mode
1. Select **Hard** difficulty (must have 85%+ in Medium first)
2. Start a game
3. You should see:
   - "Scenario" label
   - English scenario (e.g., "Many animals lose their homes because of _______.")

#### Filipino Mode
1. Switch to **🇵🇭 FIL**
2. Select **Hard** difficulty
3. Start a game
4. You should see:
   - "Sitwasyon" label
   - Filipino scenario (e.g., "Maraming hayop ang nawawalan ng tahanan dahil sa _______.")

### 6. Test Persistence
1. Switch to Filipino (**🇵🇭 FIL**)
2. Logout
3. Login again
4. Language should still be Filipino ✅

## Expected Behavior

### ✅ What Should Work
- Language selector visible for students only
- Clicking EN/FIL switches language immediately
- Hints show in correct language (Easy level)
- Scenarios show in correct language (Hard level)
- UI elements translate (buttons, labels, messages)
- Language preference saves to Firebase
- Language persists after logout/login

### ❌ What Won't Work Yet (Optional Enhancements)
- Dashboard stats labels (still in English)
- Profile page content (still in English)
- Certificate text (still in English)
- Teacher/Admin interfaces (English only)

## Sample Words to Test

### Easy Level Words (with Filipino hints)
- **APPLE** - "Isang malutong na pula o berdeng prutas"
- **HOUSE** - "Isang gusali kung saan nakatira ang isang pamilya"
- **WATER** - "Isang malinaw na likido na iniinom natin kapag nauuhaw"
- **SCHOOL** - "Isang lugar kung saan pumupunta ang mga bata para mag-aral"

### Hard Level Words (with Filipino scenarios)
- **DEFORESTATION** - "Maraming hayop ang nawawalan ng tahanan dahil sa _______"
- **POLLUTION** - "Ang pagtatapon ng basura sa ilog ay nagiging sanhi ng _______ sa tubig"
- **RECYCLING** - "Maaari nating iligtas ang Daigdig sa pamamagitan ng _______ ng ating mga plastik na bote"

## Troubleshooting

### Language selector not showing?
- Make sure you're logged in as a **STUDENT** (not teacher or admin)
- Check browser console for errors

### Language not switching?
- Check browser console for Firebase errors
- Verify Firebase connection is working
- Check that user document has `language` field

### Hints/Scenarios still in English?
- Verify the word has `hintFil` or `scenarioFil` fields
- Check that `userLanguage` prop is being passed to GameOverlay
- Look for console errors

## Browser Console Commands

### Check current user language
```javascript
// In browser console
console.log(user.language); // Should show 'en' or 'fil'
```

### Manually set language (for testing)
```javascript
// In browser console (requires Firebase access)
firebase.firestore().collection('users').doc('USER_ID').update({ language: 'fil' });
```

## Success Criteria

✅ All tests pass without errors
✅ Language switches smoothly
✅ Content displays in correct language
✅ Preference persists across sessions
✅ No console errors

## Status: Ready for Testing! 🚀

The bilingual feature is fully implemented and ready for student use.
