# 🔒 Security Guide for HabitGrid

## ⚠️ IMPORTANT: Before Pushing to Git

Your Firebase configuration contains sensitive information that should **NOT** be committed to Git.

---

## 🛡️ What We've Done to Secure Your Project

### 1. Created `.gitignore`
The `.gitignore` file prevents sensitive files from being committed:
- ✅ `firebase-config.js` (your actual config)
- ✅ Environment files
- ✅ Local development files

### 2. Created `firebase-config.example.js`
- ✅ Template file with placeholder values
- ✅ Safe to commit to Git
- ✅ Shows other developers what they need

---

## 📋 Before You Push to Git - Checklist

### ✅ Step 1: Verify .gitignore
```bash
# Check if .gitignore exists
ls -la .gitignore

# View contents
cat .gitignore
```

### ✅ Step 2: Check What Will Be Committed
```bash
# See what files will be added
git status

# Make sure firebase-config.js is NOT listed
# It should show as "ignored"
```

### ✅ Step 3: Test Git Ignore
```bash
# Add all files
git add .

# Check status again
git status

# firebase-config.js should NOT appear in the list
```

### ✅ Step 4: If firebase-config.js Was Already Committed

If you previously committed `firebase-config.js`, remove it from Git history:

```bash
# Remove from Git tracking (keeps local file)
git rm --cached firebase-config.js

# Commit the removal
git commit -m "Remove sensitive Firebase config from Git"

# Now it will be ignored
```

---

## 🔐 Firebase API Key Security - Important Facts

### ✅ Your Firebase API Key is "Safe" to Expose

**Wait, what?** Yes, Firebase API keys are designed to be public! Here's why:

1. **Not a Secret Key**: Firebase API keys are just identifiers
2. **Security is in Rules**: Protection comes from Firestore security rules
3. **Domain Restrictions**: You can restrict which domains can use your API key
4. **Expected to be Public**: They're meant to be in client-side code

### 🛡️ Real Security Comes From:

1. **Firestore Security Rules** ✅ (Already configured)
2. **Authentication** ✅ (Already implemented)
3. **Domain Restrictions** (Optional, recommended for production)
4. **App Check** (Optional, prevents abuse)

---

## 🔒 Additional Security Measures

### 1. Enable Domain Restrictions (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** > **Credentials**
4. Find your API key
5. Click **Edit**
6. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your domains:
     ```
     http://localhost:*
     https://yourdomain.com/*
     ```
7. Save

### 2. Enable Firebase App Check (Production)

App Check helps protect your backend resources from abuse.

```javascript
// Add to firebase-config.js (after initialization)
const appCheck = firebase.appCheck();
appCheck.activate(
  'YOUR_RECAPTCHA_SITE_KEY',
  true // Use reCAPTCHA v3
);
```

### 3. Monitor Usage

1. Go to Firebase Console
2. Check **Usage** tab regularly
3. Set up billing alerts
4. Monitor for unusual activity

---

## 📝 Firestore Security Rules (Already Configured)

Your current rules are secure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /habitData/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

**What this means:**
- ✅ Users must be authenticated
- ✅ Users can only read/write their own data
- ✅ No one can access other users' data
- ✅ Unauthenticated users have no access

---

## 🚀 Safe Git Workflow

### Initial Setup
```bash
# Initialize git (if not already done)
git init

# Add .gitignore first
git add .gitignore
git commit -m "Add .gitignore"

# Add example config
git add firebase-config.example.js
git commit -m "Add Firebase config example"

# Add all other files
git add .
git commit -m "Initial commit"
```

### Push to GitHub
```bash
# Add remote
git remote add origin https://github.com/yourusername/habitgrid.git

# Push
git push -u origin main
```

---

## 👥 For Other Developers (README Instructions)

Add this to your README.md:

```markdown
## 🔧 Setup for Developers

1. Clone the repository
2. Copy `firebase-config.example.js` to `firebase-config.js`
3. Get Firebase credentials from project admin
4. Update `firebase-config.js` with actual values
5. Open `index.html` in browser
```

---

## ⚠️ What NOT to Commit

### ❌ Never Commit:
- `firebase-config.js` (actual config)
- `.env` files
- Private keys
- Service account JSON files
- Database credentials
- OAuth secrets

### ✅ Safe to Commit:
- `firebase-config.example.js` (template)
- All HTML, CSS, JS files (except config)
- Documentation
- `.gitignore`
- Public assets

---

## 🔍 How to Check if You're Safe

### Before Pushing:
```bash
# 1. Check git status
git status

# 2. Check what will be committed
git diff --cached

# 3. Verify firebase-config.js is ignored
git check-ignore firebase-config.js
# Should output: firebase-config.js

# 4. List all tracked files
git ls-files
# firebase-config.js should NOT be in this list
```

---

## 🆘 Emergency: I Already Pushed Sensitive Data!

### Option 1: Remove from Latest Commit
```bash
# If you just pushed
git rm --cached firebase-config.js
git commit --amend -m "Remove sensitive config"
git push --force
```

### Option 2: Rotate Your Keys (Recommended)
1. Go to Firebase Console
2. Create a new web app
3. Get new configuration
4. Update your local `firebase-config.js`
5. Delete the old web app

### Option 3: Use BFG Repo-Cleaner (Nuclear Option)
For completely removing from Git history:
```bash
# Install BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# Remove file from history
bfg --delete-files firebase-config.js

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force
```

---

## 📊 Security Checklist

Before going to production:

- [ ] `.gitignore` includes `firebase-config.js`
- [ ] Firestore security rules are configured
- [ ] Firebase Authentication is enabled
- [ ] Domain restrictions are set (optional but recommended)
- [ ] App Check is enabled (optional but recommended)
- [ ] Billing alerts are configured
- [ ] Usage is being monitored
- [ ] Test mode is disabled (Firestore rules)
- [ ] Email verification is enabled (optional)
- [ ] Password requirements are enforced

---

## 🎯 Summary

### ✅ What's Secure Now:
1. Firebase config is gitignored
2. Example config file for other developers
3. Firestore rules protect user data
4. Authentication is required
5. User data is isolated

### 🔒 Additional Steps (Optional):
1. Enable domain restrictions
2. Enable App Check
3. Set up monitoring
4. Configure billing alerts

### 📝 Remember:
- Firebase API keys are meant to be public
- Real security is in Firestore rules
- Always use `.gitignore`
- Monitor your usage

---

## 📚 Resources

- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Google Cloud API Security](https://cloud.google.com/docs/authentication)
- [Git Secrets Prevention](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)

---

**You're now ready to safely push to Git!** 🎉

Just make sure to follow the checklist above before pushing.
