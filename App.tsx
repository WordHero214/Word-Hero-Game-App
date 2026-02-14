
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, UserRole, Difficulty, Word, GameSession, LevelProgress, Certificate } from './types';
import { COLORS, BADGES, ACHIEVEMENTS, DIFFICULTY_CONFIG } from './constants';
import AuthView from './AuthView';
import TeacherView from './TeacherView';
import AdminView from './AdminView';
import { speakWord } from './geminiService';
import ProfileView from './ProfileView';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { getCurrentUser, updateUserProgress, getWords, signOutUser } from './firebaseService';
import { updateCompletionTime } from './firebaseService';
import { FirebaseStatus } from './FirebaseStatus';
import LeaderboardView from './LeaderboardView';
import ProgressDashboard from './ProgressDashboard';
import ReviewWrongWords from './ReviewWrongWords';
import MilestoneCelebration from './MilestoneCelebration';
import { cacheWordsForOffline } from './offlineSync';
import FeedbackAnimation from './FeedbackAnimation';
import GameProgressBar from './GameProgressBar';
import EnhancedButton from './EnhancedButton';
import LoadingSkeleton from './LoadingSkeleton';
import FunLoadingAnimation from './FunLoadingAnimation';
import { BILINGUAL_WORDS } from './bilingualWords';
import { t, tr, Language } from './translations';
import LanguageSelector from './LanguageSelector';
import RankDisplay from './RankDisplay';

// --- INITIAL DEFAULT WORDS (Practice Mode) ---
const INITIAL_MOCK_WORDS: Word[] = BILINGUAL_WORDS;

// --- UTILS ---
const playSound = (type: 'correct' | 'wrong' | 'complete' | 'streak' | 'click') => {
  const sounds = {
    correct: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
    wrong: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
    complete: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    streak: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    click: '/music/button_sound.wav' // Local button click sound
  };
  const audio = new Audio(sounds[type]);
  audio.volume = type === 'click' ? 0.3 : 0.5;
  // Silently fail for click sounds to avoid console spam
  audio.play().catch((e) => {
    if (type !== 'click') {
      console.warn("Audio playback failed:", e);
    }
  });
};

// Global button click sound handler
const playClickSound = () => {
  playSound('click');
};

// --- COMPONENTS ---

