import React, { useEffect, useState } from 'react';
import { calculateStudentRank } from './firebaseService';

interface RankDisplayProps {
  userId: string;
  sparkies: number;
}

const RankDisplay: React.FC<RankDisplayProps> = ({ userId, sparkies }) => {
  const [rank, setRank] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRank = async () => {
      setLoading(true);
      const rankData = await calculateStudentRank(userId);
      setRank(rankData.rank);
      setTotalStudents(rankData.totalStudents);
      setLoading(false);
    };

    fetchRank();
  }, [userId, sparkies]); // Recalculate when sparkies change

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-4 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-24 mb-2"></div>
        <div className="h-8 bg-white/10 rounded w-16"></div>
      </div>
    );
  }

  if (rank === 0) {
    return null; // Don't show if rank couldn't be calculated
  }

  // Determine rank badge color and icon
  const getRankStyle = () => {
    if (rank === 1) {
      return {
        gradient: 'from-yellow-400 to-yellow-600',
        icon: '🥇',
        text: '1st Place',
        glow: 'shadow-yellow-500/50'
      };
    } else if (rank === 2) {
      return {
        gradient: 'from-gray-300 to-gray-500',
        icon: '🥈',
        text: '2nd Place',
        glow: 'shadow-gray-500/50'
      };
    } else if (rank === 3) {
      return {
        gradient: 'from-orange-400 to-orange-600',
        icon: '🥉',
        text: '3rd Place',
        glow: 'shadow-orange-500/50'
      };
    } else if (rank <= 10) {
      return {
        gradient: 'from-blue-400 to-blue-600',
        icon: '⭐',
        text: 'Top 10',
        glow: 'shadow-blue-500/50'
      };
    } else {
      return {
        gradient: 'from-purple-400 to-purple-600',
        icon: '📊',
        text: 'Keep Going!',
        glow: 'shadow-purple-500/50'
      };
    }
  };

  const style = getRankStyle();

  return (
    <div className={`bg-gradient-to-r ${style.gradient} rounded-2xl p-4 shadow-xl ${style.glow} transform transition-all hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Your Rank</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">#{rank}</span>
            <span className="text-white/60 text-sm font-medium">of {totalStudents}</span>
          </div>
          <p className="text-white/90 text-xs font-bold mt-1">{style.text}</p>
        </div>
        <div className="text-5xl animate-bounce">
          {style.icon}
        </div>
      </div>
      
      {/* Progress bar showing position */}
      <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-white h-full rounded-full transition-all duration-1000"
          style={{ width: `${Math.max(5, 100 - (rank / totalStudents * 100))}%` }}
        />
      </div>
      
      <p className="text-white/70 text-[10px] font-medium mt-2 text-center">
        {rank === 1 ? '🎉 You\'re #1! Amazing!' : rank <= 3 ? '🔥 So close to the top!' : rank <= 10 ? '💪 Keep climbing!' : '🚀 Keep earning sparkies!'}
      </p>
    </div>
  );
};

export default RankDisplay;
