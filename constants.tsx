
import React from 'react';

export const COLORS = {
  primary: '#00c2a0', // Teal
  secondary: '#f39c12', // Orange
  background: '#0b1221',
  card: '#162031',
  text: '#ffffff',
  muted: '#64748b',
  easy: '#22c55e',
  medium: '#3b82f6',
  hard: '#f97316'
};

export const BADGES = [
  { id: 'b1', name: 'Beginner Shield', icon: '🛡️' },
  { id: 'b2', name: 'Audio Master', icon: '🎧' },
  { id: 'b3', name: 'Puzzle Master', icon: '🧩' },
  { id: 'b4', name: 'First Victory', icon: '⭐' },
  { id: 'b5', name: 'Hot Streak', icon: '🔥' },
  { id: 'b6', name: 'On Fire', icon: '☄️' },
  { id: 'b7', name: 'Perfect Score', icon: '💎' },
  { id: 'b8', name: '50 Words Master', icon: '🎓' },
  { id: 'b9', name: 'Sparkle Collector', icon: '✨' },
  { id: 'b10', name: 'Sparkle Hoarder', icon: '💰' },
  { id: 'b11', name: '3-Day Streak', icon: '📅' },
  { id: 'b12', name: 'Week Warrior', icon: '🗓️' },
  { id: 'b13', name: 'Month Master', icon: '📆' }
];

export const ACHIEVEMENTS = [
  { id: 'a1', name: 'Perfect Speller', description: '100% on Hard mode', icon: '🏆' },
  { id: 'a2', name: '7-Day Streak', description: 'Play 7 days in a row', icon: '📅' },
  { id: 'a3', name: 'Vocabulary Star', description: 'Master all difficulty levels', icon: '🌟' },
  { id: 'a4', name: 'Level Up: Medium', description: 'Unlock Medium difficulty', icon: '⬆️' },
  { id: 'a5', name: 'Level Up: Hard', description: 'Unlock Hard difficulty', icon: '⬆️' },
  { id: 'a6', name: 'Champion', description: 'Complete all three levels at 100%', icon: '👑' }
];

export const DIFFICULTY_CONFIG = {
  EASY: { 
    label: 'Easy Mode', 
    sub: 'Guided spelling with letter hints', 
    reward: 10, 
    color: '#22c55e', 
    icon: '📖',
    timePerWord: 60, // 60 seconds per word
    minWordsForCertificate: 10 // Need 10 words for certificate
  },
  MEDIUM: { 
    label: 'Medium Mode', 
    sub: 'Audio spelling - listen and type', 
    reward: 15, 
    color: '#3b82f6', 
    icon: '🎧',
    timePerWord: 45, // 45 seconds per word
    minWordsForCertificate: 10
  },
  HARD: { 
    label: 'Hard Mode', 
    sub: 'Real-world scenarios and vocabulary', 
    reward: 25, 
    color: '#f97316', 
    icon: '🔒',
    timePerWord: 90, // 90 seconds per word (harder words need more time)
    minWordsForCertificate: 10
  }
};
