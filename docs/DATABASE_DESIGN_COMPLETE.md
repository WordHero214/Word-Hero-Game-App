# Complete Database Design - Offline Spelling Game

**Total Questions**: 540 (6 grades × 3 levels × 30 questions)  
**Purpose**: Offline-first spelling game with grade-based progression

---

## 📊 Database Schema

### Words Collection

```typescript
interface Word {
  id: string;                    // Unique identifier
  grade: number;                 // 1-6
  level: 'EASY' | 'MEDIUM' | 'HARD';
  word: string;                  // The spelling word (uppercase)
  englishHint: string;           // Hint in English
  tagalogHint: string;           // Hint in Filipino/Tagalog
  category: string;              // e.g., "Animals", "Values", "Nature"
  createdAt: timestamp;          // When added
  createdBy: string;             // Teacher ID
  isActive: boolean;             // Can be disabled
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'; // For compatibility
}
```

### User Progress Tracking

```typescript
interface UserProgress {
  userId: string;
  grade: number;                 // Current grade (1-6)
  
  // Track used words per level to avoid repetition
  usedWordIds: {
    EASY: string[];              // IDs of words already used
    MEDIUM: string[];
    HARD: string[];
  };
  
  // Current level progress
  currentLevel: 'EASY' | 'MEDIUM' | 'HARD';
  
  // Completion tracking
  completedLevels: {
    EASY: boolean;
    MEDIUM: boolean;
    HARD: boolean;
  };
  
  // Statistics
  totalWordsCompleted: number;
  cyclesCompleted: number;       // How many times reset
  lastPlayedAt: timestamp;
}
```

---

## 🎯 Educational Progression Logic

### Grade 1 (Ages 6-7)
**Focus**: Basic objects, animals, simple actions  
**Vocabulary Level**: 3-5 letters  
**Examples**:
- EASY: CAT, DOG, SUN, RUN, BALL, TREE, BOOK, FISH, BIRD, STAR
- MEDIUM: APPLE, HOUSE, WATER, CHAIR, TABLE, HAPPY, SMILE, CLOUD, GRASS, FLOWER
- HARD: SCHOOL, FAMILY, FRIEND, GARDEN, ORANGE, PENCIL, WINDOW, KITCHEN, RAINBOW, ELEPHANT

### Grade 2 (Ages 7-8)
**Focus**: Daily life, community, basic values  
**Vocabulary Level**: 5-8 letters  
**Examples**:
- EASY: COMMUNITY, NEIGHBOR, HELPER, MARKET, CHURCH, SAFETY, CLEAN, HEALTHY
- MEDIUM: ENVIRONMENT, TRADITION, CULTURE, FESTIVAL, CELEBRATION, COOPERATION
- HARD: RESPONSIBILITY, CITIZENSHIP, NEIGHBORHOOD, CONSERVATION, PARTICIPATION

### Grade 3 (Ages 8-9)
**Focus**: Nature, school subjects, behavior  
**Vocabulary Level**: 6-10 letters  
**Examples**:
- EASY: RESPECT, KINDNESS, HONESTY, PATIENCE, COURAGE, SHARING, CARING
- MEDIUM: COOPERATION, DISCIPLINE, OBEDIENCE, GRATITUDE, GENEROSITY
- HARD: PERSEVERANCE, DETERMINATION, COMPASSION, ACCOUNTABILITY, RELIABILITY

### Grade 4 (Ages 9-10)
**Focus**: Abstract thinking, academics  
**Vocabulary Level**: 7-12 letters  
**Examples**:
- EASY: DISCOVERY, INVENTION, SOLUTION, PROBLEM, QUESTION, ANSWER
- MEDIUM: DEVELOPMENT, IMPROVEMENT, ACHIEVEMENT, EXCELLENCE, PROGRESS
- HARD: INVESTIGATION, EXPERIMENTATION, OBSERVATION, CLASSIFICATION, HYPOTHESIS

### Grade 5 (Ages 10-11)
**Focus**: Leadership, communication, advanced values  
**Vocabulary Level**: 8-14 letters  
**Examples**:
- EASY: LEADERSHIP, TEAMWORK, CONFIDENCE, INITIATIVE, MOTIVATION
- MEDIUM: COMMUNICATION, COLLABORATION, ORGANIZATION, PRESENTATION
- HARD: RESPONSIBILITY, ACCOUNTABILITY, INDEPENDENCE, PERSEVERANCE, DEDICATION

### Grade 6 (Ages 11-12)
**Focus**: Advanced values, academic vocabulary  
**Vocabulary Level**: 9-15 letters  
**Examples**:
- EASY: INDEPENDENCE, CITIZENSHIP, PATRIOTISM, DEMOCRACY, FREEDOM
- MEDIUM: INNOVATION, CREATIVITY, TECHNOLOGY, SUSTAINABILITY, BIODIVERSITY
- HARD: RESPONSIBILITY, ACCOUNTABILITY, PROFESSIONALISM, ENTREPRENEURSHIP, GLOBALIZATION

