// Offline Sync Service
// Handles syncing game results when connection is restored

import { updateUserProgress } from './firebaseService';
import { 
  getPendingResults, 
  clearSyncedResults, 
  isOnline,
  saveWordsOffline,
  getWordsOffline
} from './offlineStorage';
import { Word, GameSession } from './types';

// Sync pending game results to Firebase
export const syncPendingResults = async (userId: string): Promise<number> => {
  if (!isOnline()) {
    console.log('⏸️ Offline - skipping sync');
    return 0;
  }

  try {
    const pendingResults = await getPendingResults();
    
    if (pendingResults.length === 0) {
      console.log('✅ No pending results to sync');
      return 0;
    }

    console.log(`🔄 Syncing ${pendingResults.length} pending results...`);

    const syncedIds: number[] = [];

    for (const result of pendingResults) {
      try {
        // Upload to Firebase
        await updateUserProgress(userId, result.session);
        syncedIds.push(result.id);
        console.log(`✅ Synced result ${result.id}`);
      } catch (error) {
        console.error(`❌ Failed to sync result ${result.id}:`, error);
      }
    }

    // Clear successfully synced results
    if (syncedIds.length > 0) {
      await clearSyncedResults(syncedIds);
      console.log(`✅ Cleared ${syncedIds.length} synced results`);
    }

    return syncedIds.length;
  } catch (error) {
    console.error('❌ Sync failed:', error);
    return 0;
  }
};

// Cache words for offline use
export const cacheWordsForOffline = async (words: Word[]): Promise<void> => {
  try {
    await saveWordsOffline(words);
    console.log(`✅ Cached ${words.length} words for offline use`);
  } catch (error) {
    console.error('❌ Failed to cache words:', error);
  }
};

// Load words (online or offline)
export const loadWords = async (
  onlineLoader: () => Promise<Word[]>
): Promise<{ words: Word[]; isOffline: boolean }> => {
  if (isOnline()) {
    try {
      // Try to load from Firebase
      const words = await onlineLoader();
      
      // Cache for offline use
      await cacheWordsForOffline(words);
      
      return { words, isOffline: false };
    } catch (error) {
      console.warn('⚠️ Failed to load words online, trying offline cache...', error);
    }
  }

  // Load from offline cache
  try {
    const words = await getWordsOffline();
    
    if (words.length > 0) {
      console.log(`✅ Loaded ${words.length} words from offline cache`);
      return { words, isOffline: true };
    } else {
      console.warn('⚠️ No words in offline cache');
      return { words: [], isOffline: true };
    }
  } catch (error) {
    console.error('❌ Failed to load words from offline cache:', error);
    return { words: [], isOffline: true };
  }
};

// Setup online/offline event listeners
export const setupOnlineListeners = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  const handleOnline = () => {
    console.log('🌐 Connection restored');
    onOnline();
  };

  const handleOffline = () => {
    console.log('📴 Connection lost');
    onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
