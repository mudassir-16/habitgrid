// ===================================
// AUTHENTICATION SYSTEM
// ===================================

const AUTH_STORAGE_KEY = 'habitgrid_users';
const SESSION_KEY = 'habitgrid_session';

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkSession();

    // Attach event listeners
    attachAuthListeners();
});

// ===================================
// SESSION MANAGEMENT
// ===================================

function checkSession() {
    const session = localStorage.getItem(SESSION_KEY);

    if (session) {
        const userData = JSON.parse(session);
        // Redirect to main app if already logged in
        window.location.href = 'index.html';
    }
}

function createSession(user) {
    const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'auth.html';
}

// ===================================
// USER MANAGEMENT
// ===================================

function getUsers() {
    const users = localStorage.getItem(AUTH_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===================================
// REGISTRATION
// ===================================

function registerUser(name, email, password) {
    const users = getUsers();

    // Check if user already exists
    if (findUserByEmail(email)) {
        return {
            success: false,
            message: 'An account with this email already exists'
        };
    }

    // Validate password length
    if (password.length < 6) {
        return {
            success: false,
            message: 'Password must be at least 6 characters long'
        };
    }

    // Create new user
    const newUser = {
        id: generateUserId(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: btoa(password), // Simple encoding (NOT secure for production!)
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return {
        success: true,
        user: newUser,
        message: 'Account created successfully!'
    };
}

// ===================================
// LOGIN
// ===================================

function loginUser(email, password) {
    const user = findUserByEmail(email);

    if (!user) {
        return {
            success: false,
            message: 'No account found with this email'
        };
    }

    // Check password (decode and compare)
    const decodedPassword = atob(user.password);
    if (decodedPassword !== password) {
        return {
            success: false,
            message: 'Incorrect password'
        };
    }

    return {
        success: true,
        user: user,
        message: 'Login successful!'
    };
}

// ===================================
// EVENT LISTENERS
// ===================================

function attachAuthListeners() {
    // Toggle between login and register forms
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Login form submission
    document.getElementById('loginFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    // Register form submission
    document.getElementById('registerFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });
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

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const result = loginUser(email, password);

    if (result.success) {
        createSession(result.user);
        // Redirect to main app
        window.location.href = 'index.html';
    } else {
        showError('loginError', result.message);
    }
}

function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        showError('registerError', 'Passwords do not match');
        return;
    }

    const result = registerUser(name, email, password);

    if (result.success) {
        createSession(result.user);
        // Redirect to main app
        window.location.href = 'index.html';
    } else {
        showError('registerError', result.message);
    }
}

// ===================================
// UI HELPERS
// ===================================

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
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
console.log('%c🔐 HabitGrid Auth', 'color: #0F766E; font-size: 18px; font-weight: bold;');
console.log('%cAuthentication system loaded', 'color: #1E3A8A; font-size: 12px;');
