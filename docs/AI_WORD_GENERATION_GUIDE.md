# AI Word Generation System

## Overview
The Mastering Words app now uses Gemini AI to generate random, age-appropriate spelling words dynamically instead of relying on hardcoded data. This ensures fresh, varied content for students.

---

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variable

Update your `.env.local` file:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your real API key from step 1.

### 3. Restart Development Server

After updating `.env.local`, restart your dev server:

```bash
npm run dev
```

---

## How to Generate Words

### For Admins

1. **Login as Admin**
2. **Navigate to Admin Dashboard**
3. **Click "Open Word Generator"** (purple/pink gradient button)
4. **Configure Generation:**
   - Select difficulty level (All Levels, Easy, Medium, or Hard)
   - Adjust word count (5-20 words per level)
   - Toggle "Automatically save to Firebase"
5. **Click "Generate Words"**
6. **Review Generated Words**
7. **Words are automatically saved to Firebase** (if enabled)

### Word Generation Rules

**Easy Mode (Grades 1-3):**
- 4-7 letters long
- Common everyday words
- Includes helpful hints
- Categories: Animals, Food, Nature, Family, Objects, Places

**Medium Mode (Grades 4-5):**
- 6-9 letters long
- More complex vocabulary
- No hints (audio-based learning)
- Categories: School, Music, Transport, Time, Nature, Common

**Hard Mode (Grades 5-6):**
- 8-15 letters long
- Academic and environmental vocabulary
- Includes real-world scenario sentences
- Categories: Environment, Science, Arts, Social, Nature

---

## API Functions

### `generateRandomWords(difficulty, count)`

Generates random words for a specific difficulty level.

```typescript
import { generateRandomWords } from './geminiService';
import { Difficulty } from './types';

// Generate 10 Easy words
const easyWords = await generateRandomWords(Difficulty.EASY, 10);

// Generate 15 Medium words
const mediumWords = await generateRandomWords(Difficulty.MEDIUM, 15);

// Generate 20 Hard words
const hardWords = await generateRandomWords(Difficulty.HARD, 20);
```

**Parameters:**
- `difficulty`: `Difficulty.EASY`, `Difficulty.MEDIUM`, or `Difficulty.HARD`
- `count`: Number of words to generate (default: 10)

**Returns:**
- Array of `Word` objects with unique IDs

### `generateAllLevelWords(wordsPerLevel)`

Generates words for all three difficulty levels at once.

```typescript
import { generateAllLevelWords } from './geminiService';

// Generate 10 words per level (30 total)
const result = await generateAllLevelWords(10);

console.log(result.easy);    // 10 Easy words
console.log(result.medium);  // 10 Medium words
console.log(result.hard);    // 10 Hard words
console.log(result.all);     // All 30 words combined
```

**Parameters:**
- `wordsPerLevel`: Number of words per difficulty (default: 10)

**Returns:**
- Object with `easy`, `medium`, `hard`, and `all` arrays

---

## Word Structure

### Easy Mode Word
```typescript
{
  id: "easy_1707849600000_0",
  term: "APPLE",
  difficulty: "EASY",
  category: "Fruits",
  hint: "A crunchy red or green fruit that keeps the doctor away!"
}
```

### Medium Mode Word
```typescript
{
  id: "medium_1707849600000_0",
  term: "BICYCLE",
  difficulty: "MEDIUM",
  category: "Transport"
}
```

### Hard Mode Word
```typescript
{
  id: "hard_1707849600000_0",
  term: "DEFORESTATION",
  difficulty: "HARD",
  category: "Environment",
  scenario: "Many animals lose their homes because of _______."
}
```

---

## Saving to Firebase

Words are automatically saved to the `words` collection in Firestore.

### Manual Save (Programmatic)

```typescript
import { addWord } from './firebaseService';

const word = {
  id: "custom_word_1",
  term: "EXAMPLE",
  difficulty: Difficulty.EASY,
  category: "Learning",
  hint: "A sample or illustration"
};

await addWord(word);
```

### Firestore Structure

```
words/
  ├── easy_1707849600000_0/
  │   ├── id: "easy_1707849600000_0"
  │   ├── term: "APPLE"
  │   ├── difficulty: "EASY"
  │   ├── category: "Fruits"
  │   ├── hint: "A crunchy red or green fruit..."
  │   └── createdAt: Timestamp
  │
  ├── medium_1707849600000_0/
  │   ├── id: "medium_1707849600000_0"
  │   ├── term: "BICYCLE"
  │   ├── difficulty: "MEDIUM"
  │   ├── category: "Transport"
  │   └── createdAt: Timestamp
  │
  └── hard_1707849600000_0/
      ├── id: "hard_1707849600000_0"
      ├── term: "DEFORESTATION"
      ├── difficulty: "HARD"
      ├── category: "Environment"
      ├── scenario: "Many animals lose their homes..."
      └── createdAt: Timestamp
```

---

## Usage in Game

The app automatically loads words from Firebase when starting a game:

