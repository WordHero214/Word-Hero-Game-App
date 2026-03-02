import React, { useEffect, useState } from 'react';

interface FeedbackAnimationProps {
  type: 'correct' | 'wrong' | 'streak' | 'complete';
  show: boolean;
  onComplete?: () => void;
  streakCount?: number;
}

const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({ 
  type, 
  show, 
  onComplete,
  streakCount = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimationKey(prev => prev + 1); // Force re-render of animations
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 1000); // Reduced to 1 second for faster feedback
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, onComplete]);

  // Don't render anything if not visible
  if (!isVisible) return null;

  const animations = {
    correct: {
      emoji: '🎉',
      text: 'Correct!',
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      particles: ['✨', '⭐', '🌟', '💫']
    },
    wrong: {
      emoji: '💪',
      text: 'Try Again!',
      color: 'text-orange-400',
      bg: 'bg-orange-500/20',
      particles: ['💭', '🤔']
    },
    streak: {
      emoji: '🔥',
      text: `${streakCount} in a row!`,
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      particles: ['🔥', '⚡', '💥', '✨']
    },
    complete: {
      emoji: '🏆',
      text: 'Amazing!',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      particles: ['🎊', '🎉', '✨', '⭐', '🌟']
    }
  };

  const config = animations[type];

  return (
    <div 
      key={animationKey}
      className="fixed inset-0 pointer-events-none flex items-center justify-center z-[200]"
      style={{ animation: 'fadeOut 1s forwards' }}
    >
      {/* Main Animation */}
      <div className={`${config.bg} rounded-3xl p-6 backdrop-blur-sm`} style={{ animation: 'zoomIn 0.3s ease-out' }}>
        <div className="text-center">
          <div className="text-7xl mb-2" style={{ animation: 'bounce 0.5s ease-in-out' }}>
            {config.emoji}
          </div>
          <div className={`text-3xl font-bold ${config.color}`}>
            {config.text}
          </div>
        </div>
      </div>

      {/* Floating Particles - Reduced count */}
      {config.particles.slice(0, 3).map((particle, index) => (
        <div
          key={`${animationKey}-particle-${index}`}
          className="absolute text-4xl"
          style={{
            left: `${30 + index * 20}%`,
            top: `${20 + (index % 2) * 30}%`,
            animation: `floatUp 1s ease-out forwards`,
            animationDelay: `${index * 0.1}s`
          }}
        >
          {particle}
        </div>
      ))}

      {/* Confetti Effect for Correct/Complete - Reduced count and faster */}
      {(type === 'correct' || type === 'complete') && (
        <>
          {[...Array(12)].map((_, i) => (
            <div
              key={`${animationKey}-confetti-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                backgroundColor: ['#f39c12', '#00c2a0', '#3b82f6', '#ef4444', '#8b5cf6'][i % 5],
                animation: `confettiFall 1s ease-out forwards`,
                animationDelay: `${i * 0.03}s`
              }}
            />
          ))}
        </>
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes zoomIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes floatUp {
          0% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(-50px) rotate(180deg); 
            opacity: 0; 
          }
        }
        
        @keyframes confettiFall {
          0% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(100vh) rotate(720deg); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
};

export default FeedbackAnimation;
