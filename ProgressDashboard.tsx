import React from 'react';
import { User, ProgressHistoryEntry } from './types';

interface ProgressDashboardProps {
  user: User;
  onClose: () => void;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ user, onClose }) => {
  const history = user.progressHistory || [];
  
  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - i * 86400000);
    return date.toISOString().split('T')[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const entry = history.find(h => h.date === date);
    return {
      date,
      label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      sparkies: entry?.sparkiesEarned || 0,
      words: entry?.wordsLearned || 0,
      games: entry?.gamesPlayed || 0
    };
  });

  const maxSparkies = Math.max(...chartData.map(d => d.sparkies), 1);
  const maxWords = Math.max(...chartData.map(d => d.words), 1);

  // Calculate totals for last 7 days
  const weekTotals = chartData.reduce((acc, day) => ({
    sparkies: acc.sparkies + day.sparkies,
    words: acc.words + day.words,
    games: acc.games + day.games
  }), { sparkies: 0, words: 0, games: 0 });

  return (
    <div className="fixed inset-0 bg-[#0b1221] z-[100] p-6 overflow-y-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Progress Dashboard</h2>
        <button 
          onClick={onClose}
          className="text-white bg-[#162031] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90"
        >
          ✕
        </button>
      </div>

      {/* Weekly Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#162031] rounded-2xl p-4 border border-[#f39c12]/20">
          <div className="text-3xl mb-2">✨</div>
          <p className="text-2xl font-bold text-white">{weekTotals.sparkies}</p>
          <p className="text-xs text-gray-500 uppercase font-bold">This Week</p>
        </div>
        <div className="bg-[#162031] rounded-2xl p-4 border border-[#00c2a0]/20">
          <div className="text-3xl mb-2">📚</div>
          <p className="text-2xl font-bold text-white">{weekTotals.words}</p>
          <p className="text-xs text-gray-500 uppercase font-bold">Words Learned</p>
        </div>
        <div className="bg-[#162031] rounded-2xl p-4 border border-blue-500/20">
          <div className="text-3xl mb-2">🎮</div>
          <p className="text-2xl font-bold text-white">{weekTotals.games}</p>
          <p className="text-xs text-gray-500 uppercase font-bold">Games Played</p>
        </div>
      </div>

      {/* Sparkies Chart */}
      <div className="bg-[#162031] rounded-3xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-6">Sparkies Earned (Last 7 Days)</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {chartData.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex-1 w-full flex items-end justify-center">
                <div 
                  className="w-full bg-gradient-to-t from-[#f39c12] to-[#f39c12]/50 rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                  style={{ height: `${(day.sparkies / maxSparkies) * 100}%`, minHeight: day.sparkies > 0 ? '8px' : '0' }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0b1221] px-2 py-1 rounded text-xs font-bold text-[#f39c12] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.sparkies} ✨
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-bold">{day.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Words Learned Chart */}
      <div className="bg-[#162031] rounded-3xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-6">Words Learned (Last 7 Days)</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {chartData.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex-1 w-full flex items-end justify-center">
                <div 
                  className="w-full bg-gradient-to-t from-[#00c2a0] to-[#00c2a0]/50 rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                  style={{ height: `${(day.words / maxWords) * 100}%`, minHeight: day.words > 0 ? '8px' : '0' }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0b1221] px-2 py-1 rounded text-xs font-bold text-[#00c2a0] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.words} words
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-bold">{day.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Stats */}
      <div className="bg-[#162031] rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">All-Time Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0b1221] rounded-2xl p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">Total Sparkies</p>
            <p className="text-3xl font-bold text-[#f39c12]">{user.sparkies || 0}</p>
          </div>
          <div className="bg-[#0b1221] rounded-2xl p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">Total Words</p>
            <p className="text-3xl font-bold text-[#00c2a0]">{user.wordsLearned || 0}</p>
          </div>
          <div className="bg-[#0b1221] rounded-2xl p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">Total Games</p>
            <p className="text-3xl font-bold text-blue-500">{user.totalGames || 0}</p>
          </div>
          <div className="bg-[#0b1221] rounded-2xl p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">Best Streak</p>
            <p className="text-3xl font-bold text-red-500">{user.bestStreak || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
