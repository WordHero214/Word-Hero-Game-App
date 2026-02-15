import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User as FirebaseUser,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  increment,
  Timestamp
} from "firebase/firestore";
import { auth, db, secondaryAuth } from "./firebase";
import { User, UserRole, Difficulty, Word, GameSession, LevelProgress, Certificate } from "./types";

// --- AUTH FUNCTIONS ---

export const signUpUser = async (
  email: string, 
  password: string, 
  name: string, 
  role: UserRole,
  additionalData?: { gradeLevel?: string; section?: string; subject?: string; teacherName?: string; teacherId?: string }
): Promise<User> => {
  try {
    console.log('🔐 Starting user registration...', { email, name, role });
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    console.log('✅ Firebase Auth user created:', firebaseUser.uid);

    await updateProfile(firebaseUser, { displayName: name });
    console.log('✅ Display name updated');

    const baseUser = {
      id: firebaseUser.uid,
      name,
      email,
      username: email.split('@')[0],
      role
    };

    // Only add student-specific fields for STUDENT role
    const newUser: User = role === UserRole.STUDENT ? {
      ...baseUser,
      sparkies: 0,
      totalGames: 0,
      wordsLearned: 0,
      bestStreak: 0,
      badges: [],
      certificates: [],
      achievements: [],
      levelProgress: {
        [Difficulty.EASY]: { difficulty: Difficulty.EASY, mastery: 0, gamesPlayed: 0 },
        [Difficulty.MEDIUM]: { difficulty: Difficulty.MEDIUM, mastery: 0, gamesPlayed: 0 },
        [Difficulty.HARD]: { difficulty: Difficulty.HARD, mastery: 0, gamesPlayed: 0 }
      },
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: new Date().toISOString().split('T')[0],
      wrongWords: [],
      progressHistory: [],
      ...(additionalData?.gradeLevel && { gradeLevel: additionalData.gradeLevel }),
      ...(additionalData?.section && { section: additionalData.section }),
      ...(additionalData?.teacherName && { teacherName: additionalData.teacherName }),
      ...(additionalData?.teacherId && { teacherId: additionalData.teacherId })
    } : {
      ...baseUser,
      ...(additionalData?.subject && { subject: additionalData.subject })
    };

    // Remove undefined values before saving to Firestore
    const cleanedUser = Object.fromEntries(
      Object.entries(newUser).filter(([_, v]) => v !== undefined)
    );

    console.log('📝 Creating Firestore document...', { uid: firebaseUser.uid, role });
    
    // Create Firestore document with retry logic
    let retries = 3;
    let lastError;
    
    while (retries > 0) {
      try {
        await setDoc(doc(db, "users", firebaseUser.uid), {
          ...cleanedUser,
          createdAt: Timestamp.now()
        });
        
        console.log('✅ Firestore document created successfully');
        
        // Verify the document was created
        const verifyDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (verifyDoc.exists()) {
          console.log('✅ Document verified in Firestore');
          return newUser;
        } else {
          throw new Error('Document verification failed');
        }
      } catch (error) {
        lastError = error;
        retries--;
        console.warn(`⚠️ Firestore write attempt failed, retries left: ${retries}`, error);
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
    }
    
    // If all retries failed, throw error
    throw new Error(`Failed to create Firestore document after 3 attempts: ${lastError}`);
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    throw error;
  }
};

export const signInUser = async (email: string, password: string): Promise<User> => {
  try {
    console.log('🔐 Starting sign in...', { email });
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    console.log('✅ Firebase Auth sign in successful:', firebaseUser.uid);
    
    // Try to get user document with retry logic
    let retries = 3;
    let userDoc;
    
    while (retries > 0) {
      userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      
      if (userDoc.exists()) {
        console.log('✅ Firestore document found');
        return userDoc.data() as User;
      }
      
      retries--;
      console.warn(`⚠️ User document not found, retries left: ${retries}`);
      
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }
    
    // User exists in Auth but not in Firestore after retries - create the document
    console.warn("⚠️ User document not found in Firestore after retries, creating one...");
    
    // Determine role based on email (temporary logic)
    let role = UserRole.STUDENT;
    if (email.includes('admin')) {
      role = UserRole.ADMIN;
    } else if (email.includes('teacher')) {
      role = UserRole.TEACHER;
    }
    
    const newUserData: any = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || email.split('@')[0],
      email: firebaseUser.email || email,
      username: email.split('@')[0],
      role: role
    };
    
    // Add student-specific fields if student
    if (role === UserRole.STUDENT) {
      newUserData.sparkies = 0;
      newUserData.totalGames = 0;
      newUserData.wordsLearned = 0;
      newUserData.bestStreak = 0;
      newUserData.badges = [];
      newUserData.certificates = [];
      newUserData.achievements = [];
      newUserData.levelProgress = {
        [Difficulty.EASY]: { difficulty: Difficulty.EASY, mastery: 0, gamesPlayed: 0 },
        [Difficulty.MEDIUM]: { difficulty: Difficulty.MEDIUM, mastery: 0, gamesPlayed: 0 },
        [Difficulty.HARD]: { difficulty: Difficulty.HARD, mastery: 0, gamesPlayed: 0 }
      };
      newUserData.currentStreak = 0;
      newUserData.longestStreak = 0;
      newUserData.lastPlayedDate = new Date().toISOString().split('T')[0];
      newUserData.wrongWords = [];
      newUserData.progressHistory = [];
    }
    
    // Remove undefined values
    const cleanedUserData = Object.fromEntries(
      Object.entries(newUserData).filter(([_, v]) => v !== undefined)
    );
    
    // Create the document with retry
    retries = 3;
    while (retries > 0) {
      try {
        await setDoc(doc(db, "users", firebaseUser.uid), {
          ...cleanedUserData,
          createdAt: Timestamp.now()
        });
        
        console.log('✅ Firestore document created during sign in');
        return newUserData as User;
      } catch (error) {
        retries--;
        console.warn(`⚠️ Failed to create document, retries left: ${retries}`, error);
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          throw error;
        }
      }
    }
    
    throw new Error('Failed to create user document');
    
  } catch (error) {
    console.error('❌ Sign in error:', error);
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const getCurrentUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
  if (!userDoc.exists()) return null;
  return userDoc.data() as User;
};

