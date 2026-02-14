// Offline Storage Service using IndexedDB
// Stores words and game results locally for offline play

const DB_NAME = 'MasteringWordsDB';
const DB_VERSION = 2; // Incremented for new stores
const WORDS_STORE = 'words';
const PENDING_RESULTS_STORE = 'pendingResults';
const USER_DATA_STORE = 'userData';
const WORD_METADATA_STORE = 'wordMetadata'; // Track word versions/timestamps
const USED_WORDS_STORE = 'usedWords'; // Track which words students have seen

let db: IDBDatabase | null = null;

// Initialize IndexedDB
export const initOfflineDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      if (!database.objectStoreNames.contains(WORDS_STORE)) {
        const wordsStore = database.createObjectStore(WORDS_STORE, { keyPath: 'id' });
        wordsStore.createIndex('term', 'term', { unique: false });
        wordsStore.createIndex('difficulty', 'difficulty', { unique: false });
      }

      if (!database.objectStoreNames.contains(PENDING_RESULTS_STORE)) {
        const pendingStore = database.createObjectStore(PENDING_RESULTS_STORE, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        pendingStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!database.objectStoreNames.contains(USER_DATA_STORE)) {
        database.createObjectStore(USER_DATA_STORE, { keyPath: 'userId' });
      }

      // NEW: Word metadata store for tracking versions/timestamps
      if (!database.objectStoreNames.contains(WORD_METADATA_STORE)) {
        const metadataStore = database.createObjectStore(WORD_METADATA_STORE, { keyPath: 'key' });
        metadataStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
      }

      // NEW: Used words store for preventing repetition
      if (!database.objectStoreNames.contains(USED_WORDS_STORE)) {
        const usedWordsStore = database.createObjectStore(USED_WORDS_STORE, { 
          keyPath: 'id',
          autoIncrement: true 
        });
        usedWordsStore.createIndex('userId', 'userId', { unique: false });
        usedWordsStore.createIndex('wordId', 'wordId', { unique: false });
        usedWordsStore.createIndex('userWord', ['userId', 'wordId'], { unique: false });
      }
    };
  });
};

// Save words to IndexedDB with version tracking
export const saveWordsOffline = async (words: any[], forceUpdate = false): Promise<void> => {
  if (!db) await initOfflineDB();
  
  return new Promise(async (resolve, reject) => {
    try {
      // Check if words have changed
      const currentMetadata = await getWordMetadata();
      const newTimestamp = Date.now();
      const wordsHash = JSON.stringify(words.map(w => ({ id: w.id, term: w.term }))); // Simple hash
      
      if (!forceUpdate && currentMetadata?.wordsHash === wordsHash) {
        console.log('✅ Words unchanged, skipping save');
        resolve();
        return;
      }
      
      const transaction = db!.transaction([WORDS_STORE, WORD_METADATA_STORE], 'readwrite');
      const wordsStore = transaction.objectStore(WORDS_STORE);
      const metadataStore = transaction.objectStore(WORD_METADATA_STORE);

      // Clear existing words
      wordsStore.clear();

      // Add all words
      words.forEach(word => wordsStore.add(word));
      
      // Update metadata
      metadataStore.put({
        key: 'words_version',
        lastUpdated: newTimestamp,
        wordsHash,
        wordCount: words.length
      });

      transaction.oncomplete = () => {
        console.log(`✅ Saved ${words.length} words to offline storage (updated: ${new Date(newTimestamp).toLocaleString()})`);
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    } catch (error) {
      reject(error);
    }
  });
};

// Get words from IndexedDB
export const getWordsOffline = async (): Promise<any[]> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([WORDS_STORE], 'readonly');
    const store = transaction.objectStore(WORDS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Save game result for later sync
export const savePendingResult = async (result: any): Promise<void> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PENDING_RESULTS_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_RESULTS_STORE);

    const resultWithTimestamp = {
      ...result,
      timestamp: Date.now(),
      synced: false
    };

    store.add(resultWithTimestamp);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// Get all pending results
export const getPendingResults = async (): Promise<any[]> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PENDING_RESULTS_STORE], 'readonly');
    const store = transaction.objectStore(PENDING_RESULTS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Clear synced results
export const clearSyncedResults = async (ids: number[]): Promise<void> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([PENDING_RESULTS_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_RESULTS_STORE);

    ids.forEach(id => store.delete(id));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// Save user data locally
export const saveUserDataOffline = async (userId: string, userData: any): Promise<void> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([USER_DATA_STORE], 'readwrite');
    const store = transaction.objectStore(USER_DATA_STORE);

    store.put({ userId, ...userData, lastUpdated: Date.now() });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// Get user data from local storage
export const getUserDataOffline = async (userId: string): Promise<any | null> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([USER_DATA_STORE], 'readonly');
    const store = transaction.objectStore(USER_DATA_STORE);
    const request = store.get(userId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

// Check if online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Initialize offline support
export const initOfflineSupport = async () => {
  try {
    await initOfflineDB();
    console.log('✅ Offline support initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize offline support:', error);
    return false;
  }
};

// Get word metadata (version/timestamp info)
export const getWordMetadata = async (): Promise<any | null> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([WORD_METADATA_STORE], 'readonly');
    const store = transaction.objectStore(WORD_METADATA_STORE);
    const request = store.get('words_version');

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

// Mark words as used by a student
export const markWordsAsUsed = async (userId: string, wordIds: string[]): Promise<void> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([USED_WORDS_STORE], 'readwrite');
    const store = transaction.objectStore(USED_WORDS_STORE);
    const timestamp = Date.now();

    wordIds.forEach(wordId => {
      store.add({
        userId,
        wordId,
        usedAt: timestamp
      });
    });

    transaction.oncomplete = () => {
      console.log(`✅ Marked ${wordIds.length} words as used for user ${userId}`);
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
};

// Get used word IDs for a student
export const getUsedWordIds = async (userId: string): Promise<string[]> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([USED_WORDS_STORE], 'readonly');
    const store = transaction.objectStore(USED_WORDS_STORE);
    const index = store.index('userId');
    const request = index.getAll(userId);

    request.onsuccess = () => {
      const usedWords = request.result || [];
      const wordIds = usedWords.map((item: any) => item.wordId);
      resolve(wordIds);
    };
    request.onerror = () => reject(request.error);
  });
};

