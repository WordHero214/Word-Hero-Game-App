// Bilingual translations for English and Filipino (Tagalog)

export type Language = 'en' | 'fil';

export interface Translations {
  // Game UI
  wordClue: string;
  listenAndType: string;
  scenario: string;
  hint: string;
  hintCost: string;
  submitWord: string;
  nextWord: string;
  skipWord: string;
  spellInEnglish: string; // NEW: Instruction that spelling should be in English
  
  // Feedback
  excellent: string;
  tryAgain: string;
  correct: string;
  wrong: string;
  timeUp: string;
  betterLuck: string;
  studyMore: string;
  
  // Progress
  question: string;
  of: string;
  correctAnswers: string;
  accuracy: string;
  remaining: string;
  almostThere: string;
  youreDoingGreat: string;
  
  // Game Complete
  gameComplete: string;
  congratulations: string;
  youEarned: string;
  sparkies: string;
  wordsCompleted: string;
  
  // Levels
  easyLevel: string;
  mediumLevel: string;
  hardLevel: string;
  quickPlay: string;
  practiceMode: string;
  
  // Dashboard
  welcomeBack: string;
  startPlaying: string;
  chooseLevel: string;
  masterEachLevel: string;
  games: string;
  words: string;
  mastery: string;
  badges: string;
  masteryProgress: string;
  
  // Streak
  dayStreak: string;
  greatJob: string;
  comeBackTomorrow: string;
  playToday: string;
  longest: string;
  
  // Profile
  certificatesOfMastery: string;
  earnedOn: string;
  downloadPDF: string;
  masterLevel: string;
  
  // Practice Mode
  practiceModeTitle: string;
  practiceModeDesc: string;
  usingDefaultWords: string;
  teacherCanAdd: string;
  
  // Quick Play
  quickPlayTitle: string;
  quickPlayDesc: string;
  randomWords: string;
  fastPractice: string;
  
  // Milestones
  certificateEarned: string;
  badgeUnlocked: string;
  allWordsMastered: string;
  startingFresh: string;
  youreOnFire: string;
  keepPlaying: string;
  
  // Common
  close: string;
  cancel: string;
  confirm: string;
  yes: string;
  no: string;
  loading: string;
  error: string;
  success: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Game UI
    wordClue: 'Word Clue',
    listenAndType: 'Listen and Type',
    scenario: 'Scenario',
    hint: 'Hint',
    hintCost: '(-5 ✨)',
    submitWord: 'Submit Word',
    nextWord: 'Next Word',
    skipWord: 'Skip Word',
    spellInEnglish: 'Type your answer in English',
    
    // Feedback
    excellent: 'EXCELLENT! 🌟',
    tryAgain: 'TRY AGAIN! 🧩',
    correct: 'Correct!',
    wrong: 'Wrong',
    timeUp: "Time's Up!",
    betterLuck: 'Better luck next time!',
    studyMore: 'Study more to get higher scores and sparkies ✨',
    
    // Progress
    question: 'Question',
    of: 'of',
    correctAnswers: 'correct',
    accuracy: 'accuracy',
    remaining: 'remaining',
    almostThere: 'Almost there!',
    youreDoingGreat: "You're doing great!",
    
    // Game Complete
    gameComplete: 'Game Complete!',
    congratulations: 'Congratulations!',
    youEarned: 'You earned',
    sparkies: 'sparkies',
    wordsCompleted: 'Words completed',
    
    // Levels
    easyLevel: 'Easy',
    mediumLevel: 'Medium',
    hardLevel: 'Hard',
    quickPlay: 'Quick Play',
    practiceMode: 'Practice Mode',
    
    // Dashboard
    welcomeBack: 'Welcome back,',
    startPlaying: 'Start Playing',
    chooseLevel: 'Choose Level',
    masterEachLevel: 'Master each level to unlock the next',
    games: 'Games',
    words: 'Words',
    mastery: 'Mastery',
    badges: 'Badges',
    masteryProgress: 'Mastery Progress',
    
    // Streak
    dayStreak: 'Day Streak!',
    greatJob: 'Great job! Come back tomorrow to keep it going!',
    comeBackTomorrow: 'Come back tomorrow to keep it going!',
    playToday: 'Play today to continue your streak!',
    longest: 'Longest',
    
    // Profile
    certificatesOfMastery: 'Certificates of Mastery',
    earnedOn: 'Earned on',
    downloadPDF: 'Download PDF 📥',
    masterLevel: 'Master',
    
    // Practice Mode
    practiceModeTitle: 'Practice Mode',
    practiceModeDesc: "You're using default practice words. Your teacher can add custom words for your grade level in the Word Bank.",
    usingDefaultWords: "You're using default practice words.",
    teacherCanAdd: 'Your teacher can add custom words for your grade level in the Word Bank.',
    
    // Quick Play
    quickPlayTitle: 'Quick Play',
    quickPlayDesc: '5 random words • Fast practice',
    randomWords: 'random words',
    fastPractice: 'Fast practice',
    
