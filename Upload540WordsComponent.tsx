import React, { useState } from 'react';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

interface UploadStats {
  total: number;
  success: number;
  failed: number;
  current: string;
}

const Upload540WordsComponent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<UploadStats>({ total: 0, success: 0, failed: 0, current: '' });
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const uploadWords = async () => {
    setUploading(true);
    setCompleted(false);
    setErrors([]);

    try {
      // Fetch the CSV file
      const response = await fetch('/COMPLETE_WORD_DATABASE_PART1.csv');
      const csvText = await response.text();
      
      const lines = csvText.split('\n').filter(line => line.trim());
      const dataLines = lines.slice(1); // Skip header
      
      setStats({ total: dataLines.length, success: 0, failed: 0, current: '' });

      let successCount = 0;
      let failedCount = 0;
      const errorList: string[] = [];

      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim();
        if (!line) continue;

        try {
          const parts = parseCSVLine(line);

          if (parts.length < 5) {
            throw new Error('Not enough columns');
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
            throw new Error(`Invalid difficulty: ${level}`);
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
            sections: [],
            createdAt: Timestamp.now(),
            createdBy: 'bulk_upload_540'
          };

          // Upload to Firestore
          await setDoc(doc(db, 'words', wordId), wordData);
          
          successCount++;
          setStats({
            total: dataLines.length,
            success: successCount,
            failed: failedCount,
            current: word
          });

          // Small delay to avoid rate limiting
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }

        } catch (error) {
          failedCount++;
          const errorMsg = `Line ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errorList.push(errorMsg);
          setStats(prev => ({ ...prev, failed: failedCount }));
        }
      }

      setErrors(errorList);
      setCompleted(true);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors([`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setUploading(false);
    }
  };

  const progress = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#162031] rounded-3xl p-8 max-w-2xl w-full border border-white/10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">📚 Upload 540 Words Database</h3>
            <p className="text-gray-400 text-sm">Complete word database for offline use</p>
          </div>
          {!uploading && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-6">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            Database Information
          </h4>
          <div className="text-gray-300 text-sm space-y-2">
            <p>• 540 spelling words across 6 grade levels</p>
            <p>• 3 difficulty levels: Easy, Medium, Hard</p>
            <p>• 30 words per grade per difficulty level</p>
            <p>• Bilingual hints (English & Filipino)</p>
            <p>• Supports offline random word selection</p>
          </div>
        </div>

        {/* Upload Status */}
        {!completed && !uploading && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-white text-lg mb-2">Ready to upload 540 words</p>
            <p className="text-gray-400 text-sm mb-6">
              This will populate your database with the complete word collection
            </p>
            <button
              onClick={uploadWords}
              className="bg-[#00c2a0] hover:bg-[#00d8b3] text-white font-bold py-4 px-8 rounded-xl transition-all active:scale-95"
            >
              Start Upload
            </button>
          </div>
        )}

        {/* Progress */}
        {uploading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Uploading words...</span>
              <span className="text-sm text-white font-bold">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-[#0b1221] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00c2a0] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="bg-[#0b1221] rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Success:</span>
                <span className="text-green-400 font-bold">{stats.success}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-400">Failed:</span>
                <span className="text-red-400 font-bold">{stats.failed}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-400">Total:</span>
                <span className="text-white font-bold">{stats.total}</span>
              </div>
              {stats.current && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-500">Current word:</p>
                  <p className="text-white font-bold">{stats.current}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completion */}
        {completed && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="text-6xl mb-4">🎉</div>
              <h4 className="text-2xl font-bold text-white mb-2">Upload Complete!</h4>
              <p className="text-gray-400">Database is ready for offline use</p>
            </div>

            <div className="bg-[#0b1221] rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{stats.success}</div>
                  <div className="text-sm text-gray-400 mt-1">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{stats.failed}</div>
                  <div className="text-sm text-gray-400 mt-1">Failed</div>
                </div>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 max-h-48 overflow-y-auto">
                <h5 className="text-red-400 font-bold mb-2">Errors ({errors.length}):</h5>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-300 text-xs">{error}</p>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full bg-[#00c2a0] hover:bg-[#00d8b3] text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload540WordsComponent;