---

## 🔄 Random Selection & Reset Logic

### How It Works:

1. **Initial Play**:
   - Student starts at EASY level for their grade
   - System randomly selects 10 words from available pool
   - Tracks used word IDs

2. **Level Progression**:
   - Complete EASY → Unlock MEDIUM
   - Complete MEDIUM → Unlock HARD
   - Complete HARD → Cycle resets

3. **Reset Mechanism**:
   - When all 3 levels completed, reset to EASY
   - Clear used word IDs for all levels
   - Select NEW random words from pool
   - Increment cycle counter

4. **Word Pool Management**:
   ```typescript
   // Get available words for current level
   const availableWords = allWords.filter(word => 
     word.grade === userGrade &&
     word.level === currentLevel &&
     !usedWordIds[currentLevel].includes(word.id)
   );
   
   // If pool exhausted, reset
   if (availableWords.length < 10) {
     resetWordPool(currentLevel);
   }
   
   // Randomly select 10 words
   const selectedWords = shuffleArray(availableWords).slice(0, 10);
   ```

---

## 📝 Sample Data Structure

### CSV Format for Bulk Upload

```csv
grade,level,word,englishHint,tagalogHint,category
1,EASY,CAT,A small furry pet that says meow,Isang maliit na alaga na tumutunog ng meow,Animals
1,EASY,DOG,A loyal pet that barks and wags its tail,Isang tapat na alaga na tumatahol,Animals
1,EASY,SUN,The bright star that gives us light and warmth,Ang maliwanag na bituin na nagbibigay ng liwanag,Nature
1,MEDIUM,APPLE,A crunchy red or green fruit,Isang malutong na pula o berdeng prutas,Fruits
1,MEDIUM,HOUSE,A building where a family lives,Isang gusali kung saan nakatira ang pamilya,Places
1,HARD,SCHOOL,A place where children learn,Isang lugar kung saan nag-aaral ang mga bata,Places
2,EASY,COMMUNITY,People living in the same area,Mga taong nakatira sa parehong lugar,Social
2,MEDIUM,ENVIRONMENT,The natural world around us,Ang natural na mundo sa paligid natin,Nature
2,HARD,RESPONSIBILITY,Taking care of your duties,Pag-aalaga sa iyong mga tungkulin,Values
```

### JSON Format for Firebase

```json
{
  "words": [
    {
      "id": "g1_easy_001",
      "grade": 1,
      "level": "EASY",
      "word": "CAT",
      "englishHint": "A small furry pet that says meow",
      "tagalogHint": "Isang maliit na alaga na tumutunog ng meow",
      "category": "Animals",
      "difficulty": "EASY",
      "isActive": true,
      "createdAt": "2026-02-14T00:00:00Z",
      "createdBy": "system"
    },
    {
      "id": "g1_easy_002",
      "grade": 1,
      "level": "EASY",
      "word": "DOG",
      "englishHint": "A loyal pet that barks and wags its tail",
      "tagalogHint": "Isang tapat na alaga na tumatahol",
      "category": "Animals",
      "difficulty": "EASY",
      "isActive": true,
      "createdAt": "2026-02-14T00:00:00Z",
      "createdBy": "system"
    }
  ]
}
```

---

## 🎮 Game Flow Logic

### 1. Start Game
```typescript
async function startGame(userId: string, grade: number) {
  // Get user progress
  const progress = await getUserProgress(userId);
  
  // Get current level
  const currentLevel = progress.currentLevel || 'EASY';
  
  // Get available words
  const availableWords = await getAvailableWords(
    grade,
    currentLevel,
    progress.usedWordIds[currentLevel]
  );
  
  // Check if reset needed
  if (availableWords.length < 10) {
    await resetWordPool(userId, currentLevel);
    availableWords = await getAvailableWords(grade, currentLevel, []);
  }
  
  // Randomly select 10 words
  const gameWords = shuffleArray(availableWords).slice(0, 10);
  
  return gameWords;
}
```

### 2. Complete Game
```typescript
async function completeGame(userId: string, results: GameResult[]) {
  const progress = await getUserProgress(userId);
  
  // Mark words as used
  const usedIds = results.map(r => r.wordId);
  progress.usedWordIds[progress.currentLevel].push(...usedIds);
  
  // Check if level completed (all words in pool used)
  const totalWords = await countWords(progress.grade, progress.currentLevel);
  const usedWords = progress.usedWordIds[progress.currentLevel].length;
  
  if (usedWords >= totalWords) {
    // Level completed
    progress.completedLevels[progress.currentLevel] = true;
    
    // Move to next level or reset
    if (progress.currentLevel === 'EASY') {
      progress.currentLevel = 'MEDIUM';
    } else if (progress.currentLevel === 'MEDIUM') {
      progress.currentLevel = 'HARD';
    } else {
      // All levels completed - RESET
      await resetAllLevels(userId);
      progress.cyclesCompleted++;
    }
  }
  
  await updateUserProgress(userId, progress);
}
```

