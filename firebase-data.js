// ===================================
// FIREBASE DATA MANAGEMENT
// ===================================

// ===================================
// HABIT DATA OPERATIONS
// ===================================

/**
 * Save habit data to Firebase Firestore
 * @param {string} userId - User ID
 * @param {object} habitData - Habit data to save
 */
async function saveHabitsToFirebase(userId, habitData) {
    try {
        if (!userId || !firebase.firestore) {
            console.error('Firebase not initialized or user not logged in');
            return false;
        }

        await firebase.firestore()
            .collection('users')
            .doc(userId)
            .collection('habitData')
            .doc('current')
            .set({
                habits: habitData.habits || [],
                habitLogs: habitData.habitLogs || {},
                currentMonth: habitData.currentMonth,
                currentYear: habitData.currentYear,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

        console.log('Habits saved to Firebase successfully');
        return true;
    } catch (error) {
        console.error('Error saving habits to Firebase:', error);
        return false;
    }
}

/**
 * Load habit data from Firebase Firestore
 * @param {string} userId - User ID
 * @returns {object|null} - Habit data or null
 */
async function loadHabitsFromFirebase(userId) {
    try {
        if (!userId || !firebase.firestore) {
            console.error('Firebase not initialized or user not logged in');
            return null;
        }

        const doc = await firebase.firestore()
            .collection('users')
            .doc(userId)
            .collection('habitData')
            .doc('current')
            .get();

        if (doc.exists) {
            const data = doc.data();
            console.log('Habits loaded from Firebase successfully');
            return {
                habits: data.habits || [],
                habitLogs: data.habitLogs || {},
                currentMonth: data.currentMonth ?? new Date().getMonth(),
                currentYear: data.currentYear ?? new Date().getFullYear()
            };
        } else {
            console.log('No habit data found in Firebase');
            return null;
        }
    } catch (error) {
        console.error('Error loading habits from Firebase:', error);
        return null;
    }
}

/**
 * Sync localStorage data to Firebase (for migration)
 * @param {string} userId - User ID
 */
async function migrateLocalStorageToFirebase(userId) {
    try {
        const STORAGE_KEY = 'habitgrid_data';
        const localData = localStorage.getItem(STORAGE_KEY);

        if (localData) {
            // Check if already migrated for this user
            const migrationKey = `habitgrid_migrated_${userId}`;
            if (localStorage.getItem(migrationKey)) {
                console.log('Data already migrated for this user');
                return true;
            }

            const data = JSON.parse(localData);
            console.log('Migrating localStorage data to Firebase...');

            const success = await saveHabitsToFirebase(userId, data);

            if (success) {
                console.log('Migration successful!');
                localStorage.setItem(migrationKey, 'true');
            }

            return success;
        } else {
            console.log('No localStorage data to migrate');
            return true;
        }
    } catch (error) {
        console.error('Error migrating data:', error);
        return false;
    }
}

/**
 * Real-time listener for habit data changes
 * @param {string} userId - User ID
 * @param {function} callback - Callback function to handle data updates
 */
function listenToHabitChanges(userId, callback) {
    if (!userId || !firebase.firestore) {
        console.error('Firebase not initialized or user not logged in');
        return null;
    }

    return firebase.firestore()
        .collection('users')
        .doc(userId)
        .collection('habitData')
        .doc('current')
        .onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                callback({
                    habits: data.habits || [],
                    habitLogs: data.habitLogs || {},
                    currentMonth: data.currentMonth ?? new Date().getMonth(),
                    currentYear: data.currentYear ?? new Date().getFullYear()
                });
            }
        }, (error) => {
            console.error('Error listening to habit changes:', error);
        });
}

// ===================================
// EXPORT FUNCTIONS
// ===================================

window.saveHabitsToFirebase = saveHabitsToFirebase;
window.loadHabitsFromFirebase = loadHabitsFromFirebase;
window.migrateLocalStorageToFirebase = migrateLocalStorageToFirebase;
window.listenToHabitChanges = listenToHabitChanges;

console.log('%c💾 Firebase Data Management', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
console.log('%cFirebase data functions loaded', 'color: #666; font-size: 12px;');
