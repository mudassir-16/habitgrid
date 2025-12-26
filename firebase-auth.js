// ===================================
// FIREBASE AUTHENTICATION SYSTEM
// ===================================

const SESSION_KEY = 'habitgrid_session';

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize immediately
    if (typeof firebase !== 'undefined' && firebase.auth) {
        checkFirebaseSession();
        attachAuthListeners();
    } else {
        // Fallback or retry if firebase takes a moment (happens with slow CDNs)
        let retryCount = 0;
        const retry = setInterval(() => {
            if (typeof firebase !== 'undefined' && firebase.auth) {
                clearInterval(retry);
                checkFirebaseSession();
                attachAuthListeners();
            } else if (retryCount++ > 10) {
                clearInterval(retry);
                console.error('Firebase failed to load after 5 seconds');
            }
        }, 500);
    }
});

// ===================================
// SESSION MANAGEMENT
// ===================================

function checkFirebaseSession() {
    // Firebase auth state listener
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, redirect to main app
                console.log('User detected, redirecting to app...');
                if (!window.location.href.includes('index.html')) {
                    window.location.href = 'index.html';
                }
            } else {
                // No user signed in, stay on auth page
                console.log('User signed out');
                // Ensure we are on auth.html if signed out
                if (!window.location.href.includes('auth.html')) {
                    window.location.href = 'auth.html';
                }
            }
        });
    } else {
        console.error('Firebase script not found');
    }
}

async function createSession(user) {
    try {
        // Get additional user data from Firestore
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        const userData = userDoc.exists ? userDoc.data() : {};

        const sessionData = {
            userId: user.uid,
            email: user.email,
            name: userData.name || user.displayName || user.email.split('@')[0],
            loginTime: new Date().toISOString()
        };

        // Store session in localStorage for backward compatibility
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

        return sessionData;
    } catch (error) {
        console.error('Error creating session:', error);
        return null;
    }
}

async function logout() {
    try {
        await firebase.auth().signOut();
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'auth.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    }
}

// ===================================
// REGISTRATION
// ===================================

async function registerUser(name, email, password) {
    try {
        // Create user with Firebase Authentication
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await user.updateProfile({
            displayName: name
        });

        // Create user document in Firestore
        await firebase.firestore().collection('users').doc(user.uid).set({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Create session
        await createSession(user);

        return {
            success: true,
            user: user,
            message: 'Account created successfully!'
        };
    } catch (error) {
        console.error('Registration error:', error);

        let message = 'Registration failed. Please try again.';

        switch (error.code) {
            case 'auth/email-already-in-use':
                message = 'An account with this email already exists';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address';
                break;
            case 'auth/weak-password':
                message = 'Password should be at least 6 characters';
                break;
            case 'auth/network-request-failed':
                message = 'Network error. Please check your connection.';
                break;
        }

        return {
            success: false,
            message: message
        };
    }
}

// ===================================
// LOGIN
// ===================================

async function loginUser(email, password) {
    try {
        // Sign in with Firebase Authentication
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Create session
        await createSession(user);

        return {
            success: true,
            user: user,
            message: 'Login successful!'
        };
    } catch (error) {
        console.error('Login error:', error);

        let message = 'Login failed. Please try again.';

        switch (error.code) {
            case 'auth/user-not-found':
                message = 'No account found with this email';
                break;
            case 'auth/wrong-password':
                message = 'Incorrect password';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address';
                break;
            case 'auth/user-disabled':
                message = 'This account has been disabled';
                break;
            case 'auth/network-request-failed':
                message = 'Network error. Please check your connection.';
                break;
        }

        return {
            success: false,
            message: message
        };
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

function attachAuthListeners() {
    // Toggle between login and register forms
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterForm();
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }

    // Login form submission
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    // Register form submission
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegister();
        });
    }
}

// ===================================
// FORM HANDLERS
// ===================================

function showLoginForm() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    clearErrors();
}

function showRegisterForm() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    clearErrors();
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showError('loginError', 'Please fill in all fields');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#loginFormElement button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    try {
        const result = await loginUser(email, password);

        if (result.success) {
            submitBtn.textContent = 'Success! Redirecting...';
            // Force redirect immediately for better response time
            window.location.href = 'index.html';
        } else {
            showError('loginError', result.message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        showError('loginError', 'System error during login. Please try again.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        showError('registerError', 'Please fill in all fields');
        return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
        showError('registerError', 'Passwords do not match');
        return;
    }

    // Validate password length
    if (password.length < 6) {
        showError('registerError', 'Password must be at least 6 characters long');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#registerFormElement button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;

    try {
        const result = await registerUser(name, email, password);

        if (result.success) {
            submitBtn.textContent = 'Success! Redirecting...';
            // Force redirect immediately
            window.location.href = 'index.html';
        } else {
            showError('registerError', result.message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        showError('registerError', 'System error during registration. Please try again.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ===================================
// UI HELPERS
// ===================================

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

// ===================================
// EXPORT FOR USE IN MAIN APP
// ===================================

// Make logout function available globally
window.logout = logout;

// Console welcome message
console.log('%c🔐 HabitGrid Auth (Firebase)', 'color: #0F766E; font-size: 18px; font-weight: bold;');
console.log('%cFirebase Authentication system loaded', 'color: #1E3A8A; font-size: 12px;');
