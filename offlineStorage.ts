// Offline Storage Service using IndexedDB
// Stores words and game results locally for offline play

const DB_NAME = 'MasteringWordsDB';
const DB_VERSION = 1;
const WORDS_STORE = 'words';
const PENDING_RESULTS_STORE = 'pendingResults';
const USER_DATA_STORE = 'userData';

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
        database.createObjectStore(WORDS_STORE, { keyPath: 'id' });
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
    };
  });
};

// Save words to IndexedDB
export const saveWordsOffline = async (words: any[]): Promise<void> => {
  if (!db) await initOfflineDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([WORDS_STORE], 'readwrite');
    const store = transaction.objectStore(WORDS_STORE);

    // Clear existing words
    store.clear();

    // Add all words
    words.forEach(word => store.add(word));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
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
