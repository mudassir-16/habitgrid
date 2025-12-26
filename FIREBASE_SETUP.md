# Firebase Setup Guide for HabitGrid

## 🔥 Firebase Integration Complete!

Your HabitGrid application is now ready to use Firebase for authentication and data storage. Follow these steps to complete the setup.

---

## 📋 Prerequisites

1. A Google account
2. Internet connection
3. Your HabitGrid project files

---

## 🚀 Step-by-Step Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `HabitGrid` (or your preferred name)
4. (Optional) Enable Google Analytics
5. Click **"Create project"**
6. Wait for the project to be created

### Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Register app with nickname: `HabitGrid Web App`
3. **Do NOT** check "Also set up Firebase Hosting" (unless you want to deploy)
4. Click **"Register app"**
5. You'll see your Firebase configuration object - **KEEP THIS PAGE OPEN**

### Step 3: Copy Your Firebase Configuration

1. From the Firebase Console, copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

2. Open `firebase-config.js` in your project
3. **Replace** the placeholder configuration with your actual configuration:

```javascript
// REPLACE THIS SECTION
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",              // ← Replace with your actual values
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

4. Save the file

### Step 4: Enable Firebase Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. **Enable** the Email/Password provider
6. Click **"Save"**

### Step 5: Set Up Cloud Firestore

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - **Note**: This allows read/write access for 30 days. You'll need to update security rules for production.
4. Select a Cloud Firestore location (choose closest to your users)
5. Click **"Enable"**

### Step 6: Configure Firestore Security Rules (Important!)

1. In Firestore Database, go to **Rules** tab
2. Replace the default rules with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User's habit data subcollection
      match /habitData/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **"Publish"**

---

## ✅ Testing Your Setup

### Test 1: Check Firebase Connection

1. Open your project in a browser
2. Open Developer Console (F12)
3. You should see:
   - `🔥 Firebase Connected`
   - `Firebase initialized successfully`

### Test 2: Register a New User

1. Go to `auth.html`
2. Click "Register here"
3. Fill in the registration form
4. Click "Create Account"
5. You should be redirected to the main app

### Test 3: Verify Data in Firebase

1. Go to Firebase Console → **Authentication**
2. You should see your new user in the **Users** tab
3. Go to **Firestore Database**
4. You should see a `users` collection with your user document
5. Inside your user document, there should be a `habitData` subcollection

### Test 4: Test Logout and Login

1. Click the **Logout** button
2. You should be redirected to `auth.html`
3. Log in with your credentials
4. You should see your habits data preserved

---

## 🗂️ Firebase Data Structure

### Authentication
- Users are stored in **Firebase Authentication**
- Each user has a unique `uid`

### Firestore Database Structure
```
users (collection)
  └── {userId} (document)
      ├── name: "User Name"
      ├── email: "user@example.com"
      ├── createdAt: timestamp
      └── updatedAt: timestamp
      └── habitData (subcollection)
          └── current (document)
              ├── habits: [array of habit objects]
              ├── habitLogs: {object of habit completions}
              ├── currentMonth: number
              ├── currentYear: number
              └── updatedAt: timestamp
```

---

## 🔒 Security Best Practices

### For Development
- ✅ Test mode is fine for development
- ✅ Keep your Firebase config public (it's safe)
- ✅ Security rules protect your data

### For Production
1. **Update Firestore Rules** to production-ready rules
2. **Enable App Check** to prevent abuse
3. **Set up billing alerts** in Google Cloud Console
4. **Monitor usage** in Firebase Console
5. **Enable reCAPTCHA** for authentication

### Production Firestore Rules Example
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.data.keys().hasAll(['name', 'email']) &&
                      request.resource.data.email is string &&
                      request.resource.data.name is string;
      
      match /habitData/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## 🎯 Features Enabled

### ✅ Firebase Authentication
- Email/password registration
- Secure login
- Session management
- Logout functionality

### ✅ Cloud Firestore
- Real-time data sync
- Automatic data backup
- Cross-device synchronization
- Offline support (built-in)

### ✅ Data Migration
- Automatic migration from localStorage to Firebase
- Backward compatibility with localStorage
- Seamless transition for existing users

---

## 🐛 Troubleshooting

### Issue: "Firebase not initialized"
**Solution**: Make sure you've replaced the placeholder config in `firebase-config.js`

### Issue: "Permission denied" errors
**Solution**: Check your Firestore security rules and ensure they match the rules above

### Issue: Can't register users
**Solution**: Verify Email/Password authentication is enabled in Firebase Console

### Issue: Data not saving to Firebase
**Solution**: 
1. Check browser console for errors
2. Verify Firestore is enabled
3. Check security rules

### Issue: "Network error"
**Solution**: 
1. Check internet connection
2. Verify Firebase project is active
3. Check if you've exceeded free tier limits

---

## 📊 Firebase Free Tier Limits

- **Authentication**: 10,000 verifications/month (plenty for personal use)
- **Firestore**: 
  - 1 GB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day

**Note**: These limits are more than enough for personal use and small teams!

---

## 🚀 Next Steps

1. ✅ Complete Firebase setup (follow steps above)
2. ✅ Test registration and login
3. ✅ Create some habits and verify they save to Firebase
4. 📱 (Optional) Deploy to Firebase Hosting
5. 🎨 (Optional) Customize your app further

---

## 📱 Optional: Deploy to Firebase Hosting

Want to make your app accessible online?

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy
```

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all steps in this guide
3. Check Firebase Console for any alerts
4. Review the Firestore security rules

---

## 🎉 Congratulations!

Your HabitGrid app is now powered by Firebase! Enjoy:
- ☁️ Cloud storage
- 🔒 Secure authentication
- 📱 Cross-device sync
- 💾 Automatic backups

Happy habit tracking! 🎯