const BottomNav: React.FC<{ activeTab: string; setTab: (t: string) => void; role: UserRole; onStatsClick?: () => void; onReviewClick?: () => void }> = ({ activeTab, setTab, role, onStatsClick, onReviewClick }) => {
  const tabs = role === UserRole.STUDENT ? [
    { id: 'home', label: 'Home', icon: '🏠', gradient: 'from-blue-500 to-cyan-500', color: '#3b82f6' },
    { id: 'play', label: 'Play', icon: '🎮', gradient: 'from-purple-500 to-pink-500', color: '#a855f7' },
    { id: 'rank', label: 'Rank', icon: '🏆', gradient: 'from-yellow-500 to-orange-500', color: '#f59e0b' },
    { id: 'stats', label: 'Stats', icon: '📊', gradient: 'from-green-500 to-emerald-500', color: '#22c55e' },
    { id: 'profile', label: 'Profile', icon: '👤', gradient: 'from-teal-500 to-cyan-500', color: '#14b8a6' }
  ].map(tab => ({ ...tab, action: tab.id === 'stats' ? onStatsClick : tab.id === 'review' ? onReviewClick : () => setTab(tab.id) })) : [
    { id: 'home', label: 'Dashboard', icon: '📈', gradient: 'from-blue-500 to-cyan-500', color: '#3b82f6', action: () => setTab('home') },
    { id: 'rank', label: 'Leaderboard', icon: '🏆', gradient: 'from-yellow-500 to-orange-500', color: '#f59e0b', action: () => setTab('rank') },
    { id: 'profile', label: 'Profile', icon: '👤', gradient: 'from-teal-500 to-cyan-500', color: '#14b8a6', action: () => setTab('profile') }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0b1221] via-[#162031] to-[#162031] border-t border-white/10 px-3 py-4 flex justify-around items-center z-50 shadow-2xl">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={tab.action}
            className={`relative flex flex-col items-center gap-2 transition-all duration-300 transform ${
              isActive ? 'scale-110 -translate-y-2' : 'scale-100 hover:scale-105 active:scale-95'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Glow effect for active tab */}
            {isActive && (
              <div 
                className="absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse"
                style={{ backgroundColor: tab.color }}
              />
            )}
            
            {/* Icon container with gradient */}
            <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isActive 
                ? `bg-gradient-to-br ${tab.gradient} shadow-lg` 
                : 'bg-[#0b1221] border border-white/10'
            }`}>
              {/* Shine effect */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent" />
              )}
              
              {/* Icon */}
              <span className={`text-2xl relative z-10 ${isActive ? 'animate-bounce' : ''}`}>
                {tab.icon}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
              )}
            </div>
            
            {/* Label */}
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 relative z-10 ${
              isActive ? 'text-white' : 'text-gray-500'
            }`}>
              {tab.label}
            </span>
            
            {/* Active underline */}
            {isActive && (
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full animate-pulse"
                style={{ backgroundColor: tab.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

const DashboardView: React.FC<{ user: User; onStart: () => void }> = ({ user, onStart }) => {
  // Calculate streak status
  const today = new Date().toISOString().split('T')[0];
  const lastPlayed = user.lastPlayedDate || '';
  const isPlayedToday = lastPlayed === today;
  const currentStreak = user.currentStreak || 0;
  const streakBonus = currentStreak >= 3 ? '2x Sparkies!' : '';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Student Rank Display - HIGHLIGHTED AT TOP */}
      <RankDisplay userId={user.id} sparkies={user.sparkies || 0} />
      
      {/* Daily Streak Banner */}
      {currentStreak > 0 && (
        <div className={`rounded-[2rem] p-6 relative overflow-hidden ${
          isPlayedToday ? 'bg-gradient-to-r from-[#00c2a0] to-[#00d8b3]' : 'bg-gradient-to-r from-orange-500 to-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">🔥</span>
                <h3 className="text-2xl font-bold text-white">{currentStreak} Day Streak!</h3>
              </div>
              <p className="text-white/80 text-sm">
                {isPlayedToday 
                  ? `Great job! Come back tomorrow to keep it going!` 
                  : `Play today to continue your streak!`}
              </p>
              {streakBonus && (
                <p className="text-yellow-300 text-xs font-bold mt-1">⚡ {streakBonus}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs uppercase font-bold">Longest</p>
              <p className="text-white text-2xl font-bold">{user.longestStreak || 0}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#00c2a0] rounded-[2.5rem] p-8 relative overflow-hidden text-white shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00d8b3]/20 to-transparent animate-pulse" />
        
        <div className="absolute top-6 right-6 bg-[#0c1322]/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10 animate-bounce">
          <span className="text-[#f39c12] text-xl">✨</span>
          <span className="font-bold text-lg">{user.sparkies || 0}</span>
        </div>
        
        <div className="relative z-10">
          <p className="text-white/80 font-medium mb-1">Welcome back,</p>
          <h2 className="text-4xl font-bold mb-2">{user.name}</h2>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-8">
            {user.gradeLevel ? `Grade ${user.gradeLevel}` : ''} {user.section ? `• Section ${user.section}` : ''}
          </p>
          
          <div className="flex justify-between items-center px-2">
            <div className="text-center transform transition-transform hover:scale-110">
              <p className="text-2xl font-bold">{user.totalGames || 0}</p>
              <p className="text-[10px] uppercase font-bold text-white/60">Games</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center transform transition-transform hover:scale-110">
              <p className="text-2xl font-bold">{user.wordsLearned || 0}</p>
              <p className="text-[10px] uppercase font-bold text-white/60">Words</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center transform transition-transform hover:scale-110">
              <p className="text-2xl font-bold">100%</p>
              <p className="text-[10px] uppercase font-bold text-white/60">Mastery</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center transform transition-transform hover:scale-110">
              <p className="text-2xl font-bold">{user.badges?.length || 0}</p>
              <p className="text-[10px] uppercase font-bold text-white/60">Badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grade-Appropriate Words Indicator */}
      {user.gradeLevel && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
              📚
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg mb-1">
                Grade {user.gradeLevel} Words
              </h4>
              <p className="text-gray-400 text-sm">
                You're getting words specially selected for Grade {user.gradeLevel} students. 
                Each difficulty level is designed to match your learning level!
              </p>
            </div>
            <div className="text-center px-4 py-2 bg-blue-500/20 rounded-xl">
              <p className="text-blue-400 text-xs font-bold uppercase">Your Level</p>
              <p className="text-white text-2xl font-bold">{user.gradeLevel}</p>
            </div>
          </div>
        </div>
      )}

      <EnhancedButton
        onClick={onStart}
        variant="warning"
        size="large"
        icon="▶"
        fullWidth
        className="animate-pulse"
      >
        Start Playing
      </EnhancedButton>

      <section className="animate-in slide-in-from-bottom-4 duration-700">
        <h3 className="text-2xl font-bold mb-4 text-white">Mastery Progress</h3>
        <div className="bg-[#162031] rounded-[2rem] p-8 space-y-6 shadow-md transform transition-all hover:shadow-xl">
          {user.levelProgress && (Object.values(user.levelProgress) as LevelProgress[]).map((p, index) => (
            <div key={p.difficulty} className="flex items-center gap-4 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100}ms` }}>
              <span className="w-20 text-sm font-bold text-gray-400 capitalize">{p.difficulty.toLowerCase()}</span>
              <div className="flex-1 h-2 bg-[#0b1221] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${p.mastery > 0 ? 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] animate-pulse' : 'bg-[#1e293b]'}`}
                  style={{ width: `${p.mastery}%` }}
                />
              </div>
              <span className={`w-12 text-right text-sm font-bold ${p.mastery > 0 ? 'text-[#22c55e]' : 'text-gray-600'}`}>
                {p.mastery}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const PlayView: React.FC<{ 
  user: User; 
  onLevelSelect: (d: Difficulty, isPractice?: boolean) => void; 
  onQuickPlay: () => void; 
  isPracticeMode?: boolean 
}> = ({ user, onLevelSelect, onQuickPlay, isPracticeMode = false }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-1">Choose Level</h2>
      <p className="text-gray-500">Master each level to unlock the next</p>
    </div>

    {/* Practice Mode Indicator */}
    {isPracticeMode && (
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 rounded-2xl p-4 animate-in slide-in-from-top duration-500">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📚</div>
          <div className="flex-1">
            <h4 className="text-white font-bold mb-1">Practice Mode</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              You're using default practice words. Your teacher can add custom words for your grade level in the Word Bank.
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Quick Play Button */}
    <button
      onClick={onQuickPlay}
      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-[2rem] p-6 shadow-xl transition-all active:scale-95 flex items-center justify-between transform hover:scale-105 animate-in slide-in-from-top duration-500"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl animate-bounce">⚡</div>
        <div className="text-left">
          <h3 className="text-xl font-bold text-white">Quick Play</h3>
          <p className="text-white/70 text-sm">5 random words • Fast practice</p>
        </div>
      </div>
      <div className="text-white text-2xl animate-pulse">→</div>
    </button>

    {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(difficulty => {
      const config = DIFFICULTY_CONFIG[difficulty];
      const progress = user.levelProgress?.[difficulty];
      
      // Determine if level is locked
      let isLocked = false;
      let lockMessage = '';
      
      if (difficulty === Difficulty.MEDIUM) {
        const easyMastery = user.levelProgress?.[Difficulty.EASY]?.mastery || 0;
        isLocked = easyMastery < 85;
        lockMessage = 'Score 85%+ in Easy Mode to unlock';
      } else if (difficulty === Difficulty.HARD) {
        const mediumMastery = user.levelProgress?.[Difficulty.MEDIUM]?.mastery || 0;
        isLocked = mediumMastery < 85;
        lockMessage = 'Score 85%+ in Medium Mode to unlock';
      }

      return (
        <div 
          key={difficulty}
          className={`relative overflow-hidden rounded-[2.5rem] p-8 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
            isLocked ? 'bg-[#121c29] opacity-40' : 'animate-in slide-in-from-bottom-4'
          }`}
          style={{ 
            backgroundColor: isLocked ? '#121c29' : config.color,
            animationDelay: `${Object.keys(DIFFICULTY_CONFIG).indexOf(difficulty) * 100}ms`
          }}
        >
          {/* Animated shine effect */}
          {!isLocked && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" 
                 style={{ animation: 'shimmer 3s infinite' }} />
          )}
          
          <div className="flex items-start justify-between mb-6 relative z-10">
            <div className="flex gap-6 items-center">
              <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl transform transition-transform hover:rotate-12 hover:scale-110">
                {isLocked ? '🔒' : config.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{config.label}</h3>
                <p className="text-white/70 text-sm max-w-[200px] leading-tight">{config.sub}</p>
              </div>
            </div>
            {!isLocked && (
              <div className="bg-black/20 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-white/10 animate-pulse">
                <span className="text-[#f39c12]">✨</span>
                <span className="text-white font-bold">+{config.reward}</span>
              </div>
            )}
          </div>

          {isLocked ? (
            <div className="flex items-center gap-2 text-xs text-white/40 italic">
              <span>ℹ️ {lockMessage}</span>
            </div>
          ) : progress ? (
            <div>
              <div className="w-full h-2 bg-black/20 rounded-full mb-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-white via-white/80 to-white rounded-full transition-all duration-1000 animate-pulse" 
                  style={{ width: `${progress.mastery}%` }} 
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-white uppercase tracking-wider mb-4">
                <span>{progress.gamesPlayed} games played</span>
                <span>{progress.mastery}%</span>
              </div>
              
              {/* Action buttons - Practice only enabled if completed (mastery > 0) */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLevelSelect(difficulty, false);
                  }}
                  className="flex-1 bg-white/20 hover:bg-white/30 py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-95 hover:shadow-lg"
                >
                  Play Again
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (progress.mastery > 0) {
                      onLevelSelect(difficulty, true);
                    }
                  }}
                  disabled={progress.mastery === 0}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border border-white/20 ${
                    progress.mastery > 0 
                      ? 'bg-black/20 hover:bg-black/30 text-white active:scale-95 hover:shadow-lg' 
                      : 'bg-black/10 text-white/30 cursor-not-allowed opacity-50'
                  }`}
                  title={progress.mastery === 0 ? 'Complete this level first to unlock practice mode' : 'Practice without earning sparkies'}
                >
                  🎯 Practice
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-white/60 mb-4">
              <span>Ready to play!</span>
            </div>
          )}
          
          {/* Play button for new levels */}
          {!isLocked && !progress && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLevelSelect(difficulty, false);
              }}
              className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-95 hover:shadow-lg"
            >
              Start Level
            </button>
          )}
        </div>
      );
    })}
  </div>
);

// --- MAIN GAME SCREEN OVERLAY ---
const GameOverlay: React.FC<{ 
  difficulty: Difficulty; 
  onClose: () => void;
  onComplete: (s: GameSession) => void;
  sparkies: number;
  onUpdateSparkies: (n: number) => void;
  gameWords: Word[];
  isQuickPlay?: boolean; // NEW: Flag to indicate Quick Play mode
  isPracticeMode?: boolean; // NEW: Flag to indicate Practice Mode (no sparkies)
  usedWordIds?: Record<Difficulty, string[]>; // NEW: Track used words
  userLanguage?: Language; // NEW: User's language preference
}> = ({ difficulty, onClose, onComplete, sparkies, onUpdateSparkies, gameWords, isQuickPlay = false, isPracticeMode = false, usedWordIds, userLanguage = 'en' as Language }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [sessionSparkies, setSessionSparkies] = useState(0);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [isFeedback, setIsFeedback] = useState<null | 'correct' | 'wrong'>(null);
  const [sessionResults, setSessionResults] = useState<{wordId: string, isCorrect: boolean, attempts: number}[]>([]);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_CONFIG[difficulty].timePerWord);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false); // NEW: Exit confirmation modal
  
  // NEW: Feedback animation state
  const [showFeedbackAnimation, setShowFeedbackAnimation] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | 'streak' | 'complete'>('correct');
  
  // NEW: Time tracking
  const [gameStartTime] = useState(Date.now());
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // NEW: Volume control state
  const [musicVolume, setMusicVolume] = useState(0.15); // Lower default volume (was 0.25)
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  // Use refs to track current values for the completion callback
  const sessionSparkiesRef = useRef(0);
  const sessionResultsRef = useRef<{wordId: string, isCorrect: boolean, attempts: number}[]>([]);
  const maxStreakRef = useRef(0);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const words = useMemo(() => {
    let filteredWords;
    
    // In Quick Play mode, use all provided words without filtering
    if (isQuickPlay) {
      filteredWords = gameWords;
    } else {
      // In regular mode, filter by difficulty
      filteredWords = gameWords.filter(w => w.difficulty === difficulty);
      
      // Get used word IDs for this difficulty
      const usedIds = usedWordIds?.[difficulty] || [];
      
      // Filter out already used words
      const unusedWords = filteredWords.filter(w => !usedIds.includes(w.id));
      
      // If we have enough unused words, use them
      // Otherwise, reset the pool and use all words (this means student completed all words!)
      if (unusedWords.length >= 10) {
        filteredWords = unusedWords;
      } else {
        // Not enough unused words - reset the pool
        console.log(`🔄 Resetting word pool for ${difficulty} - All words completed!`);
        filteredWords = gameWords.filter(w => w.difficulty === difficulty);
        
        // Show a celebration message
        if (unusedWords.length === 0 && usedIds.length > 0) {
          console.log(`🎉 Congratulations! You've completed all ${usedIds.length} ${difficulty} words!`);
        }
      }
    }
    
    // Randomize words
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    
    // Quick Play: 5 words, Regular Game: 10 words
    const wordLimit = isQuickPlay ? 5 : 10;
    return shuffled.slice(0, wordLimit);
  }, [difficulty, gameWords, isQuickPlay, usedWordIds]);
  const currentWord = words[currentIdx];

  useEffect(() => {
    // Energetic, upbeat music during gameplay to keep students motivated
    // Using local music file for reliable playback
    bgMusicRef.current = new Audio('/music/background_music.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = musicVolume; // Use state volume
    bgMusicRef.current.play().catch(() => {});

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update music volume when slider changes
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  // Timer countdown
  useEffect(() => {
    if (isTimeUp || isFeedback) return; // Pause timer during feedback
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsTimeUp(true);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIdx, isTimeUp, isFeedback]);

  const handleTimeUp = () => {
    console.log('⏰ Time is up!');
    playSound('wrong');
    
    // Mark current word as wrong (time expired)
    const newResult = { wordId: currentWord.id, isCorrect: false, attempts: 1 };
    setSessionResults(prev => [...prev, newResult]);
    sessionResultsRef.current = [...sessionResultsRef.current, newResult];
    
    // Show time-up message for 2 seconds, then complete game
    setTimeout(() => {
      handleGameEnd();
    }, 2000);
  };

  const handleGameEnd = () => {
    const finalResults = sessionResultsRef.current;
    const finalSparkies = sessionSparkiesRef.current;
    const finalStreak = maxStreakRef.current;
    
    console.log('🏁 Game ending due to time up');
    console.log('   Results:', finalResults.length);
    console.log('   Sparkies:', finalSparkies);
    
    const timeSpentSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
    
    onComplete({
      difficulty,
      words,
      results: finalResults,
      totalSparkiesEarned: finalSparkies,
      streak: finalStreak,
      timeSpent: timeSpentSeconds
    });
  };

  const handleNext = () => {
    // Clear feedback animation immediately
    setShowFeedbackAnimation(false);
    
    if (currentIdx < words.length - 1) {
      setCurrentIdx(i => i + 1);
      setInput('');
      setIsFeedback(null);
      setRevealedIndices([]);
      setTimeLeft(DIFFICULTY_CONFIG[difficulty].timePerWord); // Reset timer
      setIsTimeUp(false);
    } else {
      playSound('complete');
      
      // Use ref values to get the most current state
      const finalResults = sessionResultsRef.current;
      const finalSparkies = sessionSparkiesRef.current;
      const finalStreak = maxStreakRef.current;
      
      // Log completion details
      console.log('📝 Game completing...');
      console.log('   Total words:', words.length);
      console.log('   Results recorded:', finalResults.length);
      console.log('   Session sparkies:', finalSparkies);
      console.log('   Max streak:', finalStreak);
      
      // Warn if no results (student didn't answer)
      if (finalResults.length === 0) {
        console.warn('⚠️ WARNING: Game completing with no results!');
        console.warn('   Student may have closed game without answering');
      }
      
      const timeSpentSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
      
      onComplete({
        difficulty,
        words,
        results: finalResults,
        totalSparkiesEarned: finalSparkies,
        streak: finalStreak,
        timeSpent: timeSpentSeconds
      });
    }
  };

  const checkAnswer = () => {
    if (!currentWord) return;
    
    console.log('🔍 checkAnswer called');
    console.log('   Input:', input);
    console.log('   Current word:', currentWord.term);
    console.log('   Current results:', sessionResults.length);
    console.log('   Is Practice Mode?', isPracticeMode || isQuickPlay);
    
    const isCorrect = input.trim().toUpperCase() === currentWord.term.toUpperCase();
    
    console.log('   Is correct?', isCorrect);
    
    if (isCorrect) {
      playSound('correct');
      setIsFeedback('correct');
      const newStreak = streak + 1;
      const bonus = newStreak % 2 === 0 ? 5 : 0;
      
      if (bonus > 0) playSound('streak');

      // Show feedback animation
      if (newStreak >= 3) {
        setFeedbackType('streak');
      } else {
        setFeedbackType('correct');
      }
      setShowFeedbackAnimation(true);

      // Only award sparkies if NOT in practice/quick play mode
      const reward = (isPracticeMode || isQuickPlay) ? 0 : DIFFICULTY_CONFIG[difficulty].reward + bonus;
      const newSparkies = sessionSparkies + reward;
      const newResult = { wordId: currentWord.id, isCorrect: true, attempts: 1 };
      
      if (isPracticeMode || isQuickPlay) {
        console.log('   ✅ Correct! (Practice Mode - No sparkies awarded)');
      } else {
        console.log('   ✅ Correct! Adding', reward, 'sparkies');
        console.log('   New total sparkies:', newSparkies);
      }
      
      // Update state
      setSessionSparkies(newSparkies);
      setStreak(newStreak);
      setMaxStreak(m => Math.max(m, newStreak));
      setSessionResults(prev => [...prev, newResult]);
      
      // Update refs immediately for handleNext
      sessionSparkiesRef.current = newSparkies;
      sessionResultsRef.current = [...sessionResultsRef.current, newResult];
      maxStreakRef.current = Math.max(maxStreakRef.current, newStreak);
      
      console.log('   Waiting 1.2s before next word...');
      setTimeout(handleNext, 1200);
    } else {
      playSound('wrong');
      setIsFeedback('wrong');
      setStreak(0);
      
      // Show wrong feedback animation
      setFeedbackType('wrong');
      setShowFeedbackAnimation(true);
      
      const newResult = { wordId: currentWord.id, isCorrect: false, attempts: 1 };
      setSessionResults(prev => [...prev, newResult]);
      
      // Update ref immediately
      sessionResultsRef.current = [...sessionResultsRef.current, newResult];
      
      console.log('   ❌ Wrong! No sparkies. Try again or move on.');
      setTimeout(() => setIsFeedback(null), 1000);
    }
  };

  const useHint = () => {
    if (!currentWord) return;
    const isFree = revealedIndices.length === 0;
    if (!isFree && sparkies < 5) return;
    const available = [...currentWord.term].map((_, i) => i).filter(i => !revealedIndices.includes(i));
    if (available.length === 0) return;
    setRevealedIndices(prev => [...prev, available[Math.floor(Math.random() * available.length)]]);
    if (!isFree) onUpdateSparkies(-5);
  };

  const handleClose = () => {
    // Warn if trying to close without completing
    if (sessionResults.length < words.length) {
      setShowExitModal(true); // Show modal instead of window.confirm
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (difficulty === Difficulty.MEDIUM && currentWord) speakWord(currentWord.term);
  }, [currentIdx, difficulty, currentWord]);

  if (!currentWord) return null;

  // Calculate timer color based on time left
  const timerPercentage = (timeLeft / DIFFICULTY_CONFIG[difficulty].timePerWord) * 100;
  const timerColor = timerPercentage > 50 ? '#22c55e' : timerPercentage > 25 ? '#f39c12' : '#ef4444';

  // Show time-up overlay
  if (isTimeUp) {
    return (
      <div className="fixed inset-0 bg-[#0b1221] z-[100] p-8 flex items-center justify-center animate-in fade-in duration-300">
        <div className="text-center space-y-6 animate-in zoom-in duration-500">
          <div className="text-8xl mb-4">⏰</div>
          <h2 className="text-4xl font-bold text-white mb-4">Time's Up!</h2>
          <p className="text-xl text-gray-400 mb-2">Better luck next time!</p>
          <p className="text-lg text-gray-500">Study more to get higher scores and sparkies ✨</p>
          <div className="mt-8 text-gray-600">
            <p>You earned: <span className="text-[#f39c12] font-bold">{sessionSparkiesRef.current} sparkies</span></p>
            <p>Words completed: <span className="text-white font-bold">{sessionResultsRef.current.length}/{words.length}</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0b1221] z-[100] flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* Feedback Animation */}
      <FeedbackAnimation
        type={feedbackType}
        show={showFeedbackAnimation}
        onComplete={() => setShowFeedbackAnimation(false)}
        streakCount={streak}
      />
      
      {/* Floating Progress Bar - Now independent */}
      <GameProgressBar
        currentQuestion={currentIdx + 1}
        totalQuestions={words.length}
        correctCount={sessionResults.filter(r => r.isCorrect).length}
        streak={streak}
      />
      
      {/* Top Bar with Close and Timer - Compact */}
      <div className="flex justify-between items-center p-4 pt-20">
        <button onClick={handleClose} className="text-white bg-[#162031] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg active:scale-90 btn-hover text-xl">✕</button>
        
        {/* Volume Control Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowVolumeControl(!showVolumeControl);
            }}
            className="text-white bg-[#162031] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg active:scale-90 btn-hover text-lg"
            title="Music Volume"
          >
            {musicVolume === 0 ? '🔇' : musicVolume < 0.3 ? '🔉' : '🔊'}
          </button>
          
          {/* Volume Slider Popup */}
          {showVolumeControl && (
            <div 
              className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#162031] rounded-2xl p-4 shadow-2xl border border-white/10 z-[200] animate-in slide-in-from-top-2 duration-200 min-w-[200px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">Music Volume</span>
                  <span className="text-[#00c2a0] text-xs font-bold">{Math.round(musicVolume * 100)}%</span>
                </div>
                
                {/* Volume Slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume * 100}
                  onChange={(e) => {
                    e.stopPropagation();
                    setMusicVolume(Number(e.target.value) / 100);
                  }}
                  className="w-full h-2 bg-[#0b1221] rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #00c2a0 0%, #00c2a0 ${musicVolume * 100}%, #0b1221 ${musicVolume * 100}%, #0b1221 100%)`
                  }}
                />
                
                {/* Quick Presets */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMusicVolume(0);
                    }}
                    className="flex-1 bg-[#0b1221] hover:bg-[#0b1221]/70 text-white text-xs py-2 rounded-lg transition-all active:scale-95"
                  >
                    🔇 Off
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMusicVolume(0.15);
                    }}
                    className="flex-1 bg-[#0b1221] hover:bg-[#0b1221]/70 text-white text-xs py-2 rounded-lg transition-all active:scale-95"
                  >
                    🔉 Low
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMusicVolume(0.5);
                    }}
                    className="flex-1 bg-[#0b1221] hover:bg-[#0b1221]/70 text-white text-xs py-2 rounded-lg transition-all active:scale-95"
                  >
                    🔊 High
                  </button>
                </div>
                
                <p className="text-gray-500 text-[10px] text-center leading-tight">
                  💡 Lower volume helps hear word audio better
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Timer Display - Compact */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#162031] border-2 relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#0b1221" strokeWidth="3" />
                <circle
                  cx="24" cy="24" r="20" fill="none" stroke={timerColor} strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - timerPercentage / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="text-white font-bold text-sm z-10">{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Flexible */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 min-h-0">
        {/* Practice Mode Banner - Compact */}
        {(isPracticeMode || isQuickPlay) && (
          <div className="mb-3 bg-blue-500/20 border border-blue-500/50 rounded-xl p-2 text-center w-full max-w-lg">
            <p className="text-blue-300 font-bold text-xs">🎯 Practice Mode</p>
          </div>
        )}

        {/* Content based on difficulty - Optimized spacing */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl space-y-4">
          {difficulty === Difficulty.EASY && (
            <>
              <div className="bg-[#162031] p-4 rounded-2xl border border-[#00c2a0]/20 shadow-xl w-full">
                <span className="text-[#00c2a0] text-[9px] font-black uppercase tracking-wider block mb-1">
                  {t('wordClue', userLanguage)}
                </span>
                <p className="text-base text-white font-medium leading-snug italic">
                  "{userLanguage === 'fil' && currentWord.hintFil 
                    ? currentWord.hintFil 
                    : (currentWord.hint || currentWord.scenario || 'Can you spell this word?')}"
                </p>
              </div>
              
              <h2 className="text-3xl font-bold tracking-wider text-white mt-4">
                {isFeedback === 'correct' 
                  ? currentWord.term.split('').join(' ')
                  : currentWord.term.split('').map((char, i) => revealedIndices.includes(i) ? char : '_').join(' ')
                }
              </h2>
              <button onClick={useHint} className="bg-white/5 px-4 py-2 rounded-xl text-[#f39c12] text-sm font-bold border border-white/5 hover:bg-white/10 active:scale-95 transition-all">
                 💡 {t('hint', userLanguage)} {revealedIndices.length > 0 ? t('hintCost', userLanguage) : '(Free!)'}
              </button>
            </>
          )}

          {difficulty === Difficulty.MEDIUM && (
            <>
              <button onClick={() => speakWord(currentWord.term)} className="w-20 h-20 bg-[#00c2a0] rounded-full flex items-center justify-center text-3xl shadow-xl active:scale-90">🔊</button>
              <p className="text-[#00c2a0] font-bold uppercase tracking-widest text-sm">{t('listenAndType', userLanguage)}</p>
            </>
          )}

          {difficulty === Difficulty.HARD && (
            <div className="bg-[#162031] p-6 rounded-2xl border border-orange-500/20 shadow-inner w-full">
              <p className="text-gray-500 uppercase text-[9px] font-bold mb-2 tracking-widest">{t('scenario', userLanguage)}</p>
              <p className="text-lg text-white italic leading-relaxed">
                "{userLanguage === 'fil' && currentWord.scenarioFil 
                  ? currentWord.scenarioFil 
                  : currentWord.scenario}"
              </p>
            </div>
          )}

          {/* Input Field - Compact */}
          <div className="w-full relative">
            {/* Instruction for Filipino users */}
            {userLanguage === 'fil' && (
              <p className="text-center text-[#00c2a0] text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">
                ⌨️ {t('spellInEnglish', userLanguage)}
              </p>
            )}
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)}
              className="w-full bg-[#162031] rounded-2xl py-4 text-2xl text-center text-white font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#00c2a0] transition-all shadow-inner"
              placeholder="..."
              autoFocus
              onKeyDown={e => e.key === 'Enter' && checkAnswer()}
            />
            {isFeedback && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 animate-in zoom-in duration-300">
                <div className={`font-bold px-6 py-2 rounded-full shadow-xl text-sm ${isFeedback === 'correct' ? 'bg-[#22c55e] text-white' : 'bg-red-500 text-white'}`}>
                  {isFeedback === 'correct' ? 'EXCELLENT! 🌟' : 'TRY AGAIN! 🧩'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Buttons - Compact */}
      <div className="p-4 space-y-2">
        <button 
          onClick={checkAnswer} 
          disabled={isFeedback === 'correct'}
          className="w-full bg-[#00c2a0] py-4 rounded-2xl text-white font-bold text-lg shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Submit Word
        </button>
        
        {isFeedback === 'wrong' && (
          <button 
            onClick={handleNext} 
            className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-2xl text-white font-bold text-lg shadow-xl active:scale-95 animate-in slide-in-from-bottom-4 duration-300"
          >
            {currentIdx < words.length - 1 ? 'Skip to Next →' : 'Finish →'}
          </button>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-[#162031] rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-white/10 animate-in zoom-in duration-300">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-5xl">⚠️</span>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Wait! Are you sure?</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  You have <span className="text-white font-bold">{words.length - sessionResults.length}</span> unanswered word(s).
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {isPracticeMode || isQuickPlay 
                    ? "You're in practice mode, so no progress will be lost." 
                    : "You won't earn any sparkies if you quit now."}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 bg-[#00c2a0] hover:bg-[#00d8b3] py-4 rounded-2xl text-white font-bold text-lg transition-all active:scale-95"
                >
                  Keep Playing
                </button>
                <button
                  onClick={() => {
                    setShowExitModal(false);
                    onClose();
                  }}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 py-4 rounded-2xl text-red-400 font-bold text-lg transition-all active:scale-95"
                >
                  Quit Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [activeGame, setActiveGame] = useState<Difficulty | null>(null);
  const [wordList, setWordList] = useState<Word[]>(INITIAL_MOCK_WORDS);
  const [isPracticeMode, setIsPracticeMode] = useState(false); // Track if using default practice words
  const [loading, setLoading] = useState(true);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [showReviewWords, setShowReviewWords] = useState(false);
  const [isQuickPlay, setIsQuickPlay] = useState(false);
  const [quickPlayWords, setQuickPlayWords] = useState<Word[]>([]);
  const [milestone, setMilestone] = useState<any>(null);
  const [previousBadges, setPreviousBadges] = useState<string[]>([]);
  const [previousCerts, setPreviousCerts] = useState<number>(0);
  const [teacherTab, setTeacherTab] = useState<'dashboard' | 'students' | 'words' | 'analytics'>('dashboard');
  
  // Background music
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.35); // Default volume
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  // Global button click sound effect
  useEffect(() => {
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        playClickSound();
      }
    };
    
    document.addEventListener('click', handleButtonClick);
    return () => document.removeEventListener('click', handleButtonClick);
  }, []);

  // Initialize background music ONLY after successful login
  useEffect(() => {
    // Only initialize music if user is logged in
    if (!user) {
      // Clean up music if user logs out
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      setIsMusicPlaying(false);
      return;
    }

    // User is logged in, initialize background music
    if (!bgMusicRef.current) {
      bgMusicRef.current = new Audio('/music/background_music.mp3');
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = musicVolume; // Use state volume
      
      // Auto-play on user interaction
      const playMusic = () => {
        if (bgMusicRef.current && !isMusicPlaying) {
          bgMusicRef.current.play().then(() => {
            setIsMusicPlaying(true);
          }).catch(() => {
            // Browser blocked autoplay, will try again on next interaction
          });
        }
      };
      
      // Try to play on any user interaction
      document.addEventListener('click', playMusic, { once: true });
      document.addEventListener('keydown', playMusic, { once: true });
      
      return () => {
        document.removeEventListener('click', playMusic);
        document.removeEventListener('keydown', playMusic);
      };
    }
  }, [user, isMusicPlaying, musicVolume]);
  
  // Update music volume when it changes
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = musicVolume;
    }
  }, [musicVolume]);
  
  // Close volume control when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showVolumeControl) {
        const target = e.target as HTMLElement;
        if (!target.closest('.volume-control-container')) {
          setShowVolumeControl(false);
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showVolumeControl]);
  
  const toggleMusic = () => {
    if (bgMusicRef.current) {
      if (isMusicPlaying) {
        bgMusicRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        bgMusicRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(console.error);
      }
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getCurrentUser(firebaseUser);
          if (userData) {
            setUser(userData);
            // Track badges and certs for milestone detection
            setPreviousBadges(userData.badges || []);
            setPreviousCerts(userData.certificates?.length || 0);
            // Reset game state when user changes
            setActiveGame(null);
            setActiveTab('home');
          } else {
            // User document doesn't exist in Firestore
            console.warn("User authenticated but no Firestore document found");
            await signOutUser().catch(() => {});
            setUser(null);
          }
        } catch (error) {
          console.warn("Could not fetch user data from Firebase:", error);
          // If Firebase isn't set up, sign out the user
          await signOutUser().catch(() => {});
          setUser(null);
        }
      } else {
        setUser(null);
        // Clear game state when user logs out
        setActiveGame(null);
        setActiveTab('home');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load words from Firebase with real-time sync
  useEffect(() => {
    if (!user) return;
    
    console.log('🔄 Setting up real-time word sync...');
    
    // Set up real-time listener for words collection
    const wordsQuery = query(collection(db, 'words'));
    
    const unsubscribe = onSnapshot(wordsQuery, async (snapshot) => {
      try {
        const allWords = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Word));
        
        console.log('📡 Real-time update: Received', allWords.length, 'words');
        
        // Filter words based on student's grade level and section
        const gradeLevel = user?.role === UserRole.STUDENT ? user.gradeLevel : undefined;
        const section = user?.role === UserRole.STUDENT ? user.section : undefined;
        
        let words = allWords;
        
        // Apply filtering for students
        if (gradeLevel || section) {
          words = allWords.filter(word => {
            const gradeMatch = !word.gradeLevels || word.gradeLevels.length === 0 || 
                             (gradeLevel && word.gradeLevels.includes(gradeLevel));
            const sectionMatch = !word.sections || word.sections.length === 0 || 
                               (section && word.sections.includes(section));
            return gradeMatch && sectionMatch;
          });
          
          console.log(`📚 Grade Level Filtering Applied:`);
          console.log(`   Student Grade: ${gradeLevel || 'Not set'}`);
          console.log(`   Student Section: ${section || 'Not set'}`);
          console.log(`   Total words in database: ${allWords.length}`);
          console.log(`   Words available for this student: ${words.length}`);
          
          // Log breakdown by difficulty
          const easyCount = words.filter(w => w.difficulty === Difficulty.EASY).length;
          const mediumCount = words.filter(w => w.difficulty === Difficulty.MEDIUM).length;
          const hardCount = words.filter(w => w.difficulty === Difficulty.HARD).length;
          console.log(`   Breakdown: ${easyCount} Easy, ${mediumCount} Medium, ${hardCount} Hard`);
        }
        
        console.log('✅ Filtered to', words.length, 'words for user');
        
        // Cache words for offline use
        await cacheWordsForOffline(words);
        
        // Check if we have enough words
        const easyWords = words.filter(w => w.difficulty === Difficulty.EASY);
        const mediumWords = words.filter(w => w.difficulty === Difficulty.MEDIUM);
        const hardWords = words.filter(w => w.difficulty === Difficulty.HARD);
        
        const hasEnoughWords = easyWords.length >= 10 && mediumWords.length >= 10 && hardWords.length >= 10;
        
        if (words.length > 0 && hasEnoughWords) {
          setWordList(words);
          setIsPracticeMode(false);
        } else if (words.length > 0 && !hasEnoughWords) {
          // Supplement with practice words
          console.warn('⚠️ Supplementing with practice words');
          
          let practiceWordsToUse = INITIAL_MOCK_WORDS;
          
          if (gradeLevel && parseInt(gradeLevel) <= 3) {
            practiceWordsToUse = INITIAL_MOCK_WORDS.filter(w => 
              w.difficulty === Difficulty.EASY || w.difficulty === Difficulty.MEDIUM
            );
          } else if (gradeLevel && parseInt(gradeLevel) <= 4) {
            practiceWordsToUse = INITIAL_MOCK_WORDS.filter(w => 
              w.difficulty === Difficulty.EASY || 
              w.difficulty === Difficulty.MEDIUM ||
              (w.difficulty === Difficulty.HARD && w.term.length <= 12)
            );
          }
          
          const practiceEasy = practiceWordsToUse.filter(w => w.difficulty === Difficulty.EASY);
          const practiceMedium = practiceWordsToUse.filter(w => w.difficulty === Difficulty.MEDIUM);
          const practiceHard = practiceWordsToUse.filter(w => w.difficulty === Difficulty.HARD);
          
          const combinedWords = [
            ...words,
            ...practiceEasy.slice(0, Math.max(0, 10 - easyWords.length)),
            ...practiceMedium.slice(0, Math.max(0, 10 - mediumWords.length)),
            ...practiceHard.slice(0, Math.max(0, 10 - hardWords.length))
          ];
          
          setWordList(combinedWords);
          setIsPracticeMode(true);
        } else {
          // Use practice words as fallback
          console.warn('⚠️ Using practice words as fallback');
          
          let practiceWordsToUse = INITIAL_MOCK_WORDS;
          
          if (gradeLevel && parseInt(gradeLevel) <= 3) {
            practiceWordsToUse = INITIAL_MOCK_WORDS.filter(w => 
              w.difficulty === Difficulty.EASY || w.difficulty === Difficulty.MEDIUM
            );
          } else if (gradeLevel && parseInt(gradeLevel) <= 4) {
            practiceWordsToUse = INITIAL_MOCK_WORDS.filter(w => 
              w.difficulty === Difficulty.EASY || 
              w.difficulty === Difficulty.MEDIUM ||
              (w.difficulty === Difficulty.HARD && w.term.length <= 12)
            );
          }
          
          setWordList(practiceWordsToUse);
          setIsPracticeMode(true);
        }
      } catch (error) {
        console.error('❌ Error in real-time word sync:', error);
      }
    }, (error) => {
      console.error('❌ Firestore listener error:', error);
    });
    
    // Cleanup listener on unmount
    return () => {
      console.log('🔌 Disconnecting real-time word sync');
      unsubscribe();
    };
  }, [user]); // Re-setup listener when user changes

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      // Stop background music
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      setIsMusicPlaying(false);
      
      await signOutUser();
      setUser(null);
      setActiveTab('home');
      setActiveGame(null);
      setShowLogoutModal(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpdateSparkies = (n: number) => {
    if (user && user.sparkies !== undefined) {
      setUser({ ...user, sparkies: Math.max(0, (user.sparkies || 0) + n) });
    }
  };

  const handleGameComplete = async (session: GameSession) => {
    if (!user) return;
    
    console.log('🎮 Game Complete!');
    console.log('   Session data:', session);
    console.log('   Difficulty:', session.difficulty);
    console.log('   Total words:', session.words.length);
    console.log('   Results:', session.results);
    console.log('   Sparkies earned:', session.totalSparkiesEarned);
    console.log('   Streak:', session.streak);
    console.log('   Time spent:', session.timeSpent, 'seconds');
    console.log('   Is Practice/Quick Play?', isQuickPlay || isPracticeMode);
    
    // If in practice/quick play mode, don't save progress
    if (isQuickPlay || isPracticeMode) {
      console.log('🎯 Practice Mode - Progress not saved');
      setActiveGame(null);
      setIsQuickPlay(false);
      setIsPracticeMode(false);
      setActiveTab('home');
      return;
    }
    
    try {
      // Update completion time if time was tracked
      if (session.timeSpent && session.timeSpent > 0) {
        await updateCompletionTime(user.id, session.timeSpent);
        console.log('⏱️ Updated completion time:', session.timeSpent, 'seconds');
      }
      
      // Update progress in Firebase
      console.log('📤 Updating user progress in Firebase...');
      const updates = await updateUserProgress(user.id, session);
      console.log('✅ Progress updated successfully!');
      console.log('   New sparkies:', updates.sparkies);
      console.log('   New total games:', updates.totalGames);
      console.log('   New words learned:', updates.wordsLearned);
      console.log('   Updates:', updates);
      
      // Check for new milestones
      const newBadges = (updates.badges || []).filter(b => !previousBadges.includes(b));
      const newCerts = (updates.certificates?.length || 0) - previousCerts;
      const newStreak = updates.currentStreak || 0;
      const oldStreak = user.currentStreak || 0;
      
      // Update local state
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...updates
        };
      });
      
      // Update tracking
      setPreviousBadges(updates.badges || []);
      setPreviousCerts(updates.certificates?.length || 0);
      
      setActiveGame(null);
      setIsQuickPlay(false);
      setIsPracticeMode(false);
      setActiveTab('home');
      
      // Check if word pool was reset (all words completed)
      const oldUsedIds = user.usedWordIds?.[session.difficulty] || [];
      const newUsedIds = updates.usedWordIds?.[session.difficulty] || [];
      const wasReset = oldUsedIds.length > newUsedIds.length && oldUsedIds.length > 0;
      
      // Show milestone celebration
      if (wasReset) {
        // Word pool reset - student completed all words!
        setMilestone({
          type: 'achievement',
          title: 'All Words Mastered!',
          description: `You've completed all ${session.difficulty} words! Starting fresh with new questions.`,
          icon: '🎓',
          color: '#8b5cf6'
        });
      } else if (newCerts > 0) {
        const cert = updates.certificates![updates.certificates!.length - 1];
        setMilestone({
          type: 'certificate',
          title: 'Certificate Earned!',
          description: `You mastered ${cert.difficulty} mode with a perfect score!`,
          icon: '🏆',
          color: '#f39c12'
        });
      } else if (newBadges.length > 0) {
        const badge = BADGES.find(b => b.id === newBadges[0]);
        if (badge) {
          setMilestone({
            type: 'badge',
            title: 'Badge Unlocked!',
            description: badge.name,
            icon: badge.icon,
            color: '#00c2a0'
          });
        }
      } else if (newStreak > oldStreak && newStreak >= 3 && newStreak % 3 === 0) {
        setMilestone({
          type: 'streak',
          title: `${newStreak} Day Streak!`,
          description: 'You\'re on fire! Keep playing daily to maintain your streak.',
          icon: '🔥',
          color: '#ef4444'
        });
      }
    } catch (error) {
      console.error("❌ Error updating progress:", error);
      alert("Failed to save progress. Please try again.");
    }
  };

  const handleQuickPlay = () => {
    // Select 5 random words from all difficulties
    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    setQuickPlayWords(selected);
    setIsQuickPlay(true);
    setIsPracticeMode(false); // Quick play is always practice mode (no progress saved)
    setActiveGame(Difficulty.EASY); // Use EASY as placeholder
  };

  const handleReviewPractice = (words: Word[]) => {
    setQuickPlayWords(words);
    setIsQuickPlay(true);
    setShowReviewWords(false);
    setActiveGame(Difficulty.EASY); // Use EASY as placeholder
  };

  const handleTeacherNavigate = (tab: string) => {
    // Map the tab names from ProfileView to TeacherView tabs
    const tabMap: { [key: string]: 'dashboard' | 'students' | 'words' | 'analytics' } = {
      'students': 'students',
      'words': 'words',
      'analytics': 'analytics',
      'dashboard': 'dashboard'
    };
    
    const mappedTab = tabMap[tab] || 'dashboard';
    setTeacherTab(mappedTab);
    setActiveTab('home'); // Switch to home tab to show TeacherView
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1221] text-white font-['Quicksand'] flex items-center justify-center">
        <FunLoadingAnimation type="words" message="Loading your adventure..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b1221] text-white font-['Quicksand'] selection:bg-[#00c2a0]/30 overflow-x-hidden">
        <AuthView />
        <FirebaseStatus />
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'rank') return <LeaderboardView currentUser={user} />;
    if (activeTab === 'profile') {
      // Pass navigation handler for teachers
      const onNavigate = user.role === UserRole.TEACHER ? handleTeacherNavigate : undefined;
      return <ProfileView user={user} onLogout={handleLogout} onNavigate={onNavigate} />;
    }

    if (user.role === UserRole.STUDENT) {
      if (activeTab === 'play') return <PlayView 
        user={user} 
        onLevelSelect={(difficulty, isPractice = false) => {
          setIsPracticeMode(isPractice);
          setActiveGame(difficulty);
        }} 
        onQuickPlay={handleQuickPlay} 
        isPracticeMode={isPracticeMode} 
      />;
      return <DashboardView user={user} onStart={() => setActiveTab('play')} />;
    } else if (user.role === UserRole.TEACHER) {
      return <TeacherView initialTab={teacherTab} />;
    } else if (user.role === UserRole.ADMIN) {
      return <AdminView />;
    }
    return <DashboardView user={user} onStart={() => setActiveTab('play')} />;
  };

  return (
    <div className="min-h-screen bg-[#0b1221] text-white font-['Quicksand'] pb-32 pt-8 px-6 selection:bg-[#00c2a0]/30 overflow-x-hidden">
      <div className="flex justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-[#00c2a0] rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg">W</div>
          <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">Mastering Words</h1>
        </div>
        <div className="flex gap-2 items-center flex-shrink-0">
          {/* Language Selector - Only for students */}
          {user.role === UserRole.STUDENT && (
            <LanguageSelector
              currentLanguage={(user.language as Language) || 'en'}
              userId={user.id}
              onLanguageChange={(newLang) => {
                setUser(prev => prev ? { ...prev, language: newLang } : null);
              }}
            />
          )}
          
          {/* Music Volume Control Button */}
          <div className="relative flex-shrink-0 volume-control-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVolumeControl(!showVolumeControl);
              }}
              className="w-9 h-9 bg-[#162031] hover:bg-[#1a2638] rounded-lg flex items-center justify-center transition-all active:scale-95 border border-white/10"
              title="Music Volume"
            >
              <span className="text-base">{musicVolume === 0 ? '🔇' : musicVolume < 0.3 ? '🔉' : '🔊'}</span>
            </button>
            
            {/* Volume Control Panel */}
            {showVolumeControl && (
              <div 
                className="absolute top-12 right-0 bg-[#162031] rounded-2xl p-4 shadow-2xl border border-white/10 z-[200] animate-in slide-in-from-top-2 duration-200 min-w-[200px]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">Music Volume</span>
                    <span className="text-[#00c2a0] text-xs font-bold">{Math.round(musicVolume * 100)}%</span>
                  </div>
                  
                  {/* Volume Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume * 100}
                    onChange={(e) => {
                      e.stopPropagation();
                      const newVolume = Number(e.target.value) / 100;
                      setMusicVolume(newVolume);
                      if (bgMusicRef.current) {
                        bgMusicRef.current.volume = newVolume;
                      }
                    }}
                    className="w-full h-2 bg-[#0b1221] rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #00c2a0 0%, #00c2a0 ${musicVolume * 100}%, #0b1221 ${musicVolume * 100}%, #0b1221 100%)`
                    }}
                  />
                  
                  {/* Quick Presets */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMusicVolume(0);
                        if (bgMusicRef.current) {
                          bgMusicRef.current.volume = 0;
                        }
                      }}
                      className="flex-1 bg-[#0b1221] hover:bg-[#0b1221]/70 text-white text-xs py-2 rounded-lg transition-all active:scale-95"
                    >
                      🔇 Off
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMusicVolume(0.15);
                        if (bgMusicRef.current) {
                          bgMusicRef.current.volume = 0.15;
                        }
                      }}
                      className="flex-1 bg-[#0b1221] hover:bg-[#0b1221]/70 text-white text-xs py-2 rounded-lg transition-all active:scale-95"
                    >
                      🔉 Low
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMusicVolume(0.5);
                        if (bgMusicRef.current) {
                          bgMusicRef.current.volume = 0.5;
                        }
                      }}
                      className="flex-1 bg-[#0b1221] hover:bg-[#0b1221]/70 text-white text-xs py-2 rounded-lg transition-all active:scale-95"
                    >
                      🔊 High
                    </button>
                  </div>
                  
                  <p className="text-gray-500 text-[10px] text-center leading-tight">
                    💡 Adjust music volume to your preference
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border border-white/10 flex items-center gap-1.5 flex-shrink-0 ${user.role === UserRole.ADMIN ? 'bg-purple-500 text-white' : user.role === UserRole.TEACHER ? 'bg-teal-500 text-white' : 'bg-blue-500 text-white'}`}>
             <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
             <span className="whitespace-nowrap">{user.role}</span>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in duration-500">
        {renderContent()}
      </div>

      <BottomNav 
        activeTab={activeTab} 
        setTab={setActiveTab} 
        role={user.role}
        onStatsClick={() => setShowProgressDashboard(true)}
        onReviewClick={() => setShowReviewWords(true)}
      />

      {activeGame && (
        <GameOverlay 
          difficulty={activeGame} 
          onClose={() => {
            setActiveGame(null);
            setIsQuickPlay(false);
            setIsPracticeMode(false);
          }}
          onComplete={handleGameComplete}
          sparkies={user.sparkies}
          onUpdateSparkies={handleUpdateSparkies}
          gameWords={isQuickPlay ? quickPlayWords : wordList}
          isQuickPlay={isQuickPlay}
          isPracticeMode={isPracticeMode}
          usedWordIds={user.usedWordIds}
          userLanguage={(user.language as Language) || 'en'}
        />
      )}

      {showProgressDashboard && (
        <ProgressDashboard 
          user={user}
          onClose={() => setShowProgressDashboard(false)}
        />
      )}

      {showReviewWords && (
        <ReviewWrongWords
          wrongWordIds={user.wrongWords || []}
          allWords={wordList}
          onClose={() => setShowReviewWords(false)}
          onStartPractice={handleReviewPractice}
        />
      )}

      {milestone && (
        <MilestoneCelebration
          milestone={milestone}
          onClose={() => setMilestone(null)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#162031] to-[#0b1221] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-3xl">👋</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Sign Out?</h3>
              <p className="text-gray-400 text-sm">Are you sure you want to sign out?</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-[#0b1221] hover:bg-[#162031] text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
