# 🚀 Quick Start - Push to GitHub

**For:** First-time GitHub push  
**Time:** 5-10 minutes  
**Status:** Ready to use

---

## Step 1: Set Up Git (One-time setup)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify it worked
git config --list | grep user
```

---

## Step 2: Choose Authentication Method

### Option A: Git Credential Manager (Easiest) ⭐

```bash
# Enable credential manager
git config --global credential.helper manager-core

# First push will open browser for login
git push origin main
```

### Option B: Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select: `repo` and `workflow`
4. Copy the token
5. Use it as password when pushing

### Option C: SSH Keys (Most Secure)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: https://github.com/settings/keys
```

---

## Step 3: Test Your Setup

```bash
# Navigate to project
cd masteringword-main

# Test authentication (dry-run)
git push origin main --dry-run
```

If successful, you'll see: `Everything up-to-date` or similar message.

---

## Step 4: Push Your Changes

### Method 1: Use the Checklist Script (Recommended)

```bash
PUSH_CHECKLIST.bat
```

This will:
- ✅ Check your configuration
- ✅ Verify authentication
- ✅ Show uncommitted changes
- ✅ Guide you through the push

### Method 2: Quick Push

```bash
QUICK_PUSH.bat
```

Enter your commit message and it handles the rest!

### Method 3: Manual Push

```bash
# Add all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

---

## Common Issues & Quick Fixes

### Issue: "Authentication failed"

**Fix:**
```bash
# Clear credentials
git credential reject
protocol=https
host=github.com

# Press Enter twice, then try again
git push origin main
```

### Issue: "Permission denied (publickey)"

**Fix:**
```bash
# Check if SSH key is added
ssh-add -l

# If not, add it
ssh-add ~/.ssh/id_ed25519
```

### Issue: "remote: Support for password authentication was removed"

**Fix:** You need to use a Personal Access Token or SSH key (not your GitHub password)

---

## Daily Workflow

### Making Changes and Pushing

```bash
# 1. Make your code changes
# 2. Run the quick push script
QUICK_PUSH.bat

# Or manually:
git add .
git commit -m "Description of changes"
git push origin main
```

---

## Verification Checklist

Before pushing, verify:

- [ ] Git user.name is set
- [ ] Git user.email is set
- [ ] Remote repository is configured
- [ ] Authentication works (dry-run succeeds)
- [ ] Changes are committed

**Use the script to check automatically:**
```bash
PUSH_CHECKLIST.bat
```

---

## Help & Documentation

- **Full Setup Guide:** `docs/GITHUB_PUSH_SETUP.md`
- **Organization Guide:** `docs/PROJECT_ORGANIZATION.md`
- **Troubleshooting:** `docs/ORGANIZATION_COMPLETE.md`

---

## Quick Commands

```bash
# Check configuration
git config --list

# Check remote
git remote -v

# Check status
git status

# Test authentication
git push origin main --dry-run

# Push changes
git push origin main
```

---

## Success!

Once you see:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/username/repo.git
   abc1234..def5678  main -> main
```

**You're done!** Your changes are on GitHub. 🎉

---

**Need Help?** See `docs/GITHUB_PUSH_SETUP.md` for detailed instructions.