// --- USER DATA FUNCTIONS ---

export const updateUserProgress = async (
  userId: string, 
  session: GameSession
): Promise<Partial<User>> => {
  console.log('🔄 updateUserProgress called');
  console.log('   User ID:', userId);
  console.log('   Session:', session);
  
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    console.error('❌ User not found:', userId);
    throw new Error("User not found");
  }
  
  const userData = userDoc.data() as User;
  console.log('   Current user data:', userData);
  
  // Only students should have progress tracking
  if (userData.role !== UserRole.STUDENT) {
    console.error('❌ User is not a student:', userData.role);
    throw new Error("Only students can have game progress");
  }

  const currentLevel = userData.levelProgress![session.difficulty];
  const correctCount = session.results.filter(r => r.isCorrect).length;
  const sessionMastery = Math.round((correctCount / (session.words.length || 1)) * 100);
  
  console.log('   Correct answers:', correctCount, '/', session.words.length);
  console.log('   Session mastery:', sessionMastery, '%');
  console.log('   Session sparkies:', session.totalSparkiesEarned);
  
  // Use the HIGHER of current mastery or session mastery (not average)
  // This rewards improvement and doesn't penalize students for practicing
  const newMastery = Math.max(currentLevel.mastery, sessionMastery);
  
  const totalWordsLearned = (userData.wordsLearned || 0) + correctCount;
  const totalSparkies = (userData.sparkies || 0) + session.totalSparkiesEarned;
  const totalGames = (userData.totalGames || 0) + 1;
  const bestStreak = Math.max(userData.bestStreak || 0, session.streak);

  console.log('   Calculating new totals:');
  console.log('     Old sparkies:', userData.sparkies || 0);
  console.log('     Session sparkies:', session.totalSparkiesEarned);
  console.log('     New sparkies:', totalSparkies);
  console.log('     New words learned:', totalWordsLearned);
  console.log('     New total games:', totalGames);

  // NEW: Daily Streak Calculation
  const today = new Date().toISOString().split('T')[0];
  const lastPlayed = userData.lastPlayedDate || '';
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let currentStreak = userData.currentStreak || 0;
  let streakBonus = 0;
  
  if (lastPlayed === today) {
    // Already played today, keep streak
    currentStreak = userData.currentStreak || 1;
  } else if (lastPlayed === yesterday) {
    // Played yesterday, increment streak
    currentStreak = (userData.currentStreak || 0) + 1;
    // Bonus sparkies for 3+ day streaks
    if (currentStreak >= 3) {
      streakBonus = session.totalSparkiesEarned; // 2x sparkies
    }
  } else {
    // Streak broken, reset to 1
    currentStreak = 1;
  }
  
  const longestStreak = Math.max(userData.longestStreak || 0, currentStreak);
  const finalSparkies = totalSparkies + streakBonus;

  // NEW: Track wrong words
  const wrongWordIds = session.results
    .filter(r => !r.isCorrect)
    .map(r => r.wordId);
  const updatedWrongWords = Array.from(new Set([...(userData.wrongWords || []), ...wrongWordIds]));

  // NEW: Track used word IDs for this difficulty
  const usedWordIds = userData.usedWordIds || {};
  const currentUsedIds = usedWordIds[session.difficulty] || [];
  const newUsedIds = session.words.map(w => w.id);
  
  // Get all available words for this difficulty
  const allWordsForDifficulty = session.words.length; // This is approximate
  
  // Combine current used IDs with new ones
  const combinedUsedIds = Array.from(new Set([...currentUsedIds, ...newUsedIds]));
  
  // Check if we need to reset (all words have been used)
  // We'll reset if the combined list is >= total available words for this difficulty
  // For now, we'll use a threshold approach: reset after using 90% of available words
  const shouldReset = combinedUsedIds.length >= allWordsForDifficulty * 0.9;
  
  if (shouldReset && currentUsedIds.length > 0) {
    console.log(`🔄 Resetting used words for ${session.difficulty} - Student completed the pool!`);
    usedWordIds[session.difficulty] = newUsedIds; // Start fresh with current game words
  } else {
    usedWordIds[session.difficulty] = combinedUsedIds;
  }

  // NEW: Progress History
  const progressHistory = userData.progressHistory || [];
  const todayEntry = progressHistory.find(e => e.date === today);
  
  if (todayEntry) {
    todayEntry.sparkiesEarned += session.totalSparkiesEarned + streakBonus;
    todayEntry.wordsLearned += correctCount;
    todayEntry.gamesPlayed += 1;
  } else {
    progressHistory.push({
      date: today,
      sparkiesEarned: session.totalSparkiesEarned + streakBonus,
      wordsLearned: correctCount,
      gamesPlayed: 1
    });
  }
  
  // Keep only last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const filteredHistory = progressHistory.filter(e => e.date >= thirtyDaysAgo);

  // Check for new certificates - award for 100% mastery on 10+ words
  const newCerts = [...(userData.certificates || [])];
  const minWords = 10; // Require 10 words for certificate
  
  if (sessionMastery === 100 && session.words.length >= minWords) {
    const certExists = newCerts.some(c => c.difficulty === session.difficulty);
    if (!certExists) {
      console.log('🏆 Certificate earned!', session.difficulty, 'mode with', session.words.length, 'words');
      
      const newCert: Certificate = {
        id: `cert_${Date.now()}`,
        title: `${session.difficulty} Master`,
        earnedDate: new Date().toLocaleDateString(),
        difficulty: session.difficulty,
        userName: userData.name,
        teacherName: userData.teacherName || 'The Word Master AI'
      };
      newCerts.push(newCert);
    }
  } else if (sessionMastery === 100 && session.words.length < minWords) {
    console.log('⚠️ Perfect score but need', minWords, 'words for certificate. Current:', session.words.length);
  }

  // Check for new badges - require 10+ words for difficulty badges
  const newBadges = new Set(userData.badges || []);
  if (totalGames >= 1) newBadges.add('b1');
  
  // Difficulty badges require 10+ words
  if (session.difficulty === Difficulty.MEDIUM && session.words.length >= minWords) newBadges.add('b2');
  if (session.difficulty === Difficulty.HARD && session.words.length >= minWords) newBadges.add('b3');
  
  // Perfect score badge requires 10+ words
  if (sessionMastery === 100 && session.words.length >= minWords) newBadges.add('b4');
  
  if (bestStreak >= 5) newBadges.add('b5');
  if (bestStreak >= 10) newBadges.add('b6');
  if (newMastery === 100) newBadges.add('b7');
  if (totalWordsLearned >= 50) newBadges.add('b8');
  if (finalSparkies >= 100) newBadges.add('b9');
  if (finalSparkies >= 500) newBadges.add('b10');
  
  // NEW: Streak badges
  if (currentStreak >= 3) newBadges.add('b11');
  if (currentStreak >= 7) newBadges.add('b12');
  if (longestStreak >= 30) newBadges.add('b13');

  // Check for new achievements - require 10+ words
  const newAchievements = new Set(userData.achievements || []);
  if (session.difficulty === Difficulty.HARD && sessionMastery === 100 && session.words.length >= minWords) {
    newAchievements.add('a1');
  }
  if (currentStreak >= 7) newAchievements.add('a2');
  
  const allMastered = Object.values(userData.levelProgress!).every(lp => lp.mastery >= 100) || 
    (newMastery >= 100 && Object.values(userData.levelProgress!)
      .filter(lp => lp.difficulty !== session.difficulty)
      .every(lp => lp.mastery >= 100));
  if (allMastered) newAchievements.add('a3');

  if (session.difficulty === Difficulty.EASY && newMastery >= 85) newAchievements.add('a4');
  if (session.difficulty === Difficulty.MEDIUM && newMastery >= 85) newAchievements.add('a5');

  const updates = {
    sparkies: finalSparkies,
    totalGames: totalGames,
    wordsLearned: totalWordsLearned,
    bestStreak: bestStreak,
    certificates: newCerts,
    badges: Array.from(newBadges),
    achievements: Array.from(newAchievements),
    currentStreak: currentStreak,
    longestStreak: longestStreak,
    lastPlayedDate: today,
    wrongWords: updatedWrongWords,
    usedWordIds: usedWordIds, // NEW: Track used words
    progressHistory: filteredHistory,
    [`levelProgress.${session.difficulty}`]: {
      difficulty: session.difficulty,
      mastery: newMastery,
      gamesPlayed: currentLevel.gamesPlayed + 1
    },
    lastPlayed: Timestamp.now()
  };

  await updateDoc(userRef, updates);

  console.log('✅ Firebase document updated successfully');
  console.log('   Final sparkies:', finalSparkies);
  console.log('   Final games:', totalGames);
  console.log('   Final words:', totalWordsLearned);

  return {
    sparkies: finalSparkies,
    totalGames: totalGames,
    wordsLearned: totalWordsLearned,
    bestStreak: bestStreak,
    certificates: newCerts,
    badges: Array.from(newBadges),
    achievements: Array.from(newAchievements),
    currentStreak: currentStreak,
    longestStreak: longestStreak,
    lastPlayedDate: today,
    wrongWords: updatedWrongWords,
    progressHistory: filteredHistory,
    levelProgress: {
      ...userData.levelProgress!,
      [session.difficulty]: {
        difficulty: session.difficulty,
        mastery: newMastery,
        gamesPlayed: currentLevel.gamesPlayed + 1
      }
    }
  };
};

