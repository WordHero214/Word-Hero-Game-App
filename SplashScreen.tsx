import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after brief delay
    setTimeout(() => setShowContent(true), 100);

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Wait a bit before transitioning
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0b1221] via-[#162031] to-[#0b1221] z-[9999] flex items-center justify-center overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#00c2a0] rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00c2a0] rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {/* Animated Logo Container */}
        <div className="relative mb-8">
          {/* Rotating Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-[#00c2a0] border-t-transparent rounded-full animate-spin-slow" />
          </div>
          
          {/* Logo */}
          <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-[#00c2a0] to-[#00d8b3] rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-500/50 animate-bounce-slow">
            {/* Letter W with gradient */}
            <div className="text-6xl font-black text-white relative">
              W
              {/* Sparkle effects */}
              <div className="absolute -top-2 -right-2 text-yellow-400 text-2xl animate-ping">✨</div>
              <div className="absolute -bottom-2 -left-2 text-yellow-400 text-xl animate-ping" style={{ animationDelay: '0.5s' }}>⭐</div>
            </div>
          </div>

          {/* Orbiting Stars */}
          {[0, 120, 240].map((angle, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2"
              style={{
                animation: 'orbit 3s linear infinite',
                animationDelay: `${i * 1}s`
              }}
            >
              <div className="text-yellow-400 text-xl animate-pulse">⭐</div>
            </div>
          ))}
        </div>

        {/* App Name with Gradient */}
        <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-[#00c2a0] via-[#00d8b3] to-[#00c2a0] bg-clip-text text-transparent animate-gradient">
          Word Hero
        </h1>
        
        {/* Tagline */}
        <p className="text-xl text-gray-400 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Master Words, Become a Hero! 🚀
        </p>

        {/* Loading Bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-[#162031] rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-[#00c2a0] to-[#00d8b3] rounded-full transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="text-sm text-gray-500 animate-pulse">Loading amazing content... {progress}%</p>
        </div>

        {/* Fun Loading Messages */}
        <div className="mt-6 h-6">
          {progress < 30 && <p className="text-xs text-gray-600 animate-fade-in">🎮 Preparing your adventure...</p>}
          {progress >= 30 && progress < 60 && <p className="text-xs text-gray-600 animate-fade-in">📚 Loading word challenges...</p>}
          {progress >= 60 && progress < 90 && <p className="text-xs text-gray-600 animate-fade-in">✨ Polishing sparkies...</p>}
          {progress >= 90 && <p className="text-xs text-gray-600 animate-fade-in">🎉 Almost ready!</p>}
        </div>
      </div>

      {/* Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none">
        {['📚', '✏️', '🎯', '⭐', '🏆', '🎓'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10 animate-float-slow"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
