import React from 'react';
import { User, Difficulty } from './types';
import { t, Language } from './translations';

interface PostGameEngagementProps {
  user: User;
  language: Language;
  onPlayAgain: (difficulty: Difficulty) => void;
  onReviewWrongWords: () => void;
  onViewLeaderboard: () => void;
  onViewStats: () => void;
}

const PostGameEngagement: React.FC<PostGameEngagementProps> = ({
  user,
  language,
  onPlayAgain,
  onReviewWrongWords,
  onViewLeaderboard,
  onViewStats
}) => {
  const hasWrongWords = (user.wrongWords?.length || 0) > 0;
  
  // Calculate mastery levels
  const easyMastery = user.levelProgress?.[Difficulty.EASY]?.mastery || 0;
  const mediumMastery = user.levelProgress?.[Difficulty.MEDIUM]?.mastery || 0;
  const hardMastery = user.levelProgress?.[Difficulty.HARD]?.mastery || 0;
  
  // Determine what's unlocked
  const mediumUnlocked = easyMastery >= 70;
  const hardUnlocked = mediumMastery >= 70;
  
  // Calculate daily streak
  const currentStreak = user.currentStreak || 0;
  const longestStreak = user.longestStreak || 0;
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {language === 'en' ? '🎉 Great Job!' : '🎉 Magaling!'}
        </h2>
        <p className="text-gray-400">
          {language === 'en' 
            ? 'What would you like to do next?' 
            : 'Ano ang gusto mong gawin?'}
        </p>
      </div>

      {/* Daily Streak Card */}
      {currentStreak > 0 && (
        <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-2xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                {language === 'en' ? 'Daily Streak' : 'Araw-araw na Streak'}
              </p>
              <p className="text-3xl font-bold text-white">{currentStreak} 🔥</p>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'en' 
                  ? `Best: ${longestStreak} days` 
                  : `Pinakamahusay: ${longestStreak} araw`}
              </p>
            </div>
            <div className="text-6xl animate-bounce">🔥</div>
          </div>
          <p className="text-sm text-orange-300 mt-3">
            {language === 'en'
              ? 'Keep playing daily to maintain your streak!'
              : 'Maglaro araw-araw upang mapanatili ang iyong streak!'}
          </p>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Play Again - Easy */}
        <button
          onClick={() => onPlayAgain(Difficulty.EASY)}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-left hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <div className="text-4xl mb-3">🟢</div>
          <p className="text-white font-bold text-lg mb-1">
            {language === 'en' ? 'Easy Mode' : 'Madali'}
          </p>
          <p className="text-green-100 text-sm">
            {easyMastery}% {language === 'en' ? 'Mastery' : 'Husay'}
          </p>
        </button>

        {/* Play Again - Medium */}
        <button
          onClick={() => mediumUnlocked ? onPlayAgain(Difficulty.MEDIUM) : null}
          disabled={!mediumUnlocked}
          className={`rounded-2xl p-6 text-left transition-all shadow-xl ${
            mediumUnlocked
              ? 'bg-gradient-to-br from-yellow-500 to-orange-600 hover:scale-105 active:scale-95'
              : 'bg-gray-700 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="text-4xl mb-3">{mediumUnlocked ? '🟡' : '🔒'}</div>
          <p className="text-white font-bold text-lg mb-1">
            {language === 'en' ? 'Medium Mode' : 'Katamtaman'}
          </p>
          {mediumUnlocked ? (
            <p className="text-yellow-100 text-sm">
              {mediumMastery}% {language === 'en' ? 'Mastery' : 'Husay'}
            </p>
          ) : (
            <p className="text-gray-400 text-xs">
              {language === 'en' 
                ? `Need ${70 - easyMastery}% more in Easy` 
                : `Kailangan ${70 - easyMastery}% pa sa Madali`}
            </p>
          )}
        </button>

        {/* Play Again - Hard */}
        <button
          onClick={() => hardUnlocked ? onPlayAgain(Difficulty.HARD) : null}
          disabled={!hardUnlocked}
          className={`rounded-2xl p-6 text-left transition-all shadow-xl ${
            hardUnlocked
              ? 'bg-gradient-to-br from-red-500 to-pink-600 hover:scale-105 active:scale-95'
              : 'bg-gray-700 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="text-4xl mb-3">{hardUnlocked ? '🔴' : '🔒'}</div>
          <p className="text-white font-bold text-lg mb-1">
            {language === 'en' ? 'Hard Mode' : 'Mahirap'}
          </p>
          {hardUnlocked ? (
            <p className="text-red-100 text-sm">
              {hardMastery}% {language === 'en' ? 'Mastery' : 'Husay'}
            </p>
          ) : (
            <p className="text-gray-400 text-xs">
              {language === 'en' 
                ? `Need ${70 - mediumMastery}% more in Medium` 
                : `Kailangan ${70 - mediumMastery}% pa sa Katamtaman`}
            </p>
          )}
        </button>

        {/* Review Wrong Words */}
        {hasWrongWords && (
          <button
            onClick={onReviewWrongWords}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-left hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <div className="text-4xl mb-3">📝</div>
            <p className="text-white font-bold text-lg mb-1">
              {language === 'en' ? 'Review' : 'Repasuhin'}
            </p>
            <p className="text-purple-100 text-sm">
              {user.wrongWords?.length} {language === 'en' ? 'words' : 'salita'}
            </p>
          </button>
        )}
      </div>

      {/* Secondary Actions */}
      <div className="space-y-3">
        {/* View Leaderboard */}
        <button
          onClick={onViewLeaderboard}
          className="w-full bg-[#0b1221] border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between hover:bg-[#162031] active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏆</div>
            <div className="text-left">
              <p className="text-white font-bold">
                {language === 'en' ? 'View Leaderboard' : 'Tingnan ang Ranking'}
              </p>
              <p className="text-gray-400 text-sm">
                {language === 'en' ? 'See how you rank!' : 'Tingnan ang iyong ranggo!'}
              </p>
            </div>
          </div>
          <div className="text-gray-400">→</div>
        </button>

        {/* View Stats */}
        <button
          onClick={onViewStats}
          className="w-full bg-[#0b1221] border border-green-500/30 rounded-2xl p-4 flex items-center justify-between hover:bg-[#162031] active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">📊</div>
            <div className="text-left">
              <p className="text-white font-bold">
                {language === 'en' ? 'View Progress' : 'Tingnan ang Progreso'}
              </p>
              <p className="text-gray-400 text-sm">
                {language === 'en' ? 'Track your improvement' : 'Subaybayan ang iyong pag-unlad'}
              </p>
            </div>
          </div>
          <div className="text-gray-400">→</div>
        </button>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 text-center">
        <p className="text-2xl mb-2">✨</p>
        <p className="text-white font-bold mb-2">
          {language === 'en' ? 'Keep Learning!' : 'Magpatuloy sa Pag-aaral!'}
        </p>
        <p className="text-gray-400 text-sm">
          {language === 'en'
            ? 'Every word you learn makes you smarter. Play again to improve your score!'
            : 'Bawat salitang natutunan mo ay nagpapatalino sa iyo. Maglaro muli upang mapabuti ang iyong iskor!'}
        </p>
      </div>

      {/* Progress to Next Level */}
      {!mediumUnlocked && easyMastery > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">🎯</div>
            <div>
              <p className="text-white font-bold text-sm">
                {language === 'en' ? 'Unlock Medium Mode' : 'I-unlock ang Katamtaman'}
              </p>
              <p className="text-gray-400 text-xs">
                {language === 'en' 
                  ? `${70 - easyMastery}% more to unlock` 
                  : `${70 - easyMastery}% pa upang ma-unlock`}
              </p>
            </div>
          </div>
          <div className="w-full bg-[#0b1221] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
              style={{ width: `${(easyMastery / 70) * 100}%` }}
            />
          </div>
        </div>
      )}

      {!hardUnlocked && mediumUnlocked && mediumMastery > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">🎯</div>
            <div>
              <p className="text-white font-bold text-sm">
                {language === 'en' ? 'Unlock Hard Mode' : 'I-unlock ang Mahirap'}
              </p>
              <p className="text-gray-400 text-xs">
                {language === 'en' 
                  ? `${70 - mediumMastery}% more to unlock` 
                  : `${70 - mediumMastery}% pa upang ma-unlock`}
              </p>
            </div>
          </div>
          <div className="w-full bg-[#0b1221] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(mediumMastery / 70) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostGameEngagement;
