import { addWord } from './firebaseService';
import { Difficulty, Word } from './types';

const INITIAL_WORDS: Word[] = [
  // EASY - 10 Words
  { id: 'e1', term: 'APPLE', difficulty: Difficulty.EASY, category: 'Fruits', hint: 'A crunchy red or green fruit that keeps the doctor away!' },
  { id: 'e2', term: 'HOUSE', difficulty: Difficulty.EASY, category: 'Places', hint: 'A building where a family lives together.' },
  { id: 'e3', term: 'BREAD', difficulty: Difficulty.EASY, category: 'Food', hint: 'A soft food made from flour, used to make sandwiches.' },
  { id: 'e4', term: 'WATER', difficulty: Difficulty.EASY, category: 'Nature', hint: 'A clear liquid we drink when we are thirsty.' },
  { id: 'e5', term: 'SCHOOL', difficulty: Difficulty.EASY, category: 'Places', hint: 'A place where children go to learn and play with friends.' },
  { id: 'e6', term: 'GARDEN', difficulty: Difficulty.EASY, category: 'Nature', hint: 'An outdoor area with flowers, plants, and grass.' },
  { id: 'e7', term: 'FAMILY', difficulty: Difficulty.EASY, category: 'Social', hint: 'A group of people like mom, dad, and siblings.' },
  { id: 'e8', term: 'FRIEND', difficulty: Difficulty.EASY, category: 'Social', hint: 'Someone you like to play and share secrets with.' },
  { id: 'e9', term: 'ORANGE', difficulty: Difficulty.EASY, category: 'Fruits', hint: 'A round citrus fruit that is the same name as its color.' },
  { id: 'e10', term: 'SMILE', difficulty: Difficulty.EASY, category: 'Social', hint: 'What you do with your mouth when you are happy.' },

  // MEDIUM - 10 Words
  { id: 'm1', term: 'GUITAR', difficulty: Difficulty.MEDIUM, category: 'Music' },
  { id: 'm2', term: 'BICYCLE', difficulty: Difficulty.MEDIUM, category: 'Transport' },
  { id: 'm3', term: 'CALENDAR', difficulty: Difficulty.MEDIUM, category: 'Time' },
  { id: 'm4', term: 'JOURNEY', difficulty: Difficulty.MEDIUM, category: 'Action' },
  { id: 'm5', term: 'MYSTERY', difficulty: Difficulty.MEDIUM, category: 'Books' },
  { id: 'm6', term: 'WEATHER', difficulty: Difficulty.MEDIUM, category: 'Nature' },
  { id: 'm7', term: 'SCIENCE', difficulty: Difficulty.MEDIUM, category: 'School' },
  { id: 'm8', term: 'HISTORY', difficulty: Difficulty.MEDIUM, category: 'School' },
  { id: 'm9', term: 'THROUGH', difficulty: Difficulty.MEDIUM, category: 'Common' },
  { id: 'm10', term: 'ALTHOUGH', difficulty: Difficulty.MEDIUM, category: 'Common' },

  // HARD - 10 Words
  { id: 'h1', term: 'DEFORESTATION', difficulty: Difficulty.HARD, category: 'Environment', scenario: 'Many animals lose their homes because of _______.' },
  { id: 'h2', term: 'POLLUTION', difficulty: Difficulty.HARD, category: 'Environment', scenario: 'Throwing trash in rivers causes water _______.' },
  { id: 'h3', term: 'RECYCLING', difficulty: Difficulty.HARD, category: 'Environment', scenario: 'We can save the Earth by _______ our plastic bottles.' },
  { id: 'h4', term: 'SUSTAINABILITY', difficulty: Difficulty.HARD, category: 'Environment', scenario: 'Using solar energy is a great example of _______.' },
  { id: 'h5', term: 'PHOTOSYNTHESIS', difficulty: Difficulty.HARD, category: 'Science', scenario: 'Plants make their own food through a process called _______.' },
  { id: 'h6', term: 'ARCHITECTURE', difficulty: Difficulty.HARD, category: 'Arts', scenario: 'The design and style of a building is called its _______.' },
  { id: 'h7', term: 'PHILOSOPHY', difficulty: Difficulty.HARD, category: 'Social', scenario: 'The study of the fundamental nature of knowledge is _______.' },
  { id: 'h8', term: 'HYPOTHESIS', difficulty: Difficulty.HARD, category: 'Science', scenario: 'A scientist makes a _______ before starting an experiment.' },
  { id: 'h9', term: 'BIODIVERSITY', difficulty: Difficulty.HARD, category: 'Nature', scenario: 'A rainforest has a lot of _______ because of its many species.' },
  { id: 'h10', term: 'ECOSYSTEM', difficulty: Difficulty.HARD, category: 'Nature', scenario: 'A coral reef is a complex underwater _______.' }
];

export const seedInitialWords = async () => {
  console.log('Seeding initial words to Firebase...');
  
  for (const word of INITIAL_WORDS) {
    try {
      await addWord(word);
      console.log(`✓ Added: ${word.term}`);
    } catch (error) {
      console.error(`✗ Failed to add ${word.term}:`, error);
    }
  }
  
  console.log('Seeding complete!');
};

// Run this function manually from browser console if needed:
// import { seedInitialWords } from './seedWords';
// seedInitialWords();