### 3. Reset Logic
```typescript
async function resetAllLevels(userId: string) {
  const progress = await getUserProgress(userId);
  
  // Clear used words
  progress.usedWordIds = {
    EASY: [],
    MEDIUM: [],
    HARD: []
  };
  
  // Reset completion status
  progress.completedLevels = {
    EASY: false,
    MEDIUM: false,
    HARD: false
  };
  
  // Start from EASY again
  progress.currentLevel = 'EASY';
  
  await updateUserProgress(userId, progress);
}
```

---

## 💾 Offline Storage Implementation

### IndexedDB Schema

```typescript
// Database: WordHeroOffline
// Version: 1

// Object Store: words
{
  keyPath: 'id',
  indexes: [
    { name: 'grade', keyPath: 'grade' },
    { name: 'level', keyPath: 'level' },
    { name: 'gradeLevel', keyPath: ['grade', 'level'] }
  ]
}

// Object Store: userProgress
{
  keyPath: 'userId'
}

// Object Store: gameHistory
{
  keyPath: 'id',
  autoIncrement: true,
  indexes: [
    { name: 'userId', keyPath: 'userId' },
    { name: 'timestamp', keyPath: 'timestamp' }
  ]
}
```

### Offline Data Sync

```typescript
// Download all words for offline use
async function syncWordsOffline() {
  const words = await fetchAllWords();
  await saveToIndexedDB('words', words);
}

// Get words offline
async function getWordsOffline(grade: number, level: string) {
  const db = await openIndexedDB();
  const tx = db.transaction('words', 'readonly');
  const store = tx.objectStore('words');
  const index = store.index('gradeLevel');
  
  const words = await index.getAll([grade, level]);
  return words;
}
```

---

## 📊 Database Statistics

### Total Questions Breakdown

| Grade | Easy | Medium | Hard | Total |
|-------|------|--------|------|-------|
| 1     | 30   | 30     | 30   | 90    |
| 2     | 30   | 30     | 30   | 90    |
| 3     | 30   | 30     | 30   | 90    |
| 4     | 30   | 30     | 30   | 90    |
| 5     | 30   | 30     | 30   | 90    |
| 6     | 30   | 30     | 30   | 90    |
| **Total** | **180** | **180** | **180** | **540** |

### Storage Requirements

- **Per Word**: ~200 bytes (with hints)
- **Total Words**: 540 × 200 bytes = 108 KB
- **With Metadata**: ~150 KB
- **IndexedDB Limit**: 50+ MB (plenty of space)

---

## 🔐 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Words collection
    match /words/{wordId} {
      // Everyone can read (for offline sync)
      allow read: if true;
      
      // Only teachers and admins can write
      allow create, update, delete: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['TEACHER', 'ADMIN']);
    }
    
    // User progress
    match /userProgress/{userId} {
      // Users can read their own progress
      allow read: if request.auth.uid == userId;
      
      // Users can update their own progress
      allow write: if request.auth.uid == userId;
    }
  }
}
```

---

## 📥 Bulk Upload Template

### Excel/CSV Template

Download template: `WORD_DATABASE_TEMPLATE.csv`

| Column | Required | Format | Example |
|--------|----------|--------|---------|
| grade | Yes | 1-6 | 1 |
| level | Yes | EASY/MEDIUM/HARD | EASY |
| word | Yes | UPPERCASE | CAT |
| englishHint | Yes | Text | A small furry pet |
| tagalogHint | Yes | Text | Isang maliit na alaga |
| category | Yes | Text | Animals |

### Upload Process

1. Teacher prepares CSV file
2. Upload through admin panel
3. System validates data
4. Imports to Firestore
5. Syncs to offline storage

---

## 🎯 Implementation Checklist

- [ ] Create Firestore collections
- [ ] Set up IndexedDB schema
- [ ] Implement word selection logic
- [ ] Implement reset mechanism
- [ ] Create bulk upload feature
- [ ] Add offline sync
- [ ] Test random selection
- [ ] Test reset functionality
- [ ] Create sample dataset (540 words)
- [ ] Deploy to production

---

## 📚 Next Steps

1. **Create Sample Dataset**: Generate 540 words across all grades/levels
2. **Implement Offline Storage**: Set up IndexedDB
3. **Build Selection Algorithm**: Random word picker with tracking
4. **Add Reset Logic**: Automatic reset when cycle completes
5. **Create Upload Tool**: Bulk CSV upload for teachers
6. **Test Thoroughly**: Ensure no word repetition until reset

---

**Database design complete!** Ready for implementation. 🎓
