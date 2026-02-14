import React, { useState } from 'react';
import { Word } from './types';

interface WordDebuggerProps {
  words: Word[];
  onRefresh: () => void;
}

const WordDebugger: React.FC<WordDebuggerProps> = ({ words, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 bg-purple-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg z-50 hover:bg-purple-600"
      >
        🐛 Debug Words
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 bg-[#162031] border border-white/10 rounded-2xl p-6 shadow-2xl z-50 max-w-md max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">Word Debugger</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-[#0b1221] rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-2">Total Words Loaded</p>
          <p className="text-white text-2xl font-bold">{words.length}</p>
        </div>

        <div className="bg-[#0b1221] rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-2">Words by Difficulty</p>
          <div className="space-y-1 text-sm">
            <p className="text-green-400">Easy: {words.filter(w => w.difficulty === 'EASY').length}</p>
            <p className="text-yellow-400">Medium: {words.filter(w => w.difficulty === 'MEDIUM').length}</p>
            <p className="text-red-400">Hard: {words.filter(w => w.difficulty === 'HARD').length}</p>
          </div>
        </div>

        <div className="bg-[#0b1221] rounded-xl p-4 max-h-40 overflow-y-auto">
          <p className="text-gray-500 text-xs mb-2">Word List</p>
          <div className="space-y-1">
            {words.map(w => (
              <div key={w.id} className="text-white text-xs flex justify-between">
                <span>{w.term}</span>
                <span className="text-gray-500">{w.difficulty}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="w-full bg-[#00c2a0] hover:bg-[#00d8b3] text-white font-bold py-3 rounded-xl transition-all"
        >
          🔄 Refresh Words
        </button>

        <p className="text-gray-500 text-xs text-center">
          Check browser console for detailed logs
        </p>
      </div>
    </div>
  );
};

export default WordDebugger;
