
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface LevelProgress {
  difficulty: Difficulty;
  mastery: number; // 0-100
  gamesPlayed: number;
}

export interface Certificate {
  id: string;
  title: string;
  earnedDate: string;
  difficulty: Difficulty;
  userName: string;
  teacherName?: string; // Teacher who authorized the certificate
}

export interface User {
  id: string;
  name: string;
  email?: string;
  username: string; // Used as primary login for students
  password?: string;
  role: UserRole;
  
  // Student-specific fields (optional for teachers/admins)
  sparkies?: number;
  totalGames?: number;
  wordsLearned?: number;
  bestStreak?: number;
  badges?: string[];
  certificates?: Certificate[];
  achievements?: string[]; // Track unlocked achievement IDs
  levelProgress?: Record<Difficulty, LevelProgress>;
  
  // NEW: Daily Streak System
  currentStreak?: number;
  longestStreak?: number;
  lastPlayedDate?: string; // ISO date string
  
  // NEW: Wrong Words Tracking
  wrongWords?: string[]; // Array of word IDs
  
  // NEW: Progress History
  progressHistory?: ProgressHistoryEntry[];
  
  // NEW: Word Pool Tracking - Track which words have been used
  usedWordIds?: Record<Difficulty, string[]>; // Track used word IDs per difficulty
  
  // NEW: Language Preference
  language?: 'en' | 'fil'; // English or Filipino (Tagalog)
  
  // NEW: Ranking System
  totalCompletionTime?: number; // Total time spent completing all levels (in seconds)
  lastRankUpdate?: string; // ISO date string of last rank calculation
  
  // School-specific fields
  gradeLevel?: string; // For students
  section?: string; // For students
  subject?: string; // For teachers
  teacherName?: string; // For students - name of their teacher
  teacherId?: string; // For students - ID of their teacher
  
  classId?: string; // For Students
  managedClassIds?: string[]; // For Teachers
  
  // Admin fields
  deleted?: boolean; // Soft delete flag
  deletedAt?: any; // Timestamp
  passwordChanged?: boolean; // Flag for password change
  passwordChangedAt?: any; // Timestamp
}

export interface ProgressHistoryEntry {
  date: string; // ISO date string
  sparkiesEarned: number;
  wordsLearned: number;
  gamesPlayed: number;
}

export interface Word {
  id: string;
  term: string;
  difficulty: Difficulty;
  category: string;
  hint?: string;
  scenario?: string;
  // NEW: Bilingual support
  hintFil?: string; // Filipino/Tagalog hint
  scenarioFil?: string; // Filipino/Tagalog scenario
  // NEW: Grade level and section assignment
  gradeLevels?: string[]; // e.g., ["1", "2", "3"] - empty means all grades
  sections?: string[]; // e.g., ["A", "B", "C"] - empty means all sections
  createdBy?: string; // Teacher ID who created the word
}

export interface GameSession {
  difficulty: Difficulty;
  words: Word[];
  results: {
    wordId: string;
    isCorrect: boolean;
    attempts: number;
  }[];
  totalSparkiesEarned: number;
  streak: number;
  timeSpent?: number; // Total time spent in seconds
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
}

// Activity/Assignment System
export interface Activity {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  
  // Word selection
  wordIds: string[]; // IDs of words from word bank
  customWords?: Word[]; // Optional custom words for this activity
  difficulty?: Difficulty; // Filter words by difficulty
  
  // Timing
  timePerQuestion?: number; // Seconds per question (optional)
  dueDate: any; // Firestore Timestamp
  startDate: any; // When activity becomes available
  
  // Targeting
  targetType: 'all' | 'grade' | 'section' | 'students';
  targetGrades?: string[]; // e.g., ['1', '2', '3']
  targetSections?: string[]; // e.g., ['A', 'B']
  targetStudentIds?: string[]; // Specific student IDs
  
  // Settings
  maxAttempts: number; // 1, 2, 3, or -1 for unlimited
  shuffleQuestions: boolean;
  showResults: boolean; // Show correct answers after completion
  
  // Metadata
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  status: 'draft' | 'active' | 'closed';
}

export interface ActivitySubmission {
  id: string;
  activityId: string;
  studentId: string;
  studentName: string;
  
  // Attempt info
  attemptNumber: number;
  startedAt: any; // Firestore Timestamp
  completedAt?: any; // Firestore Timestamp
  
  // Results
  results: {
    wordId: string;
    word: string;
    isCorrect: boolean;
    timeSpent: number; // Seconds
  }[];
  
  score: number; // Percentage
  totalQuestions: number;
  correctAnswers: number;
  
  // Status
  status: 'in_progress' | 'completed' | 'abandoned';
  
  // Offline support
  submittedOffline: boolean;
  syncedAt?: any; // Firestore Timestamp
}
