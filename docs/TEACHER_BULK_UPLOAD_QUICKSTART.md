# Teacher Bulk Upload - Quick Start Guide 🚀

## 3-Step Process

### Step 1: Download Template
1. Click "📤 Bulk Upload" button
2. Click "⬇️ Download Template File"
3. Open in Excel or Google Sheets

### Step 2: Fill in Your Words
```csv
Word,Difficulty,Grade,Hint (English),Scenario (English),Hint (Filipino),Scenario (Filipino)
apple,EASY,1,A red fruit,I ate an ___,Isang pulang prutas,Kumain ako ng ___
banana,EASY,1,A yellow fruit,Peel the ___,Isang dilaw na prutas,Balatan ang ___
beautiful,MEDIUM,3,Very pretty,The sunset was ___,Napakaganda,Ang takipsilim ay ___
```

### Step 3: Upload
1. Save as CSV file
2. Click "Click to select file"
3. Review preview
4. Click "✅ Upload X Words"

## Quick Tips

### Required Columns
- ✅ Word (the spelling word)
- ✅ Difficulty (EASY, MEDIUM, or HARD)

### Optional Columns
- Grade (1-6)
- Hint (English)
- Scenario (English)
- Hint (Filipino)
- Scenario (Filipino)

### Difficulty Shortcuts
- E = EASY
- M = MEDIUM
- H = HARD

## Example Files

### Minimal (Just Words)
```csv
Word,Difficulty
apple,E
banana,E
cat,E
dog,E
```

### With Hints
```csv
Word,Difficulty,Grade,Hint (English)
apple,E,1,A red fruit
banana,E,1,A yellow fruit
beautiful,M,3,Very pretty
```

### Full Bilingual
```csv
Word,Difficulty,Grade,Hint (English),Scenario (English),Hint (Filipino),Scenario (Filipino)
apple,E,1,A red fruit,I ate an ___,Isang pulang prutas,Kumain ako ng ___
```

## Common Mistakes to Avoid

❌ Leaving Word or Difficulty empty  
❌ Using wrong difficulty values (must be EASY/MEDIUM/HARD or E/M/H)  
❌ Uploading XLSX files (must be CSV)  
❌ Using commas in text fields  

✅ Fill required fields  
✅ Use correct difficulty values  
✅ Save as CSV format  
✅ Use semicolons instead of commas in text  

## Need Help?

See full documentation: `BULK_WORD_UPLOAD_FEATURE.md`

---

**Quick Access:**
- Dashboard → "📤 Bulk Upload Words"
- Word Bank Tab → "📤 Bulk Upload"