// Get fresh words (not recently used) for a student
export const getFreshWords = async (
  userId: string, 
  allWords: any[], 
  count: number,
  difficulty?: string
): Promise<any[]> => {
  try {
    // Get used word IDs
    const usedWordIds = await getUsedWordIds(userId);
    
    // Filter by difficulty if specified
    let availableWords = difficulty 
      ? allWords.filter(w => w.difficulty === difficulty)
      : allWords;
    
    // Separate fresh and used words
    const freshWords = availableWords.filter(w => !usedWordIds.includes(w.id));
    const usedWords = availableWords.filter(w => usedWordIds.includes(w.id));
    
    console.log(`📊 Word Pool Stats for user ${userId}:`);
    console.log(`   Total available: ${availableWords.length}`);
    console.log(`   Fresh (unused): ${freshWords.length}`);
    console.log(`   Previously used: ${usedWords.length}`);
    
    // If we have enough fresh words, use them
    if (freshWords.length >= count) {
      const selected = shuffleArray(freshWords).slice(0, count);
      console.log(`✅ Selected ${selected.length} fresh words`);
      return selected;
    }
    
    // If not enough fresh words, reset and use all words
    if (freshWords.length === 0 && usedWords.length > 0) {
      console.log('🔄 All words used! Resetting word pool...');
      await resetUsedWords(userId);
      const selected = shuffleArray(availableWords).slice(0, count);
      console.log(`✅ Selected ${selected.length} words from reset pool`);
      return selected;
    }
    
    // Mix fresh and used words if needed
    const selected = [
      ...freshWords,
      ...shuffleArray(usedWords).slice(0, count - freshWords.length)
    ];
    console.log(`✅ Selected ${selected.length} words (${freshWords.length} fresh + ${selected.length - freshWords.length} used)`);
    return selected;
  } catch (error) {
    console.error('❌ Error getting fresh words:', error);
    // Fallback: return random words
    return shuffleArray(allWords).slice(0, count);
  }
};

// Reset used words for a student (when they've seen all words)
export const resetUsedWords = async (userId: string): Promise<void> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([USED_WORDS_STORE], 'readwrite');
    const store = transaction.objectStore(USED_WORDS_STORE);
    const index = store.index('userId');
    const request = index.openCursor(IDBKeyRange.only(userId));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    transaction.oncomplete = () => {
      console.log(`✅ Reset used words for user ${userId}`);
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
};

// Shuffle array utility
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Clear all used words (admin function)
export const clearAllUsedWords = async (): Promise<void> => {
  if (!db) await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([USED_WORDS_STORE], 'readwrite');
    const store = transaction.objectStore(USED_WORDS_STORE);
    store.clear();

    transaction.oncomplete = () => {
      console.log('✅ Cleared all used words');
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
};
