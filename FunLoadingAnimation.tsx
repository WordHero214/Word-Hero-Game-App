import React from 'react';

interface FunLoadingAnimationProps {
  message?: string;
  type?: 'words' | 'game' | 'results' | 'sync';
}

const FunLoadingAnimation: React.FC<FunLoadingAnimationProps> = ({ 
  message,
  type = 'words'
}) => {
  const animations = {
    words: {
      emoji: ['📚', '📖', '✏️', '📝'],
      defaultMessage: 'Getting your words ready...'
    },
    game: {
      emoji: ['🎮', '🎯', '🎲', '🎪'],
      defaultMessage: 'Starting your game...'
    },
    results: {
      emoji: ['📊', '📈', '🏆', '⭐'],
      defaultMessage: 'Calculating your score...'
    },
    sync: {
      emoji: ['🔄', '☁️', '💾', '✨'],
      defaultMessage: 'Syncing your progress...'
    }
  };

  const config = animations[type];
  const displayMessage = message || config.defaultMessage;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      {/* Bouncing Emojis */}
      <div className="flex gap-4">
        {config.emoji.map((emoji, index) => (
          <div
            key={index}
            className="text-6xl animate-bounce"
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: '1s'
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Loading Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-[#162031] rounded-full" />
        <div className="absolute inset-0 border-4 border-[#00c2a0] border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-white font-bold text-xl mb-2">{displayMessage}</p>
        <div className="flex gap-1 justify-center">
          <span className="w-2 h-2 bg-[#00c2a0] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 bg-[#00c2a0] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 bg-[#00c2a0] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* Fun Fact (Optional) */}
      <div className="bg-[#162031] rounded-2xl p-4 max-w-md border border-white/5">
        <p className="text-gray-400 text-sm text-center">
          💡 <span className="text-[#00c2a0] font-bold">Did you know?</span> The average person learns about 1,000 new words per year!
        </p>
      </div>
    </div>
  );
};

export default FunLoadingAnimation;
