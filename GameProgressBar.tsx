import React, { useState } from 'react';

interface GameProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  correctCount: number;
  streak: number;
}

const GameProgressBar: React.FC<GameProgressBarProps> = ({
  currentQuestion,
  totalQuestions,
  correctCount,
  streak
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const progress = (currentQuestion / totalQuestions) * 100;
  const accuracy = currentQuestion > 0 ? (correctCount / currentQuestion) * 100 : 0;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
      <div className="bg-[#162031] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        {/* Collapsed View - Always Visible */}
        <div 
          className="flex justify-between items-center p-3 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <div className="text-white font-bold text-sm">
              Q {currentQuestion}/{totalQuestions}
            </div>
            {/* Mini Progress Bar */}
            <div className="w-24 h-2 bg-[#0b1221] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00c2a0] to-[#00d8b3] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white font-bold text-xs">{Math.round(progress)}%</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak Badge */}
            {streak >= 3 && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-2 py-1 flex items-center gap-1">
                <span className="text-base">🔥</span>
                <span className="text-red-400 font-bold text-xs">{streak}</span>
              </div>
            )}
            
            {/* Expand/Collapse Button */}
            <button className="text-gray-400 hover:text-white transition-colors">
              {isExpanded ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {/* Expanded View - Collapsible */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top duration-200">
            {/* Full Progress Bar */}
            <div className="relative h-3 bg-[#0b1221] rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00c2a0] to-[#00d8b3] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
              
              {/* Milestone Markers */}
              {[25, 50, 75].map((milestone) => (
                <div
                  key={milestone}
                  className={`absolute top-0 bottom-0 w-0.5 ${
                    progress >= milestone ? 'bg-white/50' : 'bg-white/10'
                  }`}
                  style={{ left: `${milestone}%` }}
                />
              ))}
            </div>

            {/* Stats Row */}
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-green-400">✓</span>
                <span className="text-white font-bold">{correctCount}</span>
                <span className="text-gray-400">correct</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-400">📊</span>
                <span className="text-white font-bold">{Math.round(accuracy)}%</span>
                <span className="text-gray-400">accuracy</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400">{totalQuestions - currentQuestion} remaining</span>
              </div>
            </div>

            {/* Encouragement Messages - Only at 70%+ */}
            {progress >= 70 && progress < 100 && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💪</span>
                  <span className="text-purple-300 font-bold text-xs">
                    Almost there! You're doing great!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameProgressBar;
