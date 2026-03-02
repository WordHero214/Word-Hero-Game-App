# 🎓 Mastering Words - Gamified Spelling Learning System

<div align="center">

![Mastering Words](https://img.shields.io/badge/Version-1.0.0-00c2a0?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.0-FFCA28?style=for-the-badge&logo=firebase)

**A fun, gamified spelling learning system for elementary students with AI-powered word generation and progress tracking**

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Deployment](#deployment)

</div>

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Game Mechanics](#game-mechanics)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🎮 For Students
- **Three Difficulty Levels**: Easy, Medium, and Hard with adaptive challenges
- **Gamification**: Earn sparkies (points), badges, and certificates
- **Progress Tracking**: Real-time mastery percentage and performance analytics
- **Practice Mode**: Review completed levels without affecting scores
- **Quick Play**: 5 random words for fast practice sessions
- **Daily Streaks**: Maintain streaks for bonus rewards
- **Leaderboard**: Compete with classmates
- **Certificates**: Downloadable PDF certificates for 100% scores
- **Audio Support**: Hear word pronunciations
- **Responsive Design**: Works on desktop, tablet, and mobile

### 👨‍🏫 For Teachers
- **Student Management**: View all students by grade and section
- **Word Bank Management**: Add, edit, and delete custom words
- **AI Word Generation**: Generate grade-appropriate words using Gemini AI
- **Analytics Dashboard**: Track student progress and performance
- **Bulk Operations**: Manage multiple students efficiently
- **Section-Based Organization**: Organize students by grade and section

### 👑 For Admins
- **User Management**: Create and manage teacher accounts
- **System Overview**: Monitor overall system usage
- **Role-Based Access Control**: Secure access management

---

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI**: Google Gemini API for word generation
- **PDF Generation**: jsPDF for certificates
- **Build Tool**: Vite
- **PWA**: Service Worker for offline support

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd masteringword-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Update Firebase configuration**
   
   Edit `firebase.ts` with your Firebase project credentials (already configured for word-hero-8143e)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000`


## 📁 Project Structure

```
masteringword-main/
├── docs/                      # Documentation files
├── logo/                      # App icons and logos
├── music/                     # Audio files
│   ├── background_music.mp3
│   └── button_sound.wav
├── public/                    # Static assets
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── src/
│   ├── AdminView.tsx         # Admin dashboard
│   ├── App.tsx               # Main application
│   ├── AuthView.tsx          # Login/registration
│   ├── constants.tsx         # App constants
│   ├── firebase.ts           # Firebase configuration
│   ├── firebaseService.ts    # Firebase operations
│   ├── geminiService.ts      # AI word generation
│   ├── LeaderboardView.tsx   # Student rankings
│   ├── MilestoneCelebration.tsx
│   ├── ProfileView.tsx       # User profile
│   ├── ProgressDashboard.tsx # Progress tracking
│   ├── ReviewWrongWords.tsx  # Review incorrect answers
│   ├── StudentAnalytics.tsx  # Student performance
│   ├── TeacherView.tsx       # Teacher dashboard
│   ├── types.ts              # TypeScript types
│   ├── WordBankManager.tsx   # Word management
│   └── WordGenerator.tsx     # AI word generation UI
├── .env.local                # Environment variables
├── firestore.rules           # Firestore security rules
├── index.html                # HTML entry point
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

---

## 👥 User Roles

### Student
- Register with email, name, grade level, section, and teacher name
- Play spelling games across three difficulty levels
- Earn sparkies, badges, and certificates
- Track progress and compete on leaderboard
- Practice completed levels

### Teacher
- Created by admin
- Manage word bank for their grade levels
- View student analytics and progress
- Generate AI-powered words
- Monitor class performance

### Admin
- Full system access
- Create and manage teacher accounts
- System-wide oversight
- User management

---

## 🎯 Game Mechanics

### Difficulty Levels

| Level | Time per Word | Sparkies Reward | Unlock Requirement |
|-------|---------------|-----------------|-------------------|
| Easy | 30 seconds | 10 | Available from start |
| Medium | 20 seconds | 20 | 85%+ mastery in Easy |
| Hard | 15 seconds | 30 | 85%+ mastery in Medium |

### Scoring System

- **Sparkies**: Earned for correct answers (multiplied by difficulty)
- **Mastery**: Percentage of correct answers per difficulty
- **Streaks**: Consecutive days of playing
- **Badges**: Awarded for milestones (10, 25, 50, 100 words)
- **Certificates**: Generated for 100% scores with 10+ words

### Practice Mode

- Available for completed levels (mastery > 0%)
- No sparkies earned
- Doesn't affect first-attempt scores
- Perfect for review and improvement

### Quick Play

- 5 random words from mixed difficulties
- Fast practice session
- No sparkies or progress saved

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

### Setup & Configuration
- `SETUP_INSTRUCTIONS.md` - Complete setup guide
- `FIREBASE_SETUP.md` - Firebase configuration
- `PWA_SETUP_AND_LOGO_GUIDE.md` - PWA installation

### Features
- `FEATURES_GUIDE.md` - Complete feature overview
- `WORD_GENERATION_FLOW.md` - AI word generation
- `TEACHER_DASHBOARD_ENHANCEMENTS.md` - Teacher features

### Troubleshooting
- `FINAL_ERROR_RESOLUTION.md` - Common issues and fixes
- `CLEAR_CACHE_AND_RESTART.md` - Cache clearing guide

### Development
- `PROJECT_STATUS.md` - Current project status
- `IMPLEMENTATION_SUMMARY.md` - Implementation details

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

### Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Environment Variables for Production

Ensure these are set in your production environment:
- `GEMINI_API_KEY` - Your Google Gemini API key
- Firebase configuration in `firebase.ts`

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini API Key for AI word generation
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: Never commit `.env.local` to version control. It's already in `.gitignore`.

---

## 🔒 Security

- Firebase Authentication for secure user management
- Firestore security rules for data protection
- Role-based access control (RBAC)
- Environment variables for sensitive data
- No API keys in client-side code

---

## 🎨 Customization

### Branding
- Update logo files in `/logo` folder
- Modify colors in `constants.tsx`
- Update app name in `manifest.json`

### Game Settings
- Adjust difficulty timers in `constants.tsx`
- Modify sparkies rewards in `DIFFICULTY_CONFIG`
- Customize badge thresholds in `BADGES`

---

## 🐛 Known Issues

- Tailwind CDN warning in development (use PostCSS for production)
- WebSocket errors from Vite HMR (normal in development)
- Service Worker cache issues (clear with Ctrl+Shift+R)

See `docs/FINAL_ERROR_RESOLUTION.md` for detailed troubleshooting.

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support

For issues and questions:
- Check the `/docs` folder for detailed documentation
- Review `docs/FINAL_ERROR_RESOLUTION.md` for common issues
- Open an issue on GitHub

---

## 🙏 Acknowledgments

- Google Gemini AI for word generation
- Firebase for backend services
- Tailwind CSS for styling
- React team for the amazing framework

---

<div align="center">

**Made with ❤️ for elementary students learning to spell**

⭐ Star this repo if you find it helpful!

</div>
