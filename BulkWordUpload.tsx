import React, { useState } from 'react';
import { Difficulty, Word } from './types';
import { addWord } from './firebaseService';

interface BulkWordUploadProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BulkWordUpload: React.FC<BulkWordUploadProps> = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Partial<Word>[]>([]);
  const [showPreview, setShowPreview] = useState(false);

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
                        lines[0].toLowerCase().includes('term') ? 1 : 0;
      
      const parsedWords: Partial<Word>[] = [];
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Support both comma and tab delimiters
        const parts = line.includes('\t') ? line.split('\t') : line.split(',');
        
        if (parts.length < 2) continue; // Need at least word and difficulty
        
        const word = parts[0].trim();
        const difficultyStr = parts[1].trim().toUpperCase();
        const gradeLevel = parts[2]?.trim() || '';
        const hint = parts[3]?.trim() || '';
        const scenario = parts[4]?.trim() || '';
        const hintFil = parts[5]?.trim() || '';
        const scenarioFil = parts[6]?.trim() || '';
        
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
        
        parsedWords.push({
          term: word,
          difficulty,
          category: 'Imported',
          gradeLevels: gradeLevel ? [gradeLevel] : [],
          hint: hint || undefined,
          scenario: scenario || undefined,
          hintFil: hintFil || undefined,
          scenarioFil: scenarioFil || undefined,
        });
      }
      
      setPreview(parsedWords);
      setShowPreview(true);
      
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
        } catch (err) {
          console.error(`Failed to add word: ${preview[i].term}`, err);
          failCount++;
        }
        
        setProgress(Math.round(((i + 1) / preview.length) * 100));
      }

      if (failCount > 0) {
        setError(`Uploaded ${successCount} words. ${failCount} failed.`);
      }
      
      // Wait a moment to show completion
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload words. Please try again.');
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `Word,Difficulty,Grade,Hint (English),Scenario (English),Hint (Filipino),Scenario (Filipino)
apple,EASY,1,A red or green fruit,I ate an ___ for breakfast,Isang pulang o berdeng prutas,Kumain ako ng ___ sa almusal
beautiful,MEDIUM,3,Very pretty or attractive,The sunset was ___,Napakaganda o kaakit-akit,Ang takipsilim ay ___
photosynthesis,HARD,5,How plants make food,Plants use ___ to create energy,Paano gumagawa ng pagkain ang halaman,Gumagamit ang halaman ng ___ upang lumikha ng enerhiya`;

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
              <li><strong>Word</strong> - The spelling word (required)</li>
              <li><strong>Difficulty</strong> - EASY, MEDIUM, or HARD (required)</li>
              <li><strong>Grade</strong> - Grade level (1-6, optional)</li>
              <li><strong>Hint (English)</strong> - English hint text (optional)</li>
              <li><strong>Scenario (English)</strong> - English context sentence (optional)</li>
              <li><strong>Hint (Filipino)</strong> - Filipino hint text (optional)</li>
              <li><strong>Scenario (Filipino)</strong> - Filipino context sentence (optional)</li>
            </ol>
            <p className="mt-3 text-xs text-gray-400">
              💡 Tip: You can use E, M, H as shortcuts for difficulty levels
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
