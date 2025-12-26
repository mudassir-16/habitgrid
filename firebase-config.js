// ===================================
// FIREBASE CONFIGURATION
// ===================================

// TODO: Replace with your Firebase project configuration
// Get this from Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
const firebaseConfig = {
    apiKey: "AIzaSyDk_6y9U1KtwZ6L6sFxwKDXBW-VhhzmWBQ",
    authDomain: "habitgrid-db418.firebaseapp.com",
    projectId: "habitgrid-db418",
    storageBucket: "habitgrid-db418.firebasestorage.app",
    messagingSenderId: "718764029006",
    appId: "1:718764029006:web:ae3ea337a910b7af013f1f"
};

// Initialize Firebase
let app, auth, db;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();

    // Enable offline persistence
    db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Persistence failed: Multiple tabs open');
        } else if (err.code == 'unimplemented') {
            console.warn('Persistence not supported by browser');
        }
    });

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