```typescript
// In App.tsx
useEffect(() => {
  const loadWords = async () => {
    try {
      const words = await getWords();
      if (words.length > 0) {
        setWordList(words);
      } else {
        // Falls back to initial mock words if Firebase is empty
        setWordList(INITIAL_MOCK_WORDS);
      }
    } catch (error) {
      console.warn("Could not load words from Firebase");
      setWordList(INITIAL_MOCK_WORDS);
    }
  };
  loadWords();
}, []);
```

---

## Best Practices

### 1. Generate Words Regularly
- Generate new words weekly or monthly
- Keep content fresh for returning students
- Avoid repetition by generating in batches

### 2. Review Generated Words
- Always preview words before saving
- Check for age-appropriateness
- Verify hints and scenarios make sense

### 3. Maintain Word Balance
- Keep similar counts across difficulty levels
- Aim for 50-100 words per difficulty minimum
- Remove outdated or problematic words

### 4. Monitor API Usage
- Gemini API has usage limits
- Generate in batches (10-20 words at a time)
- Use "All Levels" option for efficiency

### 5. Backup Words
- Export words from Firebase regularly
- Keep a backup of high-quality generated words
- Document any custom modifications

---

## Troubleshooting

### "API Key Not Found" Error

**Problem:** Environment variable not loaded

**Solution:**
1. Check `.env.local` file exists in project root
2. Verify variable name is `VITE_GEMINI_API_KEY`
3. Restart development server
4. Clear browser cache

### "Quota Exceeded" Error

**Problem:** API rate limit reached

**Solution:**
1. Wait a few minutes before trying again
2. Reduce word count per generation
3. Check [API quotas](https://aistudio.google.com/app/apikey)
4. Consider upgrading API plan

### Generated Words Not Saving

**Problem:** Firebase permissions or connection issue

**Solution:**
1. Check Firestore rules allow writes
2. Verify Firebase is initialized
3. Check browser console for errors
4. Test Firebase connection with test data

### Words Not Appearing in Game

**Problem:** Words not loading from Firebase

**Solution:**
1. Check Firestore console for saved words
2. Verify `getWords()` function works
3. Check browser console for errors
4. Ensure words have correct structure

### Low-Quality Generated Words

**Problem:** AI generates inappropriate content

**Solution:**
1. Review words before saving
2. Manually delete problematic words from Firebase
3. Regenerate with different parameters
4. Report issues to improve prompts

---

## API Costs

Gemini API pricing (as of 2024):

**Free Tier:**
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

**Estimated Usage:**
- 10 words = ~1 request
- 100 words/day = ~10 requests
- Well within free tier limits

**Tips to Minimize Costs:**
1. Generate in batches (10-20 words)
2. Cache generated words in Firebase
3. Reuse high-quality words
4. Only regenerate when needed

---

## Advanced Usage

### Custom Word Generation

Create your own generation function:

```typescript
import { GoogleGenAI } from "@google/genai";
import { Difficulty } from "./types";

const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});

export const generateThematicWords = async (
  theme: string, 
  difficulty: Difficulty, 
  count: number
) => {
  const prompt = `Generate ${count} ${difficulty} difficulty spelling words 
  related to the theme: ${theme}. Include appropriate hints or scenarios.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 1.2
    }
  });
  
  return JSON.parse(response.text || '[]');
};

// Usage
const spaceWords = await generateThematicWords('Space', Difficulty.HARD, 10);
```

### Batch Import from CSV

```typescript
import { addWord } from './firebaseService';
import { Difficulty } from './types';

const importWordsFromCSV = async (csvData: string) => {
  const lines = csvData.split('\n');
  const words = lines.slice(1).map((line, index) => {
    const [term, difficulty, category, hint] = line.split(',');
    return {
      id: `import_${Date.now()}_${index}`,
      term: term.toUpperCase(),
      difficulty: difficulty as Difficulty,
      category,
      hint
    };
  });
  
  await Promise.all(words.map(word => addWord(word)));
  console.log(`Imported ${words.length} words`);
};
```

---

## Future Enhancements

Potential improvements:

1. **Word Difficulty Analysis**
   - AI analyzes word complexity
   - Auto-assigns difficulty level
   - Suggests appropriate grade level

2. **Themed Word Sets**
   - Generate words by topic (seasons, holidays, science)
   - Create curriculum-aligned word lists
   - Support teacher-requested themes

3. **Multilingual Support**
   - Generate words in multiple languages
   - Support ESL/bilingual learning
   - Translation and pronunciation

4. **Quality Scoring**
   - AI rates word quality
   - Filters out inappropriate content
   - Suggests improvements to hints

5. **Student Performance Analysis**
   - Track which words are hardest
   - Generate similar difficulty words
   - Adaptive word selection

---

## Support

For issues or questions:

1. Check this documentation
2. Review browser console errors
3. Test API key in [AI Studio](https://aistudio.google.com)
4. Check Firebase connection
5. Review Firestore rules

---

**Last Updated:** February 13, 2026
**Version:** 1.0.0
