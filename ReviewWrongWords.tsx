import React, { useState, useMemo } from 'react';
import { Word, Difficulty } from './types';
import { speakWord } from './geminiService';

interface ReviewWrongWordsProps {
  wrongWordIds: string[];
  allWords: Word[];
  onClose: () => void;
  onStartPractice: (words: Word[]) => void;
}

const ReviewWrongWords: React.FC<ReviewWrongWordsProps> = ({ 
  wrongWordIds, 
  allWords, 
  onClose,
  onStartPractice 
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');

  const wrongWords = useMemo(() => {
    return allWords.filter(w => wrongWordIds.includes(w.id));
  }, [wrongWordIds, allWords]);

  const filteredWords = useMemo(() => {
    if (selectedDifficulty === 'ALL') return wrongWords;
    return wrongWords.filter(w => w.difficulty === selectedDifficulty);
  }, [wrongWords, selectedDifficulty]);

  const wordsByDifficulty = useMemo(() => {
    return {
      EASY: wrongWords.filter(w => w.difficulty === Difficulty.EASY).length,
      MEDIUM: wrongWords.filter(w => w.difficulty === Difficulty.MEDIUM).length,
      HARD: wrongWords.filter(w => w.difficulty === Difficulty.HARD).length
    };
  }, [wrongWords]);

  if (wrongWords.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#0b1221] z-[100] p-6 overflow-y-auto animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Review Mistakes</h2>
          <button 
            onClick={onClose}
            className="text-white bg-[#162031] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90"
          >
            ✕
          </button>
        </div>
        <div className="bg-[#162031] rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-2">Perfect Record!</h3>
          <p className="text-gray-500">You haven't made any mistakes yet. Keep up the great work!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0b1221] z-[100] p-6 overflow-y-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Review Mistakes</h2>
          <p className="text-gray-500">{wrongWords.length} words to practice</p>
        </div>
        <button 
          onClick={onClose}
          className="text-white bg-[#162031] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90"
        >
          ✕
        </button>
      </div>

      {/* Difficulty Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[#22c55e]">{wordsByDifficulty.EASY}</p>
          <p className="text-xs text-gray-500 uppercase font-bold">Easy</p>
        </div>
        <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[#3b82f6]">{wordsByDifficulty.MEDIUM}</p>
          <p className="text-xs text-gray-500 uppercase font-bold">Medium</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{wordsByDifficulty.HARD}</p>
          <p className="text-xs text-gray-500 uppercase font-bold">Hard</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedDifficulty('ALL')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            selectedDifficulty === 'ALL' 
              ? 'bg-[#00c2a0] text-white' 
              : 'bg-[#162031] text-gray-400'
          }`}
        >
          All ({wrongWords.length})
        </button>
        <button
          onClick={() => setSelectedDifficulty(Difficulty.EASY)}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            selectedDifficulty === Difficulty.EASY 
              ? 'bg-[#22c55e] text-white' 
              : 'bg-[#162031] text-gray-400'
          }`}
        >
          Easy ({wordsByDifficulty.EASY})
        </button>
        <button
          onClick={() => setSelectedDifficulty(Difficulty.MEDIUM)}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            selectedDifficulty === Difficulty.MEDIUM 
              ? 'bg-[#3b82f6] text-white' 
              : 'bg-[#162031] text-gray-400'
          }`}
        >
          Medium ({wordsByDifficulty.MEDIUM})
        </button>
        <button
          onClick={() => setSelectedDifficulty(Difficulty.HARD)}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            selectedDifficulty === Difficulty.HARD 
              ? 'bg-orange-500 text-white' 
              : 'bg-[#162031] text-gray-400'
          }`}
        >
          Hard ({wordsByDifficulty.HARD})
        </button>
      </div>

      {/* Practice Button */}
      {filteredWords.length > 0 && (
        <button
          onClick={() => onStartPractice(filteredWords)}
          className="w-full bg-[#00c2a0] hover:bg-[#00d8b3] text-white font-bold py-4 rounded-2xl mb-6 flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <span className="text-2xl">🎯</span>
          Practice {filteredWords.length} Word{filteredWords.length !== 1 ? 's' : ''}
        </button>
      )}

      {/* Word List */}
      <div className="space-y-3">
        {filteredWords.map(word => {
          const difficultyColors = {
            [Difficulty.EASY]: 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]',
            [Difficulty.MEDIUM]: 'bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#3b82f6]',
            [Difficulty.HARD]: 'bg-orange-500/10 border-orange-500/20 text-orange-500'
          };

          return (
            <div 
              key={word.id}
              className="bg-[#162031] rounded-2xl p-4 border border-white/5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{word.term}</h3>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${difficultyColors[word.difficulty]}`}>
                      {word.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{word.category}</p>
                </div>
                {word.difficulty === Difficulty.MEDIUM && (
                  <button
                    onClick={() => speakWord(word.term)}
                    className="bg-[#3b82f6]/20 w-10 h-10 rounded-xl flex items-center justify-center text-lg active:scale-90 transition-all"
                  >
                    🔊
                  </button>
                )}
              </div>
              {word.hint && (
                <div className="bg-[#0b1221] rounded-xl p-3 text-sm text-gray-400 italic">
                  💡 {word.hint}
                </div>
              )}
              {word.scenario && (
                <div className="bg-[#0b1221] rounded-xl p-3 text-sm text-gray-400 italic">
                  📝 {word.scenario}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewWrongWords;
