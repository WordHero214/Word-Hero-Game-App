import React, { useState, useEffect } from 'react';
import { User } from './types';
import { getTopStudentsWithRank } from './firebaseService';

interface LeaderboardViewProps {
  currentUser?: User;
}

// Extended User type with rank for leaderboard display
interface RankedUser extends User {
  rank: number;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUser }) => {
  const [students, setStudents] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'section'>('all');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [filter, currentUser]);

  useEffect(() => {
    // Show confetti if current user is in top 3
    if (students.length > 0 && currentUser) {
      const userRank = students.findIndex(s => s.id === currentUser.id);
      if (userRank >= 0 && userRank < 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [students, currentUser]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const allStudents = await getTopStudentsWithRank(100); // Get more students for filtering
      
      // Filter by section if needed
      let filteredStudents: RankedUser[] = allStudents as RankedUser[];
      if (filter === 'section' && currentUser?.section) {
        const sectionStudents = allStudents.filter(s => s.section === currentUser.section);
        
        // Recalculate ranks for section-filtered students
        filteredStudents = sectionStudents.map((student, index) => ({
          ...student,
          rank: index + 1 // Recalculate rank based on section position
        })) as RankedUser[];
      }
      
      setStudents(filteredStudents.slice(0, 10)); // Show top 10
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-white mb-1">🏆 Leaderboard</h2>
          <p className="text-gray-500">Loading rankings...</p>
        </div>
        <div className="flex justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#162031] border-t-[#00c2a0] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">⭐</div>
          </div>
        </div>
      </div>
    );
  }

  const top3 = students.slice(0, 3);
  const rest = students.slice(3);
  const currentUserRank = students.findIndex(s => s.id === currentUser?.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '⭐', '✨', '🏆', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Header with Trophy Animation */}
      <div className="text-center mb-8">
        <div className="inline-block relative">
          <h2 className="text-4xl font-bold text-white mb-2 animate-in zoom-in duration-500">
            🏆 Leaderboard 🏆
          </h2>
          <div className="absolute -top-4 -right-4 text-3xl animate-bounce">⭐</div>
          <div className="absolute -top-4 -left-4 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</div>
        </div>
        <p className="text-gray-400 text-lg mt-2">
          {filter === 'section' && currentUser?.section 
            ? `🎯 Section ${currentUser.section} Champions` 
            : '🌟 Top Spelling Stars'}
        </p>
      </div>

      {/* Filter Buttons */}
      {currentUser?.section && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all transform hover:scale-105 ${
              filter === 'all' 
                ? 'bg-gradient-to-r from-[#00c2a0] to-[#00d8b3] text-white shadow-lg shadow-teal-500/30' 
                : 'bg-[#162031] text-gray-400 hover:bg-[#1a2638]'
            }`}
          >
            🌍 All Students
          </button>
          <button
            onClick={() => setFilter('section')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all transform hover:scale-105 ${
              filter === 'section' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-[#162031] text-gray-400 hover:bg-[#1a2638]'
            }`}
          >
            🎯 My Section
          </button>
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-[#162031] rounded-[2.5rem] p-12 text-center border border-white/5">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <p className="text-gray-400 text-xl mb-2">No rankings yet!</p>
          <p className="text-gray-600 text-sm">Be the first to play and become a champion! 🏆</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium with Enhanced Animations */}
          {top3.length > 0 && (
            <div className="relative">
              {/* Spotlight Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent rounded-3xl blur-3xl"></div>
              
              <div className="flex items-end justify-center gap-4 pt-20 pb-12 px-2 relative">
                {/* 2nd Place */}
                {top3[1] && (
                  <div className="flex flex-col items-center animate-in slide-in-from-left-8 duration-700" style={{ animationDelay: '0.2s' }}>
                    <div className="relative mb-4">
                      <div className={`w-20 h-20 rounded-full border-4 ${
                        top3[1].id === currentUser?.id 
                          ? 'border-[#00c2a0] ring-4 ring-[#00c2a0]/30 animate-pulse' 
                          : 'border-gray-400'
                      } bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-2xl font-bold shadow-2xl transform hover:scale-110 transition-transform`}>
                        {top3[1].name[0].toUpperCase()}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-bounce">
                        {top3[1].rank}
                      </div>
                      {/* Silver Medal */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-3xl animate-swing">🥈</div>
                    </div>
                    <p className="text-white font-bold text-base truncate max-w-[100px] mb-1">{top3[1].name}</p>
                    {top3[1].section && (
                      <p className="text-gray-400 text-xs mb-2">Section {top3[1].section}</p>
                    )}
                    <div className="bg-gradient-to-r from-[#f39c12] to-orange-500 px-4 py-2 rounded-full mb-4 shadow-lg">
                      <p className="text-white text-sm font-bold">✨ {top3[1].sparkies || 0}</p>
                    </div>
                    <div className="w-28 h-32 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-3xl flex items-center justify-center text-white text-5xl font-bold shadow-2xl transform hover:scale-105 transition-transform">
                      {top3[1].rank}
                    </div>
                  </div>
                )}

                {/* 1st Place - CHAMPION! */}
                {top3[0] && (
                  <div className="flex flex-col items-center animate-in zoom-in duration-700 scale-110">
                    <div className="relative mb-4">
                      {/* Rotating Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full blur-xl animate-spin-slow opacity-50"></div>
                      
                      <div className={`relative w-24 h-24 rounded-full border-4 ${
                        top3[0].id === currentUser?.id 
                          ? 'border-[#00c2a0] ring-8 ring-[#00c2a0]/40 animate-pulse' 
                          : 'border-yellow-400 ring-8 ring-yellow-400/30'
                      } bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-2xl transform hover:scale-110 transition-transform`}>
                        {top3[0].name[0].toUpperCase()}
                      </div>
                      
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg animate-bounce">
                        {top3[0].rank}
                      </div>
                      
                      {/* Crown */}
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-5xl animate-bounce">👑</div>
                      
                      {/* Stars */}
                      <div className="absolute -top-8 -left-8 text-2xl animate-pulse">⭐</div>
                      <div className="absolute -top-8 -right-8 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
                    </div>
                    
                    <p className="text-white font-bold text-lg truncate max-w-[120px] mb-1">{top3[0].name}</p>
                    {top3[0].section && (
                      <p className="text-gray-400 text-xs mb-2">Section {top3[0].section}</p>
                    )}
                    
                    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 px-6 py-2 rounded-full mb-4 shadow-2xl animate-pulse">
                      <p className="text-white text-base font-bold">✨ {top3[0].sparkies || 0}</p>
                    </div>
                    
                    <div className="w-32 h-44 bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400 rounded-t-3xl flex items-center justify-center text-white text-6xl font-bold shadow-2xl relative overflow-hidden transform hover:scale-105 transition-transform">
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      {top3[0].rank}
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                  <div className="flex flex-col items-center animate-in slide-in-from-right-8 duration-700" style={{ animationDelay: '0.2s' }}>
                    <div className="relative mb-4">
                      <div className={`w-20 h-20 rounded-full border-4 ${
                        top3[2].id === currentUser?.id 
                          ? 'border-[#00c2a0] ring-4 ring-[#00c2a0]/30 animate-pulse' 
                          : 'border-orange-400'
                      } bg-gradient-to-br from-orange-300 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-2xl transform hover:scale-110 transition-transform`}>
                        {top3[2].name[0].toUpperCase()}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-bounce">
                        {top3[2].rank}
                      </div>
                      {/* Bronze Medal */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-3xl animate-swing" style={{ animationDelay: '0.3s' }}>🥉</div>
                    </div>
                    <p className="text-white font-bold text-base truncate max-w-[100px] mb-1">{top3[2].name}</p>
                    {top3[2].section && (
                      <p className="text-gray-400 text-xs mb-2">Section {top3[2].section}</p>
                    )}
                    <div className="bg-gradient-to-r from-[#f39c12] to-orange-500 px-4 py-2 rounded-full mb-4 shadow-lg">
                      <p className="text-white text-sm font-bold">✨ {top3[2].sparkies || 0}</p>
                    </div>
                    <div className="w-28 h-28 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-3xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl transform hover:scale-105 transition-transform">
                      {top3[2].rank}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rest of the rankings with staggered animations */}
          {rest.length > 0 && (
            <div className="bg-[#162031] rounded-[2.5rem] p-6 space-y-3 border border-white/5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                <span className="text-2xl">📊</span>
                <h3 className="text-xl font-bold text-white">Top Performers</h3>
              </div>
              
              {rest.map((student, index) => {
                const rank = student.rank;
                const isCurrentUser = student.id === currentUser?.id;
                
                return (
                  <div
                    key={student.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all transform hover:scale-102 animate-in slide-in-from-right-4 ${
                      isCurrentUser 
                        ? 'bg-gradient-to-r from-[#00c2a0]/20 to-[#00c2a0]/10 border-2 border-[#00c2a0] shadow-lg shadow-teal-500/20' 
                        : 'bg-[#0b1221] hover:bg-[#0b1221]/70 border border-white/5'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Rank Badge */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                      isCurrentUser 
                        ? 'bg-gradient-to-br from-[#00c2a0] to-[#00d8b3] text-white' 
                        : 'bg-[#162031] text-gray-400'
                    }`}>
                      {rank}
                    </div>
                    
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transform hover:rotate-12 transition-transform ${
                      isCurrentUser 
                        ? 'bg-gradient-to-br from-[#00c2a0] to-[#00d8b3]' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                    }`}>
                      {student.name[0].toUpperCase()}
                    </div>
                    
                    {/* Student Info */}
                    <div className="flex-1">
                      <p className={`font-bold ${isCurrentUser ? 'text-[#00c2a0]' : 'text-white'}`}>
                        {student.name}
                        {isCurrentUser && <span className="ml-2 text-xs">👈 You!</span>}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {student.section && <span>📍 Section {student.section}</span>}
                        {student.gradeLevel && <span>• Grade {student.gradeLevel}</span>}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <span className="text-[#f39c12] text-lg">✨</span>
                        <p className="text-[#f39c12] font-bold text-lg">{student.sparkies || 0}</p>
                      </div>
                      <p className="text-gray-500 text-xs">{student.wordsLearned || 0} words learned</p>
                    </div>
                    
                    {/* Streak Badge */}
                    {(student.currentStreak || 0) >= 3 && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-2 py-1 flex items-center gap-1">
                        <span className="text-red-500">🔥</span>
                        <span className="text-red-500 font-bold text-xs">{student.currentStreak}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Current User's Rank (if not in top 10) */}
          {currentUser && currentUserRank >= 10 && (
            <div className="bg-gradient-to-r from-[#00c2a0]/20 to-[#00c2a0]/10 border-2 border-[#00c2a0] rounded-[2rem] p-6 shadow-xl animate-in zoom-in duration-500">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold text-white">Your Ranking</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00c2a0] to-[#00d8b3] rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                  {currentUserRank + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">{currentUser.name}</p>
                  <p className="text-gray-400 text-sm">Keep playing to climb higher! 🚀</p>
                </div>
                <div className="text-right">
                  <p className="text-[#f39c12] font-bold text-xl">✨ {currentUser.sparkies || 0}</p>
                  <p className="text-gray-500 text-xs">{currentUser.wordsLearned || 0} words</p>
                </div>
              </div>
            </div>
          )}

          {/* Motivational Message */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-[2rem] p-6 text-center">
            <div className="text-4xl mb-3 animate-bounce">🌟</div>
            <p className="text-white font-bold text-lg mb-2">Keep Learning, Keep Growing!</p>
            <p className="text-gray-400 text-sm">
              Every word you learn brings you closer to the top! 🚀
            </p>
          </div>
        </>
      )}

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes swing {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
        
        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default LeaderboardView;
