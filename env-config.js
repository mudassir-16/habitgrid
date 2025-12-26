// ===================================
// ENVIRONMENT CONFIGURATION
// ===================================

// This file helps manage environment-specific settings
// For Vercel deployment, you'll need to set environment variables

const ENV_CONFIG = {
    // Development (local)
    development: {
        useFirebase: true,
        debugMode: true
    },

    // Production (Vercel)
    production: {
        useFirebase: true,
        debugMode: false
    }
};

// Detect environment
const isProduction = window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

const currentEnv = isProduction ? 'production' : 'development';
const config = ENV_CONFIG[currentEnv];

// Export config
window.APP_CONFIG = config;
window.IS_PRODUCTION = isProduction;

console.log(`%c🌍 Environment: ${currentEnv}`, 'color: #4CAF50; font-size: 14px; font-weight: bold;');