    // Milestones
    certificateEarned: 'Certificate Earned!',
    badgeUnlocked: 'Badge Unlocked!',
    allWordsMastered: 'All Words Mastered!',
    startingFresh: "You've completed all {difficulty} words! Starting fresh with new questions.",
    youreOnFire: "You're on fire! Keep playing daily to maintain your streak.",
    keepPlaying: 'Keep playing daily to maintain your streak.',
    
    // Common
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
  
  fil: {
    // Game UI
    wordClue: 'Pahiwatig ng Salita',
    listenAndType: 'Makinig at I-type',
    scenario: 'Sitwasyon',
    hint: 'Pahiwatig',
    hintCost: '(-5 ✨)',
    submitWord: 'Ipasa ang Salita',
    nextWord: 'Susunod na Salita',
    skipWord: 'Laktawan',
    spellInEnglish: 'I-type ang sagot sa Ingles',
    
    // Feedback
    excellent: 'NAPAKAGALING! 🌟',
    tryAgain: 'SUBUKAN MULI! 🧩',
    correct: 'Tama!',
    wrong: 'Mali',
    timeUp: 'Naubos na ang Oras!',
    betterLuck: 'Mas maswerte sa susunod!',
    studyMore: 'Mag-aral pa para makakuha ng mas mataas na puntos at sparkies ✨',
    
    // Progress
    question: 'Tanong',
    of: 'ng',
    correctAnswers: 'tama',
    accuracy: 'katumpakan',
    remaining: 'natitira',
    almostThere: 'Malapit na!',
    youreDoingGreat: 'Magaling ka!',
    
    // Game Complete
    gameComplete: 'Tapos na ang Laro!',
    congratulations: 'Binabati kita!',
    youEarned: 'Nakakuha ka ng',
    sparkies: 'sparkies',
    wordsCompleted: 'Natapos na salita',
    
    // Levels
    easyLevel: 'Madali',
    mediumLevel: 'Katamtaman',
    hardLevel: 'Mahirap',
    quickPlay: 'Mabilis na Laro',
    practiceMode: 'Practice Mode',
    
    // Dashboard
    welcomeBack: 'Maligayang pagbabalik,',
    startPlaying: 'Magsimula ng Laro',
    chooseLevel: 'Pumili ng Antas',
    masterEachLevel: 'Pagandahin ang bawat antas upang buksan ang susunod',
    games: 'Laro',
    words: 'Salita',
    mastery: 'Kahusayan',
    badges: 'Mga Badge',
    masteryProgress: 'Progreso ng Kahusayan',
    
    // Streak
    dayStreak: 'Araw na Sunod-sunod!',
    greatJob: 'Magaling! Bumalik bukas para ipagpatuloy!',
    comeBackTomorrow: 'Bumalik bukas para ipagpatuloy!',
    playToday: 'Maglaro ngayon para ipagpatuloy ang iyong streak!',
    longest: 'Pinakamatagal',
    
    // Profile
    certificatesOfMastery: 'Mga Sertipiko ng Kahusayan',
    earnedOn: 'Nakuha noong',
    downloadPDF: 'I-download ang PDF 📥',
    masterLevel: 'Dalubhasa',
    
    // Practice Mode
    practiceModeTitle: 'Practice Mode',
    practiceModeDesc: 'Gumagamit ka ng default na practice words. Ang iyong guro ay maaaring magdagdag ng custom na salita para sa iyong grade level sa Word Bank.',
    usingDefaultWords: 'Gumagamit ka ng default na practice words.',
    teacherCanAdd: 'Ang iyong guro ay maaaring magdagdag ng custom na salita para sa iyong grade level sa Word Bank.',
    
    // Quick Play
    quickPlayTitle: 'Mabilis na Laro',
    quickPlayDesc: '5 random na salita • Mabilis na practice',
    randomWords: 'random na salita',
    fastPractice: 'Mabilis na practice',
    
    // Milestones
    certificateEarned: 'Nakakuha ng Sertipiko!',
    badgeUnlocked: 'Nabuksan ang Badge!',
    allWordsMastered: 'Natapos na Lahat ng Salita!',
    startingFresh: 'Natapos mo na ang lahat ng {difficulty} na salita! Magsisimula ng bago.',
    youreOnFire: 'Ang galing mo! Maglaro araw-araw para mapanatili ang iyong streak.',
    keepPlaying: 'Maglaro araw-araw para mapanatili ang iyong streak.',
    
    // Common
    close: 'Isara',
    cancel: 'Kanselahin',
    confirm: 'Kumpirmahin',
    yes: 'Oo',
    no: 'Hindi',
    loading: 'Naglo-load...',
    error: 'Error',
    success: 'Tagumpay',
  }
};

// Helper function to get translation
export const t = (key: keyof Translations, lang: Language = 'en'): string => {
  return translations[lang][key];
};

// Helper function to get translation with replacements
export const tr = (key: keyof Translations, lang: Language = 'en', replacements: Record<string, string> = {}): string => {
  let text = translations[lang][key];
  Object.keys(replacements).forEach(key => {
    text = text.replace(`{${key}}`, replacements[key]);
  });
  return text;
};
