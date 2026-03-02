# Word Pool Reset Feature

## Overview
The Word Pool Reset feature ensures students always have fresh questions by tracking which words they've already seen and automatically resetting the pool when all words have been completed.

---

## How It Works

### 1. Word Tracking
- Each time a student completes a game level, the word IDs from that game are tracked
- Words are tracked separately for each difficulty level (Easy, Medium, Hard)
- The system maintains a list of "used" word IDs per difficulty in the user's profile

### 2. Word Selection Logic
When a student starts a new game:
1. System filters words by difficulty level
2. Removes words that have already been used (based on tracked IDs)
3. If enough unused words remain (≥10), uses those
4. If not enough unused words, **resets the pool** and uses all words again

### 3. Reset Trigger
The pool resets when:
- Student has used 90% or more of available words for that difficulty
- Not enough unused words remain for a full game (need 10 words)

### 4. Celebration
When the pool resets, students see a special milestone celebration:
- 🎓 "All Words Mastered!"
- Message: "You've completed all [difficulty] words! Starting fresh with new questions."
- Purple color theme (#8b5cf6)

---

## Technical Implementation

### Database Schema
Added to `User` interface in `types.ts`:
```typescript
usedWordIds?: Record<Difficulty, string[]>; // Track used word IDs per difficulty
```

Example data structure:
```json
{
  "usedWordIds": {
    "EASY": ["e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "e10"],
    "MEDIUM": ["m1", "m2", "m3"],
    "HARD": []
  }
}
```

### Word Selection (App.tsx)
```typescript
const words = useMemo(() => {
  let filteredWords = gameWords.filter(w => w.difficulty === difficulty);
  
  // Get used word IDs for this difficulty
  const usedIds = user?.usedWordIds?.[difficulty] || [];
  
  // Filter out already used words
  const unusedWords = filteredWords.filter(w => !usedIds.includes(w.id));
  
  // If enough unused words, use them; otherwise reset
  if (unusedWords.length >= 10) {
    filteredWords = unusedWords;
  } else {
    // Reset - use all words
    filteredWords = gameWords.filter(w => w.difficulty === difficulty);
  }
  
  // Shuffle and return
  return shuffled.slice(0, 10);
}, [difficulty, gameWords, user?.usedWordIds]);
```

### Progress Tracking (firebaseService.ts)
```typescript
// Track used word IDs for this difficulty
const usedWordIds = userData.usedWordIds || {};
const currentUsedIds = usedWordIds[session.difficulty] || [];
const newUsedIds = session.words.map(w => w.id);

// Combine current used IDs with new ones
const combinedUsedIds = Array.from(new Set([...currentUsedIds, ...newUsedIds]));

// Check if we need to reset
const shouldReset = combinedUsedIds.length >= allWordsForDifficulty * 0.9;

if (shouldReset && currentUsedIds.length > 0) {
  // Reset - start fresh
  usedWordIds[session.difficulty] = newUsedIds;
} else {
  // Add to existing
  usedWordIds[session.difficulty] = combinedUsedIds;
}
```

---

## Benefits

### For Students
1. **Always Fresh Content**: Never see the same questions repeatedly in a short time
2. **Sense of Progress**: Clear indication when they've completed all words
3. **Motivation**: Celebration when completing the entire word pool
4. **Variety**: Ensures diverse practice across all available words

### For Teachers
1. **Better Assessment**: Students can't memorize question order
2. **Fair Testing**: All students get different question sequences
3. **Engagement**: Students stay motivated to complete all words
4. **Progress Tracking**: Can see when students have mastered all words

---

## User Experience Flow

### First Time Playing Easy Mode
```
Student starts Easy level
  ↓
System: "No used words yet"
  ↓
Selects 10 random words from Easy pool
  ↓
Student completes game
  ↓
System tracks: usedWordIds.EASY = [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10]
```

### Second Time Playing Easy Mode
```
Student starts Easy level again
  ↓
System: "10 words already used"
  ↓
Filters out those 10 words
  ↓
Selects 10 NEW random words from remaining pool
  ↓
Student completes game
  ↓
System tracks: usedWordIds.EASY = [e1...e20] (20 words now)
```

### After Completing All Words
```
Student starts Easy level (3rd time)
  ↓
System: "All 20 Easy words used!"
  ↓
🔄 RESET: Clear used words list
  ↓
Selects 10 random words from FULL pool again
  ↓
Student sees: "🎓 All Words Mastered! Starting fresh..."
  ↓
System tracks: usedWordIds.EASY = [e5, e12, e3, e18, e7, e1, e9, e15, e20, e11]
```

---

## Configuration

### Reset Threshold
Currently set to 90% in `firebaseService.ts`:
```typescript
const shouldReset = combinedUsedIds.length >= allWordsForDifficulty * 0.9;
```

To change the threshold:
- 100% = Reset only when ALL words used (strict)
- 90% = Reset when 90% used (current, recommended)
- 80% = Reset when 80% used (more frequent resets)

### Minimum Words for Game
Set to 10 words in `App.tsx`:
```typescript
if (unusedWords.length >= 10) {
  // Use unused words
} else {
  // Reset pool
}
```

---

## Edge Cases Handled

### 1. Not Enough Words in Database
If word bank has fewer than 10 words for a difficulty:
- System uses all available words
- No reset needed (always uses all words)

### 2. Quick Play Mode
- Quick Play uses 5 random words
- Does NOT track used words
- Always random selection from full pool

### 3. Practice Mode
- Practice mode does NOT track used words
- Always random selection from full pool
- No progress saved

### 4. New Student
- First game: No used words tracked
- Gets random 10 words from full pool
- Tracking starts after first game completion

---

## Console Logging

The system logs helpful messages:

```
🔄 Resetting word pool for EASY - All words completed!
🎉 Congratulations! You've completed all 20 EASY words!
```

These help with debugging and understanding the system behavior.

---

## Future Enhancements

### Possible Improvements:
1. **Smart Reset**: Reset only words the student got correct
2. **Difficulty Progression**: Automatically suggest next difficulty when pool completed
3. **Statistics**: Show "Words Completed: 15/20" in UI
4. **Teacher Dashboard**: Show which students completed all words
5. **Custom Pools**: Teachers can create custom word pools for specific students
6. **Spaced Repetition**: Prioritize words student got wrong in previous games

---

## Testing Checklist

- [ ] First game: Random 10 words selected
- [ ] Second game: Different 10 words selected (no repeats)
- [ ] After completing all words: Pool resets
- [ ] Reset celebration shows correctly
- [ ] Console logs show reset message
- [ ] Each difficulty tracked separately
- [ ] Quick Play doesn't affect tracking
- [ ] Practice Mode doesn't affect tracking
- [ ] Used words persist across sessions
- [ ] Multiple students don't interfere with each other

---

## Related Files

- `types.ts` - User interface with usedWordIds field
- `App.tsx` - Word selection logic with reset detection
- `firebaseService.ts` - Used word tracking and reset logic
- `MilestoneCelebration.tsx` - Reset celebration display

---

**Implementation Date**: February 13, 2026  
**Version**: 1.0  
**Status**: ✅ Complete and Ready for Testing
