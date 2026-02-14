# Word Generator Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Get Your API Key (2 minutes)

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (looks like: `AIzaSyB...`)

### Step 2: Add API Key to Project (1 minute)

Open `masteringword-main/.env.local` and update:

```env
VITE_GEMINI_API_KEY=AIzaSyB_your_actual_key_here
```

**Save the file** and **restart your dev server**:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Generate Words (30 seconds)

1. Login as **Admin**
2. Click **"Open Word Generator"** (purple button)
3. Select **"All Levels"**
4. Click **"Generate 30 Words"**
5. Done! ✅

---

## 📋 What You Get

### Easy Mode (10 words)
```
APPLE - Fruits
💡 A crunchy red or green fruit that keeps the doctor away!

HOUSE - Places
💡 A building where a family lives together.

WATER - Nature
💡 A clear liquid we drink when we are thirsty.
```

### Medium Mode (10 words)
```
BICYCLE - Transport
(Audio-based, no hints)

CALENDAR - Time
(Audio-based, no hints)

GUITAR - Music
(Audio-based, no hints)
```

### Hard Mode (10 words)
```
DEFORESTATION - Environment
📝 Many animals lose their homes because of _______.

PHOTOSYNTHESIS - Science
📝 Plants make their own food through a process called _______.

SUSTAINABILITY - Environment
📝 Using solar energy is a great example of _______.
```

---

## 🎯 Usage Tips

### For First-Time Setup
1. Generate **"All Levels"** with **10 words each** (30 total)
2. This gives you a complete starter set
3. Takes about 30 seconds

### For Regular Updates
1. Generate **5-10 new words weekly**
2. Keep content fresh for students
3. Mix difficulties based on student needs

### For Themed Learning
1. Generate **Easy words** for younger students
2. Generate **Hard words** for advanced topics
3. Review and save only the best ones

---

## ⚙️ Generator Settings

### Difficulty Levels

**All Levels** (Recommended for first use)
- Generates 10 words × 3 difficulties = 30 words
- Balanced content for all students
- One-click setup

**Easy** (Grades 1-3)
- Simple 4-7 letter words
- Helpful hints included
- Perfect for beginners

**Medium** (Grades 4-5)
- 6-9 letter words
- Audio-based learning
- No hints needed

**Hard** (Grades 5-6)
- 8-15 letter words
- Real-world scenarios
- Academic vocabulary

### Word Count Slider
- **5 words**: Quick test or small addition
- **10 words**: Standard batch (recommended)
- **15-20 words**: Large content update

### Auto-Save Toggle
- ✅ **Enabled**: Saves directly to Firebase (recommended)
- ❌ **Disabled**: Preview first, save manually

---

## 🔍 Preview Before Saving

If you disable auto-save:

1. Generate words
2. Review the list
3. Check quality and appropriateness
4. Click **"Save to Firebase"** if satisfied
5. Or close and regenerate if needed

---

## ✅ Verification

### Check Words Were Saved

**Option 1: Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database**
4. Look for **"words"** collection
5. You should see your generated words

**Option 2: In-Game**
1. Login as a **Student**
2. Go to **Play** screen
3. Start any difficulty level
4. Your new words should appear in the game

---

## 🎮 How Students See Generated Words

### Easy Mode
- Student sees: `_ _ _ _ _` (blank letters)
- Hint appears: "A crunchy red or green fruit..."
- Student types: `APPLE`
- ✅ Correct!

### Medium Mode
- Student hears: 🔊 "BICYCLE" (spoken aloud)
- Student types what they heard
- ✅ Correct!

### Hard Mode
- Student sees: "A two-wheeled vehicle is called a _______."
- Student types: `BICYCLE`
- ✅ Correct!

---

## 🐛 Troubleshooting

### "API Key Not Found"
```
❌ Error: API key not configured
```
**Fix:**
1. Check `.env.local` file exists
2. Verify variable name: `VITE_GEMINI_API_KEY`
3. Restart dev server
4. Clear browser cache (Ctrl+Shift+R)

### "Quota Exceeded"
```
❌ Error: 429 Too Many Requests
```
**Fix:**
1. Wait 1-2 minutes
2. Try generating fewer words (5 instead of 20)
3. Check your [API quota](https://aistudio.google.com/app/apikey)

### "Failed to Save"
```
❌ Error: Missing or insufficient permissions
```
**Fix:**
1. Check you're logged in as **Admin**
2. Verify Firestore rules allow writes
3. Check Firebase connection in console

### Words Not Appearing in Game
**Fix:**
1. Refresh the page (F5)
2. Check Firebase console for saved words
3. Verify words have correct structure
4. Try generating again

---

## 📊 API Usage & Limits

### Free Tier (Gemini API)
- ✅ 15 requests per minute
- ✅ 1,500 requests per day
- ✅ 1 million tokens per month

### Typical Usage
- 10 words = 1 request
- 30 words (all levels) = 3 requests
- 100 words/day = ~10 requests

**You're well within free limits!** 🎉

---

## 🎓 Best Practices

### 1. Start Small
- Generate 10 words per level first
- Test in the game
- Verify quality
- Then generate more

### 2. Review Quality
- Check hints make sense
- Verify scenarios are clear
- Ensure age-appropriate
- Remove any odd words

### 3. Keep It Fresh
- Generate new words weekly
- Rotate content regularly
- Students stay engaged
- Learning stays fun

### 4. Balance Difficulties
- Maintain similar word counts
- Don't overload one difficulty
- Aim for 50-100 words per level
- Monitor student performance

### 5. Backup Your Words
- Export from Firebase monthly
- Keep a backup file
- Document custom changes
- Easy to restore if needed

---

## 🚀 Next Steps

After generating your first batch:

1. ✅ **Test the game** as a student
2. ✅ **Check word quality** in Firebase
3. ✅ **Generate more words** as needed
4. ✅ **Monitor student progress**
5. ✅ **Update content regularly**

---

## 💡 Pro Tips

### Tip 1: Generate in Batches
Don't generate 100 words at once. Do 10-20 at a time for better quality.

### Tip 2: Mix It Up
Generate different difficulties on different days to keep variety.

### Tip 3: Theme-Based
Ask students what topics they want to learn, then generate related words.

### Tip 4: Seasonal Content
Generate holiday or seasonal words to keep content relevant.

### Tip 5: Student Feedback
Ask students which words they found most interesting or challenging.

---

## 📞 Need Help?

1. **Check this guide** - Most answers are here
2. **Review console errors** - Press F12 in browser
3. **Test API key** - Try in [AI Studio](https://aistudio.google.com)
4. **Check Firebase** - Verify connection and rules
5. **Read full guide** - See `AI_WORD_GENERATION_GUIDE.md`

---

## 🎉 Success!

You're now ready to generate unlimited, high-quality spelling words for your students!

**Remember:**
- ✅ Fresh content keeps students engaged
- ✅ AI generates age-appropriate words
- ✅ Automatic hints and scenarios
- ✅ Saves directly to Firebase
- ✅ Free tier is generous

**Happy word generating!** 🎲✨

---

**Quick Reference:**

| Action | Location | Time |
|--------|----------|------|
| Get API Key | [AI Studio](https://aistudio.google.com/app/apikey) | 2 min |
| Add to .env | `.env.local` file | 1 min |
| Generate Words | Admin → Word Generator | 30 sec |
| Verify | Firebase Console | 1 min |
| Test | Play as Student | 2 min |

**Total Setup Time: ~6 minutes** ⚡
