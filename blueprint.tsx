
import React from 'react';

const BlueprintView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[80vh] custom-scrollbar">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">System Architecture Blueprint</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">1. System Architecture Overview</h2>
        <p className="text-gray-700 mb-4">
          The system follows a classic MERN-like architecture optimized for educational environments:
        </p>
        <ul className="list-disc ml-6 text-gray-600 space-y-2">
          <li><strong>Frontend:</strong> React SPA using Tailwind for high-quality UX and Responsive Design.</li>
          <li><strong>Backend:</strong> Node.js/Express handling Business Logic & Auth.</li>
          <li><strong>Database:</strong> Firebase (Firestore) for real-time progress and document-based storage.</li>
          <li><strong>Auth:</strong> Firebase Auth combined with JWT for role-based session management.</li>
          <li><strong>AI Layer:</strong> Gemini API for dynamic scenario generation and native Text-to-Speech.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">2. Folder Structure</h2>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`project-root/
├── src/
│   ├── components/      # UI Elements (Button, Cards, Badges)
│   ├── views/           # Full Pages (Dashboard, Game, Admin)
│   ├── services/        # API calls, Gemini integration
│   ├── hooks/           # Custom React hooks (useGame, useAuth)
│   ├── types.ts         # Global interfaces
│   └── constants.ts     # Configs & Styles
├── functions/           # Firebase Cloud Functions (Backend)
│   ├── auth.js          # JWT Generation & Role Logic
│   ├── scoring.js       # Reward Calculation Logic
│   └── progress.js      # Adaptive Progression Engine
└── firebase.json        # Infrastructure config`}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">3. PostgreSQL Database Schema</h2>
        <p className="text-sm text-gray-500 mb-2 italic">*Mapped to relational structure for thesis documentation*</p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
{`CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role ENUM('Student', 'Teacher', 'Admin'),
  total_sparkies INT DEFAULT 0,
  current_level ENUM('Easy', 'Medium', 'Hard'),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE attempts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  word_id UUID REFERENCES words(id),
  is_correct BOOLEAN,
  attempts_count INT,
  time_taken INT, -- seconds
  difficulty ENUM('Easy', 'Medium', 'Hard'),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE progress (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  mastery_score FLOAT, -- (correct/total)*100
  last_updated TIMESTAMP
);`}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">4. Reward Calculation Logic</h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <code className="text-sm block whitespace-pre">
{`function calculateRewards(difficulty, firstTry, streak) {
  let base = 0;
  if (difficulty === 'EASY') base = 10;
  else if (difficulty === 'MEDIUM') base = 15;
  else if (difficulty === 'HARD') base = 25;

  let bonus = 0;
  if (firstTry) bonus += 5;
  if (streak >= 5) bonus += 10;
  
  return base + bonus;
}`}
          </code>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">5. Adaptive Progression Engine</h2>
        <div className="bg-green-50 p-4 rounded-lg">
          <code className="text-sm block whitespace-pre">
{`function checkLevelUp(correct, total) {
  const mastery = (correct / total) * 100;
  if (mastery >= 85) return 'LEVEL_UP';
  if (mastery < 60) return 'LEVEL_DOWN';
  return 'STAY';
}`}
          </code>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">6. Development Roadmap</h2>
        <ol className="list-decimal ml-6 text-gray-600 space-y-3">
          <li><strong>Phase 1: Foundation (Weeks 1-2)</strong> - Firebase Setup, Auth Logic, Routing.</li>
          <li><strong>Phase 2: Core Loop (Weeks 3-5)</strong> - Spelling Engine (Easy/Medium), Word Bank.</li>
          <li><strong>Phase 3: AI & Hard Mode (Weeks 6-7)</strong> - Gemini Integration for Scenarios & TTS.</li>
          <li><strong>Phase 4: Gamification (Weeks 8-9)</strong> - Rewards, Badges, Leaderboards.</li>
          <li><strong>Phase 5: Dashboards (Weeks 10-12)</strong> - Teacher/Admin analytical views & reporting.</li>
        </ol>
      </section>
    </div>
  );
};

export default BlueprintView;
