import React, { useState } from 'react';
import { Difficulty, Word } from './types';
import { generateRandomWords, generateAllLevelWords } from './geminiService';
import { addWord } from './firebaseService';

interface WordGeneratorProps {
  onClose: () => void;
  onWordsGenerated: (words: Word[]) => void;
}

const WordGenerator: React.FC<WordGeneratorProps> = ({ onClose, onWordsGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>(Difficulty.EASY);
  const [wordCount, setWordCount] = useState(10);
  const [generatedWords, setGeneratedWords] = useState<Word[]>([]);
  const [saveToFirebase, setSaveToFirebase] = useState(true);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedWords([]);

    try {
      let words: Word[] = [];

      if (selectedDifficulty === 'ALL') {
        const result = await generateAllLevelWords(wordCount);
        words = result.all;
      } else {
        words = await generateRandomWords(selectedDifficulty, wordCount);
      }

      setGeneratedWords(words);

      if (saveToFirebase && words.length > 0) {
        // Save to Firebase
        await Promise.all(words.map(word => addWord(word)));
        alert(`✅ Successfully generated and saved ${words.length} words to Firebase!`);
        onWordsGenerated(words);
      } else {
        alert(`✅ Successfully generated ${words.length} words!`);
      }
    } catch (error: any) {
      console.error('Error generating words:', error);
      alert(`❌ Error: ${error.message || 'Failed to generate words'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToFirebase = async () => {
    if (generatedWords.length === 0) return;

    setLoading(true);
    try {
      await Promise.all(generatedWords.map(word => addWord(word)));
      alert(`✅ Saved ${generatedWords.length} words to Firebase!`);
      onWordsGenerated(generatedWords);
    } catch (error: any) {
      console.error('Error saving words:', error);
      alert(`❌ Error: ${error.message || 'Failed to save words'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] p-6 overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto bg-[#162031] rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">AI Word Generator</h2>
            <p className="text-gray-500">Generate random spelling words using Gemini AI</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white bg-[#0b1221] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Configuration */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-white font-bold mb-3">Difficulty Level</label>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setSelectedDifficulty('ALL')}
                className={`py-3 px-4 rounded-xl font-bold transition-all ${
                  selectedDifficulty === 'ALL'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-[#0b1221] text-gray-400 hover:bg-[#0b1221]/50'
                }`}
              >
                All Levels
              </button>
              <button
                onClick={() => setSelectedDifficulty(Difficulty.EASY)}
                className={`py-3 px-4 rounded-xl font-bold transition-all ${
                  selectedDifficulty === Difficulty.EASY
                    ? 'bg-[#22c55e] text-white'
                    : 'bg-[#0b1221] text-gray-400 hover:bg-[#0b1221]/50'
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setSelectedDifficulty(Difficulty.MEDIUM)}
                className={`py-3 px-4 rounded-xl font-bold transition-all ${
                  selectedDifficulty === Difficulty.MEDIUM
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-[#0b1221] text-gray-400 hover:bg-[#0b1221]/50'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setSelectedDifficulty(Difficulty.HARD)}
                className={`py-3 px-4 rounded-xl font-bold transition-all ${
                  selectedDifficulty === Difficulty.HARD
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#0b1221] text-gray-400 hover:bg-[#0b1221]/50'
                }`}
              >
                Hard
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white font-bold mb-3">
              Words per Level: {wordCount}
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full h-2 bg-[#0b1221] rounded-lg appearance-none cursor-pointer accent-[#00c2a0]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 words</span>
              <span>20 words</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="saveToFirebase"
              checked={saveToFirebase}
              onChange={(e) => setSaveToFirebase(e.target.checked)}
              className="w-5 h-5 accent-[#00c2a0]"
            />
            <label htmlFor="saveToFirebase" className="text-white font-bold">
              Automatically save to Firebase
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#00c2a0] to-[#00d8b3] hover:from-[#00d8b3] hover:to-[#00c2a0] text-white font-bold py-4 rounded-2xl mb-6 flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <span className="text-2xl">🎲</span>
              Generate {selectedDifficulty === 'ALL' ? wordCount * 3 : wordCount} Words
            </>
          )}
        </button>

        {/* Generated Words Preview */}
        {generatedWords.length > 0 && (
          <div className="bg-[#0b1221] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Generated Words ({generatedWords.length})
              </h3>
              {!saveToFirebase && (
                <button
                  onClick={handleSaveToFirebase}
                  disabled={loading}
                  className="bg-[#00c2a0] hover:bg-[#00d8b3] text-white font-bold py-2 px-4 rounded-xl text-sm active:scale-95 transition-all disabled:opacity-50"
                >
                  Save to Firebase
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {generatedWords.map((word) => {
                const difficultyColors = {
                  [Difficulty.EASY]: 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]',
                  [Difficulty.MEDIUM]: 'bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#3b82f6]',
                  [Difficulty.HARD]: 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                };

                return (
                  <div
                    key={word.id}
                    className="bg-[#162031] rounded-xl p-4 border border-white/5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold text-white">{word.term}</h4>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${difficultyColors[word.difficulty]}`}>
                          {word.difficulty}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">{word.category}</span>
                    </div>
                    {word.hint && (
                      <p className="text-gray-400 text-sm italic">💡 {word.hint}</p>
                    )}
                    {word.scenario && (
                      <p className="text-gray-400 text-sm italic">📝 {word.scenario}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <h4 className="text-white font-bold mb-1">How it works</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Uses Gemini AI to generate age-appropriate words</li>
                <li>• Easy: 4-7 letters with helpful hints</li>
                <li>• Medium: 6-9 letters for audio-based learning</li>
                <li>• Hard: 8-15 letters with real-world scenarios</li>
                <li>• Each generation creates unique, random words</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordGenerator;
