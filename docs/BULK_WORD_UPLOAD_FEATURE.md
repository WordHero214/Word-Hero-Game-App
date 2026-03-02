# Bulk Word Upload Feature 📤

## Overview
Teachers can now upload multiple words at once using CSV files instead of manually entering each word one by one. This feature is perfect for busy teachers who need to quickly add large word lists for different grade levels.

## Features

### 1. CSV File Upload
- Upload CSV or TXT files with word data
- Support for both comma and tab-delimited formats
- Automatic parsing and validation
- Preview before uploading

### 2. Bilingual Support
- Include both English and Filipino (Tagalog) hints and scenarios
- Optional fields - add only what you need

### 3. Grade Level Assignment
- Assign words to specific grade levels (1-6)
- Leave blank for words available to all grades

### 4. Difficulty Levels
- Support for EASY, MEDIUM, HARD
- Shortcuts: E, M, H also accepted

### 5. Progress Tracking
- Real-time upload progress bar
- Success/failure count
- Error handling for invalid entries

## How to Use

### Step 1: Access Bulk Upload
Teachers can access bulk upload from two locations:

**Option A: Dashboard**
1. Log in as Teacher
2. Click "📤 Bulk Upload Words" button in Quick Actions

**Option B: Word Bank Tab**
1. Go to "📚 Word Bank" tab
2. Click "📤 Bulk Upload" button next to "➕ Add Word"

### Step 2: Download Template
1. Click "⬇️ Download Template File" button
2. Open the downloaded CSV file in Excel, Google Sheets, or any text editor
3. Use the template as a guide for formatting your words

### Step 3: Prepare Your File

#### CSV Format
Your file should have 7 columns (in this order):

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| Word | ✅ Yes | The spelling word | apple |
| Difficulty | ✅ Yes | EASY, MEDIUM, HARD (or E, M, H) | EASY |
| Grade | ❌ No | Grade level (1-6) | 1 |
| Hint (English) | ❌ No | English hint text | A red or green fruit |
| Scenario (English) | ❌ No | English context sentence | I ate an ___ for breakfast |
| Hint (Filipino) | ❌ No | Filipino hint text | Isang pulang o berdeng prutas |
| Scenario (Filipino) | ❌ No | Filipino context sentence | Kumain ako ng ___ sa almusal |

#### Example CSV Content
```csv
Word,Difficulty,Grade,Hint (English),Scenario (English),Hint (Filipino),Scenario (Filipino)
apple,EASY,1,A red or green fruit,I ate an ___ for breakfast,Isang pulang o berdeng prutas,Kumain ako ng ___ sa almusal
beautiful,MEDIUM,3,Very pretty or attractive,The sunset was ___,Napakaganda o kaakit-akit,Ang takipsilim ay ___
photosynthesis,HARD,5,How plants make food,Plants use ___ to create energy,Paano gumagawa ng pagkain ang halaman,Gumagamit ang halaman ng ___ upang lumikha ng enerhiya
```

### Step 4: Upload File
1. Click "Click to select file" or drag and drop your CSV file
2. Review the preview showing parsed words
3. Check that all words are correctly formatted
4. Click "✅ Upload X Words" button

### Step 5: Monitor Progress
- Watch the progress bar as words are uploaded
- Wait for completion message
- Words will automatically appear in your Word Bank

## Tips for Success

### ✅ Do's
- Use the template file as a starting point
- Keep words in UPPERCASE (system will auto-convert)
- Test with a small file first (5-10 words)
- Include hints and scenarios for better learning
- Add Filipino translations for bilingual support
- Specify grade levels to target specific students

### ❌ Don'ts
- Don't use special characters in difficulty field (only EASY/MEDIUM/HARD or E/M/H)
- Don't leave Word or Difficulty columns empty
- Don't use commas within text fields (use semicolons instead)
- Don't upload files larger than 1000 words at once (split into smaller batches)

## File Format Examples

### Minimal Format (Required Fields Only)
```csv
Word,Difficulty
apple,EASY
banana,EASY
beautiful,MEDIUM
photosynthesis,HARD
```

### With Grade Levels
```csv
Word,Difficulty,Grade
apple,EASY,1
banana,EASY,1
beautiful,MEDIUM,3
photosynthesis,HARD,5
```

### Full Format (All Fields)
```csv
Word,Difficulty,Grade,Hint (English),Scenario (English),Hint (Filipino),Scenario (Filipino)
apple,E,1,A red fruit,I ate an ___,Isang pulang prutas,Kumain ako ng ___
banana,E,1,A yellow fruit,Peel the ___,Isang dilaw na prutas,Balatan ang ___
```

### Tab-Delimited Format
```
Word	Difficulty	Grade	Hint (English)	Scenario (English)
apple	EASY	1	A red fruit	I ate an ___
banana	EASY	1	A yellow fruit	Peel the ___
```

## Troubleshooting

### Problem: "No valid words found in file"
**Solution:** 
- Check that your file has at least Word and Difficulty columns
- Ensure difficulty values are EASY, MEDIUM, HARD (or E, M, H)
- Remove any empty rows

### Problem: "Failed to parse file"
**Solution:**
- Save file as CSV (not XLSX or other formats)
- Check for special characters or encoding issues
- Try opening in Notepad and re-saving as UTF-8

### Problem: Some words failed to upload
**Solution:**
- Check the error message for specific issues
- Verify all required fields are present
- Ensure no duplicate word IDs
- Try uploading failed words individually

### Problem: Words not appearing for students
**Solution:**
- Check grade level assignments
- Verify difficulty levels are correct
- Ensure words are not filtered out by student's grade/section
- Refresh the page

## Advanced Features

### Batch Processing
For very large word lists (500+ words):
1. Split into smaller files (100-200 words each)
2. Upload one batch at a time
3. Wait for each batch to complete before uploading next

### Grade-Specific Word Lists
Create separate CSV files for each grade:
- `grade1_words.csv` - Easy words for Grade 1
- `grade2_words.csv` - Easy/Medium words for Grade 2
- `grade3_words.csv` - Medium words for Grade 3
- etc.

### Subject-Specific Lists
Organize by subject:
- `science_words.csv` - Science vocabulary
- `math_words.csv` - Math terminology
- `english_words.csv` - General English words

## Technical Details

### Supported File Types
- `.csv` (Comma-Separated Values)
- `.txt` (Tab-delimited text)

### File Size Limits
- Maximum: 1000 words per file
- Recommended: 100-200 words per file for best performance

### Upload Speed
- Approximately 2-3 words per second
- 100 words ≈ 30-50 seconds
- 500 words ≈ 3-4 minutes

### Data Validation
- Automatic word capitalization
- Difficulty level validation
- Grade level validation (1-6)
- Duplicate detection
- Empty field handling

## Security & Permissions

### Who Can Use This Feature?
- ✅ Teachers
- ✅ Admins
- ❌ Students (cannot access)

### Data Privacy
- All uploaded words are stored in Firebase Firestore
- Words are associated with the teacher's account
- Students can only see words assigned to their grade/section

## Future Enhancements

Planned features for future updates:
- [ ] Excel (.xlsx) file support
- [ ] Bulk edit existing words
- [ ] Import from Google Sheets
- [ ] Word list templates by subject
- [ ] Duplicate word detection before upload
- [ ] Undo bulk upload feature
- [ ] Export word bank to CSV

## Support

If you encounter issues:
1. Check this documentation first
2. Try the troubleshooting section
3. Test with the template file
4. Contact system administrator

---

**Created:** February 2026  
**Version:** 1.0  
**Feature Status:** ✅ Active
