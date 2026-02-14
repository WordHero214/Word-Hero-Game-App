import React, { useEffect, useState } from 'react';

interface Milestone {
  type: 'certificate' | 'badge' | 'achievement' | 'streak' | 'level';
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface MilestoneCelebrationProps {
  milestone: Milestone;
  onClose: () => void;
}

const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({ milestone, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setShow(true), 100);
    
    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center p-6 transition-all duration-300 ${
        show ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={onClose}
    >
      {/* Confetti Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {['🎉', '✨', '⭐', '🌟', '💫', '🎊'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      {/* Milestone Card */}
      <div 
        className={`relative bg-[#162031] rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl border-4 transition-all duration-500 ${
          show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
        style={{ borderColor: milestone.color }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effect */}
        <div 
          className="absolute inset-0 rounded-[3rem] blur-2xl opacity-30 -z-10"
          style={{ backgroundColor: milestone.color }}
        />

        {/* Icon */}
        <div 
          className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center text-6xl shadow-2xl animate-bounce-slow"
          style={{ backgroundColor: `${milestone.color}20` }}
        >
          {milestone.icon}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-3 animate-pulse-slow">
          {milestone.title}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-6">
          {milestone.description}
        </p>

        {/* Badge */}
        <div 
          className="inline-block px-6 py-2 rounded-full text-white font-bold text-sm uppercase tracking-wider"
          style={{ backgroundColor: milestone.color }}
        >
          {milestone.type === 'certificate' && '🏆 Certificate Earned'}
          {milestone.type === 'badge' && '🎖️ Badge Unlocked'}
          {milestone.type === 'achievement' && '⭐ Achievement'}
          {milestone.type === 'streak' && '🔥 Streak Milestone'}
          {milestone.type === 'level' && '📈 Level Up'}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all active:scale-90"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MilestoneCelebration;
