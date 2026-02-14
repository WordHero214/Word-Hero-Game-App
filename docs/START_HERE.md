# 🚀 START HERE - Quick Setup Guide

## Welcome to Mastering Words!

This is your quick start guide to get the app running.

---

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your API Key
Edit `.env.local` and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run Locally
```bash
npm run dev
```

### 4. Open Browser
Navigate to: `http://localhost:3000`

---

## 🔑 Admin Login

**Email**: `admin@wordhero.com`  
**Password**: (set in Firebase Console)

**Note**: You need to create this admin account in Firebase first!

---

## 📚 Important Documents

### Must Read First
1. **README.md** - Complete project overview
2. **docs/DEPLOYMENT_GUIDE.md** - How to deploy
3. **FINAL_CHECKLIST.md** - Pre-deployment checklist

### Quick References
- **CHANGES_SUMMARY.md** - What was changed
- **docs/FIREBASE_MIGRATION_COMPLETE.md** - Firebase setup details
- **docs/QUICKSTART.md** - Detailed quick start

---

## 🔥 Firebase Setup Required

Before the app works, you need to:

### 1. Enable Authentication
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select `word-hero-8143e` project
- Enable Email/Password authentication

### 2. Create Firestore Database
- Create database in production mode
- Choose your region

### 3. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### 4. Create Admin Account
In Firestore, create:
- Collection: `users`
- Document ID: `4xym5a87V6MPAXz5byttspmBAG2`
- Fields:
  ```json
  {
    "email": "admin@wordhero.com",
    "id": "4xym5a87V6MPAXz5byttspmBAG2",
    "name": "Admin Controller",
    "role": "ADMIN",
    "username": "admin"
  }
  ```

Then in Authentication, create user with:
- Email: `admin@wordhero.com`
- Password: (your choice)
- UID: Must match Firestore document ID

---

## 📁 Project Structure

```
masteringword-main/
├── docs/              # 📚 All documentation (87 files)
├── logo/              # 🎨 App icons
├── music/             # 🎵 Audio files
├── public/            # 📦 Static assets
├── src/               # 💻 Source code
├── .env.local         # 🔐 Your API keys (not committed)
├── firebase.ts        # 🔥 Firebase config
├── README.md          # 📖 Main documentation
└── START_HERE.md      # 👈 You are here!
```

---

## ✅ Quick Test

After setup, test these:

1. **Login**: Use admin credentials
2. **Create Teacher**: Admin → Create teacher account
3. **Add Words**: Teacher → Word Bank → Add words
4. **Register Student**: Logout → Register as student
5. **Play Game**: Student → Play → Easy level

---

## 🆘 Need Help?

### Common Issues

**"Firebase not initialized"**
→ Check `firebase.ts` configuration

**"API key invalid"**
→ Check `.env.local` has correct Gemini API key

**"Admin can't login"**
→ Create admin account in Firebase (see above)

**"No words appearing"**
→ Teachers need to add words first

### Documentation

- **All docs**: `/docs` folder (87 files)
- **Troubleshooting**: `docs/FINAL_ERROR_RESOLUTION.md`
- **Deployment**: `docs/DEPLOYMENT_GUIDE.md`

---

## 🎯 Next Steps

1. ✅ Complete Firebase setup (see above)
2. ✅ Test locally (`npm run dev`)
3. ✅ Read `FINAL_CHECKLIST.md`
4. ✅ Follow `docs/DEPLOYMENT_GUIDE.md` to deploy

---

## 📞 Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Firebase
firebase deploy
```

---

## 🎉 You're Ready!

Follow the steps above and you'll be up and running in minutes.

For detailed information, read **README.md** and **docs/DEPLOYMENT_GUIDE.md**.

**Good luck! 🚀**

---

**Project**: Mastering Words  
**Version**: 1.0.0  
**Firebase**: word-hero-8143e  
**Status**: Ready for deployment ✅
