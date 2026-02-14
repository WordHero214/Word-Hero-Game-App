# Database Implementation Guide

Quick guide to implement the 540-word database system with offline support and random selection.

---

## 🚀 Quick Start

### Step 1: Upload Sample Data

1. Open `WORD_DATABASE_TEMPLATE.csv`
2. Complete all 540 words (currently has 60 samples)
3. Upload through Bulk Word Upload feature
4. Verify in Firebase Console

### Step 2: Enable Offline Storage

Already implemented in `offlineStorage.ts` and `offlineSync.ts`

### Step 3: Implement Random Selection

Update `firebaseService.ts` to use grade-based filtering

---

## 📝 Complete the Database

### Words Needed:

**Grade 1**: 90 words (30 EASY, 30 MEDIUM, 30 HARD)  
**Grade 2**: 90 words (30 EASY, 30 MEDIUM, 30 HARD)  
**Grade 3**: 90 words (30 EASY, 30 MEDIUM, 30 HARD)  
**Grade 4**: 90 words (30 EASY, 30 MEDIUM, 30 HARD)  
**Grade 5**: 90 words (30 EASY, 30 MEDIUM, 30 HARD)  
**Grade 6**: 90 words (30 EASY, 30 MEDIUM, 30 HARD)  

**Total**: 540 words

### Template Structure:

```csv
grade,level,word,englishHint,tagalogHint,category
1,EASY,CAT,A small furry pet that says meow,Isang maliit na alaga,Animals
```

---

## 🔄 Random Selection Logic

### Current Implementation:

```typescript
// In firebaseService.ts
export async function getWords(
  grade: number,
  difficulty: Difficulty,
  usedWordIds: string[] = []
): Promise<Word[]> {
  const wordsRef = collection(db, 'words');
  
  // Query words for specific grade and difficulty
  const q = query(
    wordsRef,
    where('grade', '==', grade),
    where('difficulty', '==', difficulty),
    where('isActive', '==', true)
  );
  
  const snapshot = await getDocs(q);
  const allWords = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Word));
  
  // Filter out used words
  const availableWords = allWords.filter(
    word => !usedWordIds.includes(word.id)
  );
  
  // If less than 10 available, reset pool
  if (availableWords.length < 10) {
    // Reset: use all words again
    return shuffleArray(allWords).slice(0, 10);
  }
  
  // Randomly select 10 words
  return shuffleArray(availableWords).slice(0, 10);
}

// Shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

---

## 💾 Offline Implementation

### Already Implemented:

1. **offlineStorage.ts**: IndexedDB wrapper
2. **offlineSync.ts**: Sync logic
3. **App.tsx**: Offline detection

### How It Works:

1. On login, download all words for user's grade
2. Store in IndexedDB
3. When offline, read from IndexedDB
4. When online, sync progress to Firestore

---

## 🎮 Game Flow with Reset

### Level Progression:

```
EASY (10 words) → MEDIUM (10 words) → HARD (10 words) → RESET
```

### Reset Logic:

```typescript
// When all 3 levels completed
if (completedEasy && completedMedium && completedHard) {
  // Clear used word IDs
  usedWordIds = {
    EASY: [],
    MEDIUM: [],
    HARD: []
  };
  
  // Reset to EASY
  currentLevel = 'EASY';
  
  // Increment cycle counter
  cyclesCompleted++;
  
  // Next game will have NEW random words
}
```

---

## 📊 Tracking User Progress

### User Document Structure:

```typescript
{
  userId: "student123",
  grade: 1,
  currentLevel: "EASY",
  usedWordIds: {
    EASY: ["word1", "word2", "word3"],
    MEDIUM: [],
    HARD: []
  },
  completedLevels: {
    EASY: false,
    MEDIUM: false,
    HARD: false
  },
  cyclesCompleted: 0,
  totalWordsCompleted: 3,
  lastPlayedAt: "2026-02-14T10:00:00Z"
}
```

---

## 🔧 Implementation Steps

### 1. Complete Word Database

```bash
# Edit WORD_DATABASE_TEMPLATE.csv
# Add all 540 words following the pattern
# Ensure quality hints that don't reveal answers
```

### 2. Upload to Firebase

```bash
# Use Bulk Word Upload feature in admin panel
# Or import via Firebase Console
```

### 3. Test Random Selection

```bash
# Play through a level
# Verify no word repetition
# Complete all 3 levels
# Verify reset works
# Verify new random words appear
```

### 4. Test Offline Mode

```bash
# Turn off internet
# Play game
# Verify words load from IndexedDB
# Turn on internet
# Verify progress syncs
```

---

## 📋 Quality Checklist

### Word Quality:
- [ ] All 540 words added
- [ ] Hints don't reveal answers
- [ ] Appropriate difficulty for grade
- [ ] Both English and Tagalog hints
- [ ] Proper categories assigned

### Functionality:
- [ ] Random selection works
- [ ] No repetition until reset
- [ ] Reset triggers correctly
- [ ] Offline mode works
- [ ] Progress syncs online

### User Experience:
- [ ] 10 questions per game
- [ ] Clear progression (EASY → MEDIUM → HARD)
- [ ] Reset notification shown
- [ ] Cycle counter displayed
- [ ] Statistics tracked

---

## 🎯 Sample Word Distribution

### Grade 1 (Basic):
- **Animals**: cat, dog, fish, bird (10 words)
- **Nature**: sun, tree, flower, cloud (10 words)
- **Objects**: ball, book, chair, table (10 words)

### Grade 2 (Community):
- **Social**: community, neighbor, helper (10 words)
- **Places**: market, church, school (10 words)
- **Values**: respect, sharing, caring (10 words)

### Grade 3 (Behavior):
- **Values**: kindness, honesty, patience (10 words)
- **Actions**: cooperation, discipline (10 words)
- **Emotions**: gratitude, compassion (10 words)

### Grade 4 (Academic):
- **Science**: discovery, invention, solution (10 words)
- **Process**: development, improvement (10 words)
- **Skills**: investigation, observation (10 words)

### Grade 5 (Leadership):
- **Leadership**: teamwork, confidence (10 words)
- **Communication**: collaboration, presentation (10 words)
- **Values**: responsibility, accountability (10 words)

### Grade 6 (Advanced):
- **Citizenship**: independence, democracy (10 words)
- **Innovation**: creativity, technology (10 words)
- **Global**: sustainability, globalization (10 words)

---

## 🚨 Important Notes

1. **Hint Quality**: Never include the answer word in hints
2. **Grade Appropriate**: Match vocabulary to age level
3. **Bilingual**: Always provide both English and Tagalog
4. **Categories**: Help organize and filter words
5. **Testing**: Test thoroughly before deployment

---

## 📞 Support

For questions about:
- **Database Design**: See `DATABASE_DESIGN_COMPLETE.md`
- **Word Template**: See `WORD_DATABASE_TEMPLATE.csv`
- **Bulk Upload**: See `docs/BULK_WORD_UPLOAD_FEATURE.md`
- **Offline Storage**: See `offlineStorage.ts` and `offlineSync.ts`

---

**Ready to implement!** Start by completing the 540-word database. 📚
