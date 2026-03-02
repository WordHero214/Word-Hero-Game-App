# 📚 540 Words Database Upload Guide

## Overview

This guide explains how to upload the complete 540-word database to Firebase for offline use in the Word Hero game.

## Database Structure

### Complete Coverage
- **6 Grade Levels**: Grades 1-6
- **3 Difficulty Levels**: Easy, Medium, Hard
- **30 Words per Level**: 6 × 3 × 30 = 540 total words
- **Bilingual Support**: English and Filipino (Tagalog) hints

### Word Distribution

| Grade | Easy | Medium | Hard | Total |
|-------|------|--------|------|-------|
| 1     | 30   | 30     | 30   | 90    |
| 2     | 30   | 30     | 30   | 90    |
| 3     | 30   | 30     | 30   | 90    |
| 4     | 30   | 30     | 30   | 90    |
| 5     | 30   | 30     | 30   | 90    |
| 6     | 30   | 30     | 30   | 90    |
| **Total** | **180** | **180** | **180** | **540** |

## Upload Methods

### Method 1: Browser-Based Upload (Recommended)

This method uses the built-in upload component and works directly in the browser.

#### Steps:

1. **Copy CSV to Public Folder** (Already done)
   ```
   masteringword-main/public/COMPLETE_WORD_DATABASE_PART1.csv
   ```

2. **Add Upload Component to Admin View**
   
   Open `AdminView.tsx` and import the component:
   ```typescript
   import Upload540WordsComponent from './Upload540WordsComponent';
   ```

3. **Add Button to Admin Dashboard**
   ```typescript
   const [showUpload540, setShowUpload540] = useState(false);
   
   // In the render section:
   <button
     onClick={() => setShowUpload540(true)}
     className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl"
   >
     📚 Upload 540 Words Database
   </button>
   
   {showUpload540 && (
     <Upload540WordsComponent onClose={() => setShowUpload540(false)} />
   )}
   ```

4. **Run the Upload**
   - Login as Admin
   - Click "Upload 540 Words Database"
   - Click "Start Upload"
   - Wait for completion (takes 2-3 minutes)

### Method 2: Node.js Script Upload

For advanced users who want to run the upload from command line.

#### Prerequisites:
```bash
npm install --save-dev @types/node
```

#### Steps:

1. **Set Environment Variables**
   
   Make sure `.env.local` has all Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. **Run Upload Script**
   ```bash
   npx ts-node masteringword-main/upload540Words.ts
   ```

3. **Monitor Progress**
   - The script will show progress every 50 words
   - Total upload time: 2-3 minutes
   - Success/failure count displayed at end

## CSV File Format

The CSV file has the following structure:

```csv
grade,level,word,english_hint,tagalog_hint
1,Easy,cat,A small furry animal that says "meow",pusa
1,Easy,dog,A loyal pet that barks,aso
```

### Columns:
1. **grade**: 1-6 (grade level)
2. **level**: Easy, Medium, or Hard
3. **word**: The spelling word
4. **english_hint**: Hint in English
5. **tagalog_hint**: Hint in Filipino (Tagalog)

## How It Works

### Upload Process

1. **Read CSV File**: Parses all 540 words from the CSV
2. **Convert Format**: Transforms CSV data to Firestore format
3. **Create Documents**: Each word becomes a Firestore document
4. **Batch Upload**: Uploads with small delays to avoid rate limiting

### Firestore Document Structure

Each word is stored as:

```typescript
{
  id: "word_1234567890_abc123",
  term: "RESPONSIBILITY",
  difficulty: "HARD",
  category: "Grade 2 - HARD",
  hint: "Doing what you are supposed to do",
  hintFil: "responsibilidad",
  gradeLevels: ["2"],
  sections: [],
  createdAt: Timestamp,
  createdBy: "bulk_upload_540"
}
```

## Random Word Selection Logic

### How Students Get Words

1. **Filter by Grade**: Only words matching student's grade level
2. **Filter by Difficulty**: Based on current game difficulty
3. **Random Selection**: Picks 10 random words from filtered pool
4. **Reset Mechanism**: When all words completed, pool resets

### Example Flow

```
Student: Grade 3, Playing EASY level
↓
Filter: grade=3, difficulty=EASY
↓
Available: 30 words
↓
Random Pick: 10 words for game
↓
After completion: Reset and pick new 10
```

## Verification

### Check Upload Success

1. **Firebase Console**
   - Go to Firestore Database
   - Check `words` collection
   - Should have 540+ documents

2. **In-App Verification**
   - Login as student
   - Select grade level
   - Start game at each difficulty
   - Verify words appear correctly

3. **Grade Distribution Check**
   ```javascript
   // In browser console:
   const words = await getWords();
   const byGrade = words.reduce((acc, w) => {
     const grade = w.gradeLevels[0];
     acc[grade] = (acc[grade] || 0) + 1;
     return acc;
   }, {});
   console.log(byGrade);
   // Should show ~90 words per grade
   ```

## Troubleshooting

### Upload Fails

**Problem**: "Permission denied" error

**Solution**: 
- Check Firestore rules allow word creation
- Ensure admin is logged in
- Verify Firebase credentials in `.env.local`

### Incomplete Upload

**Problem**: Only some words uploaded

**Solution**:
- Check error messages in console
- Verify CSV file format
- Re-run upload (duplicates will be skipped)

### Words Not Appearing

**Problem**: Students don't see words in game

**Solution**:
- Verify student has grade level set
- Check word filtering logic in `getWords()`
- Ensure words have correct `gradeLevels` array

## Educational Progression

### Grade 1 (Ages 6-7)
- Basic objects, animals, actions
- Examples: cat, dog, sun, run, ball

### Grade 2 (Ages 7-8)
- Daily life, surroundings, values
- Examples: community, environment, tradition

### Grade 3 (Ages 8-9)
- Nature, school subjects, behavior
- Examples: respect, kindness, cooperation

### Grade 4 (Ages 9-10)
- Abstract thinking + academics
- Examples: discovery, invention, solution

### Grade 5 (Ages 10-11)
- Leadership, discipline, communication
- Examples: leadership, teamwork, perseverance

### Grade 6 (Ages 11-12)
- Advanced values + academic vocabulary
- Examples: independence, citizenship, innovation

## Maintenance

### Adding More Words

1. **Update CSV**: Add new rows to CSV file
2. **Re-upload**: Run upload process again
3. **Verify**: Check new words appear in database

### Updating Existing Words

1. **Firebase Console**: Edit directly in Firestore
2. **Bulk Update**: Create update script if needed
3. **Test**: Verify changes in game

### Removing Words

1. **Firebase Console**: Delete documents
2. **Bulk Delete**: Use Firebase Admin SDK if needed

## Performance

### Upload Speed
- **540 words**: ~2-3 minutes
- **Rate limiting**: 10 words per second
- **Retry logic**: Automatic on failure

### Database Size
- **540 documents**: ~200KB total
- **Offline cache**: Enabled for all words
- **Query speed**: <100ms for filtered results

## Next Steps

After successful upload:

1. ✅ Test with different grade levels
2. ✅ Verify random selection works
3. ✅ Test reset mechanism
4. ✅ Check bilingual hints display correctly
5. ✅ Verify offline functionality

## Support

If you encounter issues:

1. Check Firebase Console for errors
2. Review browser console logs
3. Verify CSV file format
4. Check Firestore security rules
5. Ensure environment variables are set

---

**Status**: Ready to upload 540 words
**Last Updated**: February 14, 2026
**Database Version**: 1.0
