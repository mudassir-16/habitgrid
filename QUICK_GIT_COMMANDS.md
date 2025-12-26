# 🚀 Quick Commands - Push to Git

## Copy and paste these commands in order:

### 1. Initialize Git
```bash
cd "e:\MUDASSIR\PROJECTS\Mudassir\1"
git init
```

### 2. Configure Git (if not already done)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Add All Files
```bash
git add .
```

### 4. Check Status (Verify firebase-config.js is NOT listed)
```bash
git status
```

### 5. Create Initial Commit
```bash
git commit -m "Initial commit: HabitGrid with Firebase integration"
```

### 6. Create GitHub Repository
- Go to: https://github.com/new
- Repository name: habitgrid (or your choice)
- Description: A beautiful habit tracking app with Firebase
- Public or Private: Your choice
- Do NOT initialize with README
- Click "Create repository"

### 7. Add Remote (Replace YOUR_USERNAME)
```bash
git remote add origin https://github.com/YOUR_USERNAME/habitgrid.git
```

### 8. Rename Branch to Main (if needed)
```bash
git branch -M main
```

### 9. Push to GitHub
```bash
git push -u origin main
```

---

## ✅ Verification

After pushing, check on GitHub that:
- ✅ firebase-config.example.js IS there
- ❌ firebase-config.js is NOT there
- ✅ All other files are present

---

## 🔄 Future Updates

When you make changes:
```bash
git add .
git commit -m "Description of your changes"
git push
```

---

## 🆘 If firebase-config.js Was Accidentally Committed

```bash
git rm --cached firebase-config.js
git commit -m "Remove sensitive Firebase config"
git push
```

---

## 📝 Notes

- Your actual Firebase config (firebase-config.js) stays LOCAL only
- The example file (firebase-config.example.js) goes to GitHub
- .gitignore protects your sensitive data
- Other developers will copy the example and add their own config