export const updateUserSparkies = async (userId: string, amount: number): Promise<void> => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) throw new Error("User not found");
  
  const userData = userDoc.data() as User;
  
  // Only students have sparkies
  if (userData.role !== UserRole.STUDENT) {
    throw new Error("Only students can have sparkies");
  }
  
  await updateDoc(userRef, {
    sparkies: increment(amount)
  });
};

// --- WORD MANAGEMENT ---

// Overloaded function signatures
export async function addWord(word: Word): Promise<void>;
export async function addWord(
  term: string,
  difficulty: Difficulty,
  category: string,
  hint?: string,
  scenario?: string,
  gradeLevels?: string[],
  sections?: string[],
  hintFil?: string,
  scenarioFil?: string
): Promise<void>;

// Implementation
export async function addWord(
  wordOrTerm: Word | string,
  difficulty?: Difficulty,
  category?: string,
  hint?: string,
  scenario?: string,
  gradeLevels?: string[],
  sections?: string[],
  hintFil?: string,
  scenarioFil?: string
): Promise<void> {
  let wordData: Word;
  
  if (typeof wordOrTerm === 'string') {
    // Called with individual parameters
    wordData = {
      id: `word_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      term: wordOrTerm.toUpperCase(),
      difficulty: difficulty!,
      category: category!,
      hint,
      scenario,
      gradeLevels,
      sections,
      hintFil,
      scenarioFil,
      createdBy: auth.currentUser?.uid
    };
  } else {
    // Called with Word object
    wordData = wordOrTerm;
  }
  
  await setDoc(doc(db, "words", wordData.id), {
    ...wordData,
    createdAt: Timestamp.now()
  });
}

export const getWords = async (userGradeLevel?: string, userSection?: string): Promise<Word[]> => {
  const wordsSnapshot = await getDocs(collection(db, "words"));
  const allWords = wordsSnapshot.docs.map(doc => doc.data() as Word);
  
  // If no grade level or section provided, return all words (for teachers/admins)
  if (!userGradeLevel && !userSection) {
    return allWords;
  }
  
  // Filter words based on student's grade level and section
  return allWords.filter(word => {
    // If word has no grade levels specified, it's available to all
    const gradeMatch = !word.gradeLevels || word.gradeLevels.length === 0 || 
                       (userGradeLevel && word.gradeLevels.includes(userGradeLevel));
    
    // If word has no sections specified, it's available to all
    const sectionMatch = !word.sections || word.sections.length === 0 || 
                         (userSection && word.sections.includes(userSection));
    
    return gradeMatch && sectionMatch;
  });
};

export const getWordsByDifficulty = async (difficulty: Difficulty): Promise<Word[]> => {
  const q = query(collection(db, "words"), where("difficulty", "==", difficulty));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Word);
};

export const deleteWord = async (wordId: string): Promise<void> => {
  // Permanently delete the word from Firestore
  await deleteDoc(doc(db, "words", wordId));
};

// --- TEACHER FUNCTIONS ---

export const getStudentsByTeacher = async (teacherId: string): Promise<User[]> => {
  // In a real implementation, you'd have a classId or teacherId field
  const q = query(
    collection(db, "users"), 
    where("role", "==", UserRole.STUDENT)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as User);
};

export const createTeacherAccount = async (
  email: string,
  password: string,
  name: string,
  subject?: string
): Promise<User> => {
  try {
    // Check if current user is admin
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("You must be logged in to create teacher accounts");
    }

    // Use secondary auth instance to create user without affecting admin session
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth, 
      email, 
      password
    );
    
    const firebaseUser = userCredential.user;

    // Update display name on secondary auth
    await updateProfile(firebaseUser, { displayName: name });

    // Create user document in Firestore using the MAIN app's context
    // This uses the admin's authentication, so it has permission
    const newUser: User = {
      id: firebaseUser.uid,
      name,
      email,
      username: email.split('@')[0],
      role: UserRole.TEACHER,
      subject
    };

    // Write to Firestore using main app (admin's auth context)
    await setDoc(doc(db, "users", firebaseUser.uid), {
      ...newUser,
      createdAt: Timestamp.now()
    });

    // Sign out from secondary auth (doesn't affect main admin session)
    await firebaseSignOut(secondaryAuth);

    return newUser;
  } catch (error: any) {
    // Sign out from secondary auth in case of error
    await firebaseSignOut(secondaryAuth).catch(() => {});
    
    // Provide more helpful error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered. Please use a different email.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters.');
    } else {
      throw new Error(error.message || 'Failed to create teacher account');
    }
  }
};

// --- LEADERBOARD ---

export const getLeaderboard = async (limit: number = 10): Promise<User[]> => {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const users = usersSnapshot.docs
    .map(doc => doc.data() as User)
    .filter(u => u.role === UserRole.STUDENT && u.sparkies !== undefined)
    .sort((a, b) => (b.sparkies || 0) - (a.sparkies || 0))
    .slice(0, limit);
  
  return users;
};

// --- WORD MANAGEMENT (CRUD) ---

export const updateWord = async (wordId: string, updates: Partial<Word>): Promise<void> => {
  const wordRef = doc(db, "words", wordId);
  await updateDoc(wordRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const getWordById = async (wordId: string): Promise<Word | null> => {
  const wordDoc = await getDoc(doc(db, "words", wordId));
  if (!wordDoc.exists()) return null;
  return wordDoc.data() as Word;
};

// --- STUDENT ANALYTICS ---

export const getStudentsBySection = async (section: string): Promise<User[]> => {
  const q = query(
    collection(db, "users"),
    where("role", "==", UserRole.STUDENT),
    where("section", "==", section)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as User);
};

export const getAllStudents = async (): Promise<User[]> => {
  const q = query(
    collection(db, "users"),
    where("role", "==", UserRole.STUDENT)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as User);
};

// Get teacher by grade level and section
export const getTeacherByGradeAndSection = async (gradeLevel?: string, section?: string): Promise<User | null> => {
  if (!gradeLevel || !section) return null;
  
  try {
    // Query for teachers - in a real system, you'd have a gradeLevel and section field on teachers
    // For now, we'll get the first teacher we find
    const q = query(
      collection(db, "users"),
      where("role", "==", UserRole.TEACHER)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    // Return the first teacher (in a real system, filter by grade/section)
    return querySnapshot.docs[0].data() as User;
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return null;
  }
};

// Update student's teacher name
export const updateStudentTeacherName = async (studentId: string, teacherName: string): Promise<void> => {
  const userRef = doc(db, "users", studentId);
  await updateDoc(userRef, {
    teacherName: teacherName,
    updatedAt: Timestamp.now()
  });
};

// Update existing certificates with teacher name
export const updateExistingCertificatesWithTeacherName = async (studentId: string, teacherName: string): Promise<void> => {
  const userRef = doc(db, "users", studentId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error("Student not found");
  }
  
  const userData = userDoc.data() as User;
  
  if (userData.certificates && userData.certificates.length > 0) {
    // Update all certificates that don't have a teacher name
    const updatedCerts = userData.certificates.map(cert => ({
      ...cert,
      teacherName: cert.teacherName || teacherName
    }));
    
    await updateDoc(userRef, {
      certificates: updatedCerts,
      updatedAt: Timestamp.now()
    });
  }
};


// --- ADMIN USER MANAGEMENT FUNCTIONS ---

export const getAllUsers = async (): Promise<User[]> => {
  const usersSnapshot = await getDocs(collection(db, "users"));
  return usersSnapshot.docs.map(doc => doc.data() as User);
};

export const deleteUserAccount = async (userId: string): Promise<void> => {
  // Note: This only deletes from Firestore. Firebase Auth user deletion requires Admin SDK
  // For production, implement Firebase Cloud Function to delete auth user
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    deleted: true,
    deletedAt: Timestamp.now()
  });
};

export const updateUserData = async (userId: string, updates: Partial<User>): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, updates);
};

export const getSystemAnalytics = async (): Promise<any> => {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const wordsSnapshot = await getDocs(collection(db, "words"));
  const users = usersSnapshot.docs.map(doc => doc.data() as User);
  
  const students = users.filter(u => u.role === UserRole.STUDENT);
  const teachers = users.filter(u => u.role === UserRole.TEACHER);
  
  const totalGamesPlayed = students.reduce((sum, s) => sum + (s.totalGames || 0), 0);
  const totalSparkies = students.reduce((sum, s) => sum + (s.sparkies || 0), 0);
  const certificatesIssued = students.reduce((sum, s) => sum + (s.certificates?.length || 0), 0);
  
  // Calculate average mastery
  let totalMastery = 0;
  let masteryCount = 0;
  students.forEach(s => {
    if (s.levelProgress) {
      Object.values(s.levelProgress).forEach((progress: any) => {
        totalMastery += progress.mastery || 0;
        masteryCount++;
      });
    }
  });
  const averageMastery = masteryCount > 0 ? Math.round(totalMastery / masteryCount) : 0;
  
  // Active today (students who played today)
  const today = new Date().toISOString().split('T')[0];
  const activeToday = students.filter(s => s.lastPlayedDate === today).length;
  
  return {
    totalUsers: users.length,
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalWords: wordsSnapshot.size,
    totalGamesPlayed,
    totalSparkies,
    averageMastery,
    activeToday,
    certificatesIssued
  };
};

// Update user password (requires re-authentication in production)
export const updateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
  // Note: This is a placeholder. In production, use Firebase Admin SDK or Cloud Functions
  // to update passwords securely
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    passwordChanged: true,
    passwordChangedAt: Timestamp.now()
  });
};


// Get all teachers for student enrollment
export const getAllTeachers = async (): Promise<User[]> => {
  const q = query(
    collection(db, "users"),
    where("role", "==", UserRole.TEACHER)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map(doc => doc.data() as User)
    .filter(user => !user.deleted); // Exclude deleted teachers
};


// --- RANKING SYSTEM ---

/**
 * Calculate student's rank based on:
 * 1. Sparkies count (primary)
 * 2. Total completion time (tiebreaker - lower is better)
 */
export const calculateStudentRank = async (userId: string): Promise<{ rank: number; totalStudents: number }> => {
  try {
    // Get all students (without compound query to avoid index requirement)
    const q = query(
      collection(db, "users"),
      where("role", "==", UserRole.STUDENT)
    );
    const studentsSnapshot = await getDocs(q);
    
    // Filter out deleted students in memory
    const students = studentsSnapshot.docs
      .map(doc => doc.data() as User)
      .filter(student => !student.deleted);

    // Get current user
    const currentUser = students.find(s => s.id === userId);
    if (!currentUser) {
      return { rank: 0, totalStudents: students.length };
    }

    // Sort students by:
    // 1. Sparkies (descending - higher is better)
    // 2. Total completion time (ascending - lower is better)
    const sortedStudents = students.sort((a, b) => {
      const sparkiesA = a.sparkies || 0;
      const sparkiesB = b.sparkies || 0;
      
      if (sparkiesA !== sparkiesB) {
        return sparkiesB - sparkiesA; // Higher sparkies = better rank
      }
      
      // If sparkies are equal, use completion time as tiebreaker
      const timeA = a.totalCompletionTime || Infinity;
      const timeB = b.totalCompletionTime || Infinity;
      return timeA - timeB; // Lower time = better rank
    });

    // Find rank (1-based index)
    const rank = sortedStudents.findIndex(s => s.id === userId) + 1;

    return {
      rank,
      totalStudents: students.length
    };
  } catch (error) {
    console.error("Error calculating student rank:", error);
    return { rank: 0, totalStudents: 0 };
  }
};

/**
 * Update student's total completion time after completing a game
 */
export const updateCompletionTime = async (userId: string, timeSpent: number): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentTime = userDoc.data().totalCompletionTime || 0;
      await updateDoc(userRef, {
        totalCompletionTime: currentTime + timeSpent,
        lastRankUpdate: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error updating completion time:", error);
  }
};

/**
 * Get top students for leaderboard with rank information
 */
export const getTopStudentsWithRank = async (limit: number = 10): Promise<Array<User & { rank: number }>> => {
  try {
    const q = query(
      collection(db, "users"),
      where("role", "==", UserRole.STUDENT)
    );
    const studentsSnapshot = await getDocs(q);
    
    // Filter out deleted students in memory
    const students = studentsSnapshot.docs
      .map(doc => doc.data() as User)
      .filter(student => !student.deleted);

    // Sort by sparkies (desc) then by completion time (asc)
    const sortedStudents = students.sort((a, b) => {
      const sparkiesA = a.sparkies || 0;
      const sparkiesB = b.sparkies || 0;
      
      if (sparkiesA !== sparkiesB) {
        return sparkiesB - sparkiesA;
      }
      
      const timeA = a.totalCompletionTime || Infinity;
      const timeB = b.totalCompletionTime || Infinity;
      return timeA - timeB;
    });

    // Add rank to each student
    return sortedStudents.slice(0, limit).map((student, index) => ({
      ...student,
      rank: index + 1
    }));
  } catch (error) {
    console.error("Error getting top students:", error);
    return [];
  }
};
