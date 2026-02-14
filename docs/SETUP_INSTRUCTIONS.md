# 🚀 Mastering Words - Setup Instructions

## ⚠️ Important: Required Configuration

Before running the application, you need to configure two essential services:

---

## 1. 🔑 Gemini API Key Setup

The AI word generation feature requires a valid Gemini API key.

### Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Configure the API Key

Open `masteringword-main/.env.local` and replace the placeholder:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Example:**
```env
VITE_GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Restart Development Server

After updating the API key:
```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

---

## 2. 🔥 Firebase Configuration

You need to set up Firebase for authentication and database.

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "mastering-words")
4. Follow the setup wizard

### Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method

### Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add rules later)
4. Select a location close to your users

### Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click the web icon (</>)
4. Register your app
5. Copy the configuration values

### Update .env.local

Add your Firebase configuration to `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Deploy Firestore Rules

1. In Firebase Console, go to "Firestore Database"
2. Click "Rules" tab
3. Copy the content from `firestore.rules`
4. Paste and publish

---

## 3. 🎨 Tailwind CSS (Optional - For Production)

The app currently uses Tailwind CDN for quick development. For production, you should install Tailwind properly.

### Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configure Tailwind

Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
        display: ['Fredoka', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Create CSS File

Create `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans bg-[#f0f9ff];
  }
  
  h1, h2, h3, h4 {
    @apply font-display;
  }
}

@layer utilities {
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
}
```

### Update index.html

Remove the CDN script and add the CSS import in your main file instead.

---

## 4. 📦 Installation

```bash
cd masteringword-main
npm install
```

---

## 5. 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

---

## 6. 👥 Creating Initial Users

### Create Admin Account

1. Run the app
2. Click "Sign Up"
3. Use email with "admin" in it (e.g., `admin@school.com`)
4. Fill in details
5. Sign up

### Create Teacher Account

1. Login as Admin
2. Go to Admin Dashboard
3. Click "Create Teacher Account"
4. Fill in teacher details
5. Teacher can now login

### Create Student Account

1. Click "Sign Up"
2. Use regular email (e.g., `student@school.com`)
3. Select "Student" role
4. Fill in grade level and section
5. Sign up

---

## 7. ✅ Verification Checklist

After setup, verify everything works:

### Firebase Connection
- [ ] Can sign up new users
- [ ] Can login with existing users
- [ ] User data persists after refresh
- [ ] No Firebase errors in console

### Gemini API
- [ ] Can open Word Generator
- [ ] Can generate words successfully
- [ ] Generated words appear in word bank
- [ ] No API key errors

### Student Features
- [ ] Can play games
- [ ] Sparkies are earned
- [ ] Progress is saved
- [ ] Leaderboard shows data
- [ ] Streak tracking works

### Teacher Features
- [ ] Can view student list
- [ ] Can add/edit/delete words
- [ ] Can view student analytics
- [ ] Dashboard shows statistics

### Admin Features
- [ ] Can create teacher accounts
- [ ] Admin stays logged in after creating teacher
- [ ] User directory displays

---

## 8. 🐛 Troubleshooting

### "API key not valid" Error

**Problem:** Gemini API key is not configured or invalid

**Solution:**
1. Get a valid API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Update `.env.local` with the correct key
3. Restart the development server
4. Clear browser cache if needed

### Firebase Connection Errors

**Problem:** Firebase not configured or wrong credentials

**Solution:**
1. Verify all Firebase environment variables in `.env.local`
2. Check Firebase Console for correct values
3. Ensure Authentication and Firestore are enabled
4. Deploy Firestore security rules

### "Cannot read properties of undefined"

**Problem:** User data not loading from Firebase

**Solution:**
1. Check Firestore security rules are deployed
2. Verify user document exists in Firestore
3. Check browser console for specific errors
4. Try logging out and back in

### Words Not Appearing

**Problem:** No words in the database

**Solution:**
1. Login as Teacher or Admin
2. Use Word Generator to create words
3. Or manually add words in Word Bank
4. Refresh the page

### Tailwind Styles Not Working

**Problem:** CDN warning or styles not applying

**Solution:**
1. For development: CDN is fine, ignore the warning
2. For production: Follow Tailwind CSS setup above
3. Ensure index.html has the CDN script
4. Clear browser cache

---

## 9. 📊 Default Data

### Initial Words

The app includes 30 default words:
- 10 Easy words (with hints)
- 10 Medium words
- 10 Hard words (with scenarios)

These are used if no words exist in Firebase.

### Badges & Achievements

Pre-configured badges and achievements:
- 13 badges (first game, streaks, mastery, etc.)
- 5 achievements (perfect scores, streaks, etc.)

---

## 10. 🔐 Security Notes

### Environment Variables

**Never commit `.env.local` to version control!**

It's already in `.gitignore`, but double-check:
```bash
# .gitignore should contain:
.env.local
.env*.local
```

### API Keys

- Keep your Gemini API key private
- Set usage limits in Google Cloud Console
- Monitor API usage regularly

### Firebase Security

- Deploy Firestore security rules
- Use strong passwords for accounts
- Enable 2FA for Firebase Console
- Regularly review Firebase usage

---

## 11. 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist` folder.

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

---

## 12. 📞 Support

### Common Issues

**Q: Word Generator not working?**
A: Check Gemini API key in `.env.local` and restart server

**Q: Can't login?**
A: Verify Firebase configuration and check console for errors

**Q: Data not saving?**
A: Check Firestore security rules are deployed

**Q: Styles look broken?**
A: Ensure Tailwind CDN script is in index.html

### Getting Help

1. Check browser console (F12) for errors
2. Review Firebase Console for issues
3. Verify all environment variables are set
4. Check the documentation files in the project

---

## 13. 🎯 Quick Start Summary

**Minimum Required Steps:**

1. **Get Gemini API Key** → Update `.env.local`
2. **Setup Firebase Project** → Update `.env.local`
3. **Install Dependencies** → `npm install`
4. **Run Development Server** → `npm run dev`
5. **Create Admin Account** → Sign up with admin email
6. **Generate Words** → Use Word Generator or add manually
7. **Start Playing!** → Create student accounts and play

---

## 14. 📚 Additional Resources

### Documentation Files
- `PROJECT_STATUS.md` - Complete feature list
- `FIREBASE_SETUP.md` - Detailed Firebase guide
- `AI_WORD_GENERATION_GUIDE.md` - AI integration details
- `TEACHER_IMPLEMENTATION_COMPLETE.md` - Teacher features
- `FEATURES_GUIDE.md` - Student features

### External Links
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

## ✅ Setup Complete!

Once you've completed these steps, your Mastering Words application will be fully functional and ready to use!

**Happy Teaching and Learning! 🎓✨**
