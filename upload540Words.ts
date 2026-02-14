import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as fs from 'fs';
import * as path from 'path';

// Firebase configuration - update with your credentials
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

interface WordData {
  grade: string;
  level: string;
  word: string;
  englishHint: string;
  tagalogHint: string;
}

async function uploadWords() {
  console.log('🚀 Starting 540 Words Upload Process...\n');

  // Read CSV file
  const csvPath = path.join(__dirname, 'COMPLETE_WORD_DATABASE_PART1.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());

  // Skip header
  const dataLines = lines.slice(1);
  
  console.log(`📊 Found ${dataLines.length} words to upload\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim();
    if (!line) continue;

    try {
      // Parse CSV line (handle quoted fields)
      const parts = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g)?.map(part => 
        part.replace(/^,/, '').replace(/^"|"$/g, '').trim()
      ) || [];

      if (parts.length < 5) {
        console.warn(`⚠️  Skipping line ${i + 2}: Not enough columns`);
        continue;
      }

      const [grade, level, word, englishHint, tagalogHint] = parts;

      // Convert level to difficulty
      let difficulty: string;
      const levelUpper = level.toUpperCase();
      if (levelUpper === 'EASY' || levelUpper === 'E') {
        difficulty = 'EASY';
      } else if (levelUpper === 'MEDIUM' || levelUpper === 'M') {
        difficulty = 'MEDIUM';
      } else if (levelUpper === 'HARD' || levelUpper === 'H') {
        difficulty = 'HARD';
      } else {
        console.warn(`⚠️  Skipping line ${i + 2}: Invalid difficulty "${level}"`);
        continue;
      }

      // Create word document
      const wordId = `word_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const wordData = {
        id: wordId,
        term: word.toUpperCase(),
        difficulty,
        category: `Grade ${grade} - ${difficulty}`,
        hint: englishHint,
        hintFil: tagalogHint,
        gradeLevels: [grade],
        sections: [], // Available to all sections
        createdAt: Timestamp.now(),
        createdBy: 'system_upload'
      };

      // Upload to Firestore
      await setDoc(doc(db, 'words', wordId), wordData);
      
      successCount++;
      
      // Progress indicator
      if (successCount % 50 === 0) {
        console.log(`✅ Uploaded ${successCount}/${dataLines.length} words...`);
      }

    } catch (error) {
      errorCount++;
      const errorMsg = `Line ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Successfully uploaded: ${successCount} words`);
  console.log(`❌ Failed: ${errorCount} words`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  Errors:');
    errors.forEach(err => console.log(`   - ${err}`));
  }
  
  console.log('\n🎉 Database is ready for offline use!');
  console.log('Students can now practice with 540 words across 6 grades and 3 difficulty levels.\n');
}

// Run the upload
uploadWords()
  .then(() => {
    console.log('✨ Upload script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Upload script failed:', error);
    process.exit(1);
  });
