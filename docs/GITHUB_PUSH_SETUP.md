# 🔐 GitHub Push Setup - Login Required

**Date:** February 14, 2026  
**Purpose:** Ensure user is logged in before pushing to GitHub

---

## Overview

This guide explains how to set up your repository so that you must be logged in to GitHub before pushing changes.

---

## Method 1: Using Git Credential Manager (Recommended)

### Windows Setup

1. **Install Git Credential Manager** (usually comes with Git for Windows)
   ```bash
   git credential-manager version
   ```

2. **Configure Git to use credential manager**
   ```bash
   git config --global credential.helper manager-core
   ```

3. **Set your GitHub username**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

4. **First push will prompt for login**
   ```bash
   git push origin main
   ```
   - A browser window will open
   - Login to GitHub
   - Authorize Git Credential Manager
   - Credentials will be saved securely

---

## Method 2: Using Personal Access Token (PAT)

### Step 1: Create a Personal Access Token

1. Go to GitHub.com
2. Click your profile picture → Settings
3. Scroll down → Developer settings
4. Personal access tokens → Tokens (classic)
5. Generate new token (classic)
6. Give it a name: "Mastering Words Dev"
7. Select scopes:
   - ✅ repo (all)
   - ✅ workflow
8. Click "Generate token"
9. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Configure Git to Use Token

```bash
# Set remote URL with token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git

# Or set it in credential helper
git config --global credential.helper store
```

### Step 3: First Push

```bash
git push origin main
```
- Username: your GitHub username
- Password: paste your Personal Access Token

---

## Method 3: Using SSH Keys (Most Secure)

### Step 1: Generate SSH Key

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Press Enter to accept default location
# Enter a passphrase (optional but recommended)
```

### Step 2: Add SSH Key to SSH Agent

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add your SSH key
ssh-add ~/.ssh/id_ed25519
```

### Step 3: Add SSH Key to GitHub

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. Go to GitHub.com
3. Settings → SSH and GPG keys
4. New SSH key
5. Paste your public key
6. Save

### Step 4: Change Remote URL to SSH

```bash
# Change from HTTPS to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
```

### Step 5: Test Connection

```bash
ssh -T git@github.com
```

---

## Pre-Push Checklist Script

I've created a script to check if you're logged in before pushing.

### Create Pre-Push Hook

```bash
# Navigate to your repo
cd masteringword-main

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create pre-push hook (see PUSH_CHECKLIST.bat)
```

---

## Verification Steps

### Check if you're logged in:

```bash
# Check credential helper
git config --global credential.helper

# Check stored credentials
git credential fill
protocol=https
host=github.com

# Press Enter twice
```

### Test push without changes:

```bash
# This will verify authentication
git push origin main --dry-run
```

---

## Common Issues & Solutions

### Issue 1: "Authentication failed"
**Solution:**
```bash
# Clear stored credentials
git credential reject
protocol=https
host=github.com

# Press Enter twice, then try pushing again
git push origin main
```

### Issue 2: "Permission denied (publickey)"
**Solution:**
```bash
# Check SSH key is added
ssh-add -l

# If not, add it
ssh-add ~/.ssh/id_ed25519
```

### Issue 3: "remote: Support for password authentication was removed"
**Solution:**
- You must use a Personal Access Token or SSH key
- Password authentication no longer works on GitHub
- Follow Method 2 or Method 3 above

---

## Recommended Workflow

### Before Pushing:

1. **Check your identity:**
   ```bash
   git config user.name
   git config user.email
   ```

2. **Check remote URL:**
   ```bash
   git remote -v
   ```

3. **Verify authentication:**
   ```bash
   git push origin main --dry-run
   ```

4. **If successful, push:**
   ```bash
   git push origin main
   ```

---

## Security Best Practices

1. ✅ **Never commit tokens or passwords** to the repository
2. ✅ **Use SSH keys** for the most secure authentication
3. ✅ **Enable 2FA** on your GitHub account
4. ✅ **Rotate tokens** every 90 days
5. ✅ **Use different tokens** for different projects
6. ✅ **Revoke unused tokens** immediately

---

## Quick Commands Reference

### Check if logged in:
```bash
git config --list | grep user
```

### Login with credential manager:
```bash
git credential fill
protocol=https
host=github.com
```

### Clear credentials:
```bash
git credential reject
protocol=https
host=github.com
```

### Test SSH connection:
```bash
ssh -T git@github.com
```

### Check remote URL:
```bash
git remote get-url origin
```

---

## Automated Login Check

I've created a batch script that checks if you're logged in before pushing.

See: `PUSH_CHECKLIST.bat`

Usage:
```bash
# Instead of: git push origin main
# Use: PUSH_CHECKLIST.bat
```

---

## Files Created

1. ✅ `docs/GITHUB_PUSH_SETUP.md` - This guide
2. ✅ `PUSH_CHECKLIST.bat` - Pre-push verification script
3. ✅ `QUICK_PUSH.bat` - Quick push with login check

---

## Next Steps

1. Choose your authentication method (SSH recommended)
2. Set up authentication following the steps above
3. Test with a dry-run push
4. Use the provided scripts for easy pushing

---

**Status:** ✅ Setup Guide Complete  
**Recommended Method:** SSH Keys (Method 3)  
**Security Level:** High
