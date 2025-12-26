// ===================================
// FIREBASE CONFIGURATION EXAMPLE
// ===================================

// INSTRUCTIONS:
// 1. Copy this file and rename it to: firebase-config.js
// 2. Replace the placeholder values with your actual Firebase config
// 3. Get your config from: Firebase Console > Project Settings > Your apps

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, auth, db;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();

    console.log('%c🔥 Firebase Connected', 'color: #FFA000; font-size: 16px; font-weight: bold;');
    console.log('%cFirebase initialized successfully', 'color: #4CAF50; font-size: 12px;');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// ===================================
// FIREBASE HELPER FUNCTIONS
// ===================================

// Get current user
function getCurrentUser() {
    return auth.currentUser;
}

// Check if user is authenticated
function isAuthenticated() {
    return auth.currentUser !== null;
}

// Get user document from Firestore
async function getUserDocument(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user document:', error);
        return null;
    }
}

// Create user document in Firestore
async function createUserDocument(userId, userData) {
    try {
        await db.collection('users').doc(userId).set({
            name: userData.name,
            email: userData.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error creating user document:', error);
        return false;
    }
}

// Export for use in other files
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.getUserDocument = getUserDocument;
window.createUserDocument = createUserDocument;
