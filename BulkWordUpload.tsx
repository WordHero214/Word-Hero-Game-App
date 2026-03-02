import React, { useState } from 'react';
import { Difficulty, Word } from './types';
import { addWord } from './firebaseService';

interface BulkWordUploadProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadStats {
  total: number;
  uploaded: number;
  failed: number;
  currentWord: string;
  byGrade: { [key: string]: number };
  byDifficulty: { [key: string]: number };
}

const BulkWordUpload: React.FC<BulkWordUploadProps> = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Partial<Word>[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['.csv', '.txt'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      setError('Please upload a CSV or TXT file');
      return;
    }

    setFile(selectedFile);
    setError('');
    parseFile(selectedFile);
  };

  const parseFile = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header if present
      const startIndex = lines[0].toLowerCase().includes('word') || 
                        lines[0].toLowerCase().includes('term') ||
                        lines[0].toLowerCase().includes('grade') ? 1 : 0;
      
      const parsedWords: Partial<Word>[] = [];
      const gradeStats: { [key: string]: number } = {};
      const difficultyStats: { [key: string]: number } = {};
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Support both comma and tab delimiters
        const parts = line.includes('\t') ? line.split('\t') : line.split(',');
        
        if (parts.length < 3) continue; // Need at least grade, level, word
        
        // NEW FORMAT: grade,level,word,englishHint,englishScenario,tagalogHint,tagalogScenario,category
        const gradeLevel = parts[0]?.trim() || '';
        const difficultyStr = parts[1]?.trim().toUpperCase();
        const word = parts[2]?.trim();
        const hint = parts[3]?.trim() || '';
        const scenario = parts[4]?.trim() || '';
        const hintFil = parts[5]?.trim() || '';
        const scenarioFil = parts[6]?.trim() || '';
        const category = parts[7]?.trim() || 'Imported';
        
        if (!word) continue;
        
        // Validate difficulty
        let difficulty: Difficulty;
        if (difficultyStr === 'EASY' || difficultyStr === 'E') {
          difficulty = Difficulty.EASY;
        } else if (difficultyStr === 'MEDIUM' || difficultyStr === 'M') {
          difficulty = Difficulty.MEDIUM;
        } else if (difficultyStr === 'HARD' || difficultyStr === 'H') {
          difficulty = Difficulty.HARD;
        } else {
          continue; // Skip invalid difficulty
        }
        
        // Track statistics
        gradeStats[gradeLevel] = (gradeStats[gradeLevel] || 0) + 1;
        difficultyStats[difficulty] = (difficultyStats[difficulty] || 0) + 1;
        
        parsedWords.push({
          term: word.toUpperCase(),
          difficulty,
          category: category || 'Imported',
          gradeLevels: gradeLevel ? [gradeLevel] : [],
          hint: hint || undefined,
          scenario: scenario || undefined,
          hintFil: hintFil || undefined,
          scenarioFil: scenarioFil || undefined,
        });
      }
      
      setPreview(parsedWords);
      setShowPreview(true);
      
      // Initialize upload stats
      setUploadStats({
        total: parsedWords.length,
        uploaded: 0,
        failed: 0,
        currentWord: '',
        byGrade: gradeStats,
        byDifficulty: difficultyStats
      });
      
      if (parsedWords.length === 0) {
        setError('No valid words found in file. Please check the format.');
      }
    } catch (err) {
      console.error('Error parsing file:', err);
      setError('Failed to parse file. Please check the format.');
    }
  };

  const handleUpload = async () => {
    if (preview.length === 0) {
      setError('No words to upload');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < preview.length; i++) {
        try {
          const wordData = preview[i];
          
          // Update current word being uploaded
          setUploadStats(prev => prev ? {
            ...prev,
            currentWord: wordData.term!,
            uploaded: successCount,
            failed: failCount
          } : null);
          
          await addWord(
            wordData.term!,
            wordData.difficulty!,
            wordData.category || 'Imported',
            wordData.hint,
            wordData.scenario,
            wordData.gradeLevels,
            [],
            wordData.hintFil,
            wordData.scenarioFil
          );
          successCount++;
          
          // Update stats after successful upload
          setUploadStats(prev => prev ? {
            ...prev,
            uploaded: successCount,
            failed: failCount
          } : null);
        } catch (err) {
          console.error(`Failed to add word: ${preview[i].term}`, err);
          failCount++;
          
          // Update stats after failed upload
          setUploadStats(prev => prev ? {
            ...prev,
            uploaded: successCount,
            failed: failCount
          } : null);
        }
        
        setProgress(Math.round(((i + 1) / preview.length) * 100));
      }

      // Show success modal with final stats
      setUploadStats(prev => prev ? {
        ...prev,
        currentWord: 'Complete!',
        uploaded: successCount,
        failed: failCount
      } : null);
      
      setShowSuccess(true);
      
      if (failCount > 0) {
        setError(`Uploaded ${successCount} words. ${failCount} failed.`);
      }
      
      // Wait to show success animation
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload words. Please try again.');
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `grade,level,word,englishHint,englishScenario,tagalogHint,tagalogScenario,category
1,EASY,CAT,A small furry pet that says meow,This small animal purrs and likes to chase mice. Can you spell it?,Isang maliit na alaga na tumutunog ng meow,Ang maliit na hayop na ito ay umuungol at mahilig humabol ng daga. Marunong ka bang magbaybay nito?,Animals
2,MEDIUM,APPLE,A crunchy red or green fruit,This round fruit grows on trees and is crunchy. Can you spell it?,Isang malutong na pula o berdeng prutas,Ang bilog na prutas na ito ay tumutubo sa puno at malutong. Marunong ka bang magbaybay nito?,Fruits
3,HARD,RAINBOW,Colorful arc in the sky after rain,This beautiful arc of colors appears after the rain. Can you spell it?,Makulay na arko sa langit pagkatapos ng ulan,Ang magandang arko ng mga kulay na ito ay lumilitaw pagkatapos ng ulan. Marunong ka bang magbaybay nito?,Nature`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#162031] rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">📤 Bulk Word Upload</h3>
            <p className="text-gray-400 text-sm">Upload multiple words at once using a CSV file</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-6">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <span className="text-xl">📋</span>
            File Format Instructions
          </h4>
          <div className="text-gray-300 text-sm space-y-2">
            <p>Your CSV file should have the following columns (in order):</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li><strong>Grade</strong> - Grade level (1-6, required)</li>
              <li><strong>Level</strong> - EASY, MEDIUM, or HARD (required)</li>
              <li><strong>Word</strong> - The spelling word (required)</li>
              <li><strong>English Hint</strong> - Short English hint (optional)</li>
              <li><strong>English Scenario</strong> - English context sentence (optional)</li>
              <li><strong>Filipino Hint</strong> - Filipino/Tagalog hint (optional)</li>
              <li><strong>Filipino Scenario</strong> - Filipino context sentence (optional)</li>
              <li><strong>Category</strong> - Word category like Animals, Nature (optional)</li>
            </ol>
            <p className="mt-3 text-xs text-gray-400">
              💡 Tip: Download the template below to see the exact format
            </p>
          </div>
        </div>

        {/* Download Template Button */}
        <button
          onClick={downloadTemplate}
          className="w-full bg-[#00c2a0] hover:bg-[#00d8b3] text-white font-bold py-3 px-6 rounded-xl mb-6 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="text-xl">⬇️</span>
          Download Template File
        </button>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-400 mb-3">Upload Your File</label>
          <div className="relative">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className={`block w-full bg-[#0b1221] border-2 border-dashed ${
                file ? 'border-[#00c2a0]' : 'border-white/10'
              } rounded-2xl p-8 text-center cursor-pointer hover:border-[#00c2a0] transition-all ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {file ? (
                <div className="space-y-2">
                  <div className="text-4xl">📄</div>
                  <p className="text-white font-bold">{file.name}</p>
                  <p className="text-gray-400 text-sm">{preview.length} words found</p>
                  <p className="text-[#00c2a0] text-xs">Click to change file</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl">📁</div>
                  <p className="text-white font-bold">Click to select file</p>
                  <p className="text-gray-400 text-sm">or drag and drop</p>
                  <p className="text-gray-500 text-xs">CSV or TXT files only</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Preview */}
        {showPreview && preview.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-bold mb-3">Preview ({preview.length} words)</h4>
            <div className="bg-[#0b1221] rounded-xl p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {preview.slice(0, 10).map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#162031] rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="text-white font-bold">{word.term}</span>
                      {word.hint && (
                        <p className="text-gray-400 text-xs mt-1">{word.hint}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {word.gradeLevels && word.gradeLevels.length > 0 && (
                        <span className="text-xs text-gray-400">Grade {word.gradeLevels[0]}</span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          word.difficulty === Difficulty.EASY
                            ? 'bg-green-500/20 text-green-400'
                            : word.difficulty === Difficulty.MEDIUM
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {word.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
                {preview.length > 10 && (
                  <p className="text-gray-500 text-xs text-center py-2">
                    ... and {preview.length - 10} more words
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Uploading words...</span>
              <span className="text-sm text-white font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#0b1221] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00c2a0] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Stats - Real-time Progress */}
        {uploading && uploadStats && (
          <div className="mb-6 bg-[#0b1221] rounded-2xl p-6 border border-[#00c2a0]/20 animate-in fade-in duration-300">
            {/* Current Word Being Uploaded */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border-2 border-[#00c2a0] border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="text-xs text-gray-400">Currently uploading:</p>
                <p className="text-white font-bold text-lg">{uploadStats.currentWord}</p>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-[#162031] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-[#00c2a0]">{uploadStats.uploaded}</p>
                <p className="text-xs text-gray-400">Uploaded</p>
              </div>
              <div className="bg-[#162031] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-400">{uploadStats.total - uploadStats.uploaded - uploadStats.failed}</p>
                <p className="text-xs text-gray-400">Remaining</p>
              </div>
              <div className="bg-[#162031] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-400">{uploadStats.failed}</p>
                <p className="text-xs text-gray-400">Failed</p>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Distribution by Grade:</p>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(uploadStats.byGrade).map(([grade, count]) => (
                  <div key={grade} className="bg-[#162031] rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-white">{count}</p>
                    <p className="text-xs text-gray-400">Grade {grade}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Distribution by Difficulty:</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(uploadStats.byDifficulty).map(([difficulty, count]) => (
                  <div key={difficulty} className={`rounded-lg p-2 text-center ${
                    difficulty === Difficulty.EASY ? 'bg-green-500/20' :
                    difficulty === Difficulty.MEDIUM ? 'bg-yellow-500/20' :
                    'bg-red-500/20'
                  }`}>
                    <p className="text-sm font-bold text-white">{count}</p>
                    <p className={`text-xs ${
                      difficulty === Difficulty.EASY ? 'text-green-400' :
                      difficulty === Difficulty.MEDIUM ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{difficulty}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && uploadStats && (
          <div className="mb-6 bg-gradient-to-br from-green-500/20 to-[#00c2a0]/20 rounded-2xl p-6 border border-green-500/30 animate-in zoom-in duration-500">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">Upload Complete!</h3>
              <p className="text-gray-300 mb-4">
                Successfully uploaded {uploadStats.uploaded} out of {uploadStats.total} words
              </p>
              
              {/* Final Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#0b1221] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">By Grade</p>
                  <div className="space-y-1">
                    {Object.entries(uploadStats.byGrade).map(([grade, count]) => (
                      <div key={grade} className="flex justify-between text-sm">
                        <span className="text-gray-400">Grade {grade}:</span>
                        <span className="text-white font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0b1221] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">By Difficulty</p>
                  <div className="space-y-1">
                    {Object.entries(uploadStats.byDifficulty).map(([difficulty, count]) => (
                      <div key={difficulty} className="flex justify-between text-sm">
                        <span className={
                          difficulty === Difficulty.EASY ? 'text-green-400' :
                          difficulty === Difficulty.MEDIUM ? 'text-yellow-400' :
                          'text-red-400'
                        }>{difficulty}:</span>
                        <span className="text-white font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400">Closing automatically...</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex-1 bg-[#0b1221] hover:bg-[#162031] text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || preview.length === 0 || uploading}
            className="flex-1 bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <span className="text-xl">✅</span>
                Upload {preview.length} Words
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkWordUpload;
