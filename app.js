// ===================================
// STATE MANAGEMENT
// ===================================

const STATE = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    habits: [],
    habitLogs: {},
    editingHabitIndex: null
};

// ===================================
// CONSTANTS
// ===================================

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const CATEGORIES = {
    health: { name: 'Health', color: '#16A34A' },
    study: { name: 'Study', color: '#1E3A8A' },
    work: { name: 'Work', color: '#0F766E' },
    personal: { name: 'Personal', color: '#F59E0B' }
};

const MAX_HABITS = 10;
const STORAGE_KEY = 'habitgrid_data';

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase to initialize
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                // User is logged in, initialize app
                console.log('User authenticated:', user.email);
                await initializeApp();
            } else {
                // No user logged in, redirect to auth page
                console.log('No user authenticated, redirecting...');
                window.location.href = 'auth.html';
            }
        });
    } else {
        // Firebase not available, use localStorage fallback
        console.warn('Firebase not initialized, using localStorage');
        initializeApp();
    }
});

async function initializeApp() {
    await loadData();
    initializeHabits();
    renderHabitGrid();
    updateAnalytics();
    attachEventListeners();
    updateMonthDisplay();
    displayUserInfo();

    // Migrate localStorage data to Firebase if needed
    const user = firebase.auth && firebase.auth().currentUser;
    if (user && typeof migrateLocalStorageToFirebase === 'function') {
        await migrateLocalStorageToFirebase(user.uid);
    }
}

// ===================================
// DATA PERSISTENCE
// ===================================

async function loadData() {
    try {
        // Check if user is logged in with Firebase
        const user = firebase.auth && firebase.auth().currentUser;

        if (user && typeof loadHabitsFromFirebase === 'function') {
            // Load from Firebase
            const firebaseData = await loadHabitsFromFirebase(user.uid);

            if (firebaseData) {
                STATE.habits = firebaseData.habits || [];
                STATE.habitLogs = firebaseData.habitLogs || {};
                STATE.currentMonth = firebaseData.currentMonth ?? new Date().getMonth();
                STATE.currentYear = firebaseData.currentYear ?? new Date().getFullYear();
                console.log('Data loaded from Firebase');
                return;
            }
        }

        // Fallback to localStorage
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            STATE.habits = data.habits || [];
            STATE.habitLogs = data.habitLogs || {};
            STATE.currentMonth = data.currentMonth ?? new Date().getMonth();
            STATE.currentYear = data.currentYear ?? new Date().getFullYear();
            console.log('Data loaded from localStorage');
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function saveData() {
    try {
        const data = {
            habits: STATE.habits,
            habitLogs: STATE.habitLogs,
            currentMonth: STATE.currentMonth,
            currentYear: STATE.currentYear
        };

        // Save to localStorage for backward compatibility
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

        // Save to Firebase if user is logged in
        const user = firebase.auth && firebase.auth().currentUser;
        if (user && typeof saveHabitsToFirebase === 'function') {
            await saveHabitsToFirebase(user.uid, data);
            console.log('Data saved to Firebase');
        } else {
            console.log('Data saved to localStorage only');
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// ===================================
// HABIT MANAGEMENT
// ===================================

function initializeHabits() {
    if (STATE.habits.length === 0) {
        STATE.habits = Array(MAX_HABITS).fill(null).map(() => ({
            name: '',
            category: 'health'
        }));
        saveData();
    }
}

function getMonthKey(month = STATE.currentMonth, year = STATE.currentYear) {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function getLogKey(habitIndex, day) {
    const monthKey = getMonthKey();
    return `${monthKey}-${habitIndex}-${day}`;
}

function isHabitCompleted(habitIndex, day) {
    const key = getLogKey(habitIndex, day);
    return STATE.habitLogs[key] === true;
}

function toggleHabitCompletion(habitIndex, day) {
    const key = getLogKey(habitIndex, day);
    STATE.habitLogs[key] = !STATE.habitLogs[key];
    saveData();
    updateAnalytics();
}

function getDaysInMonth(month = STATE.currentMonth, year = STATE.currentYear) {
    return new Date(year, month + 1, 0).getDate();
}

// ===================================
// RENDERING
// ===================================

function renderHabitGrid() {
    const gridContainer = document.getElementById('habitGrid');
    gridContainer.innerHTML = '';

    const daysInMonth = getDaysInMonth();

    // Create header row with day numbers
    const headerRow = document.createElement('div');
    headerRow.className = 'day-header-row';

    const headerLabel = document.createElement('div');
    headerLabel.className = 'day-header-label';
    headerLabel.textContent = 'Habits';

    const dayNumbers = document.createElement('div');
    dayNumbers.className = 'day-numbers';

    for (let day = 1; day <= 31; day++) {
        const dayNum = document.createElement('div');
        dayNum.className = 'day-number';
        dayNum.textContent = day;
        if (day > daysInMonth) {
            dayNum.style.opacity = '0.3';
        }
        dayNumbers.appendChild(dayNum);
    }

    headerRow.appendChild(headerLabel);
    headerRow.appendChild(dayNumbers);
    gridContainer.appendChild(headerRow);

    // Render habit rows
    STATE.habits.forEach((habit, habitIndex) => {
        const row = document.createElement('div');
        row.className = 'habit-row';

        // Habit name cell
        const nameCell = document.createElement('div');
        nameCell.className = 'habit-name-cell';

        const categoryBadge = document.createElement('div');
        categoryBadge.className = `habit-category-badge ${habit.category}`;

        const nameSpan = document.createElement('span');
        nameSpan.className = `habit-name ${!habit.name ? 'empty' : ''}`;
        nameSpan.textContent = habit.name || 'Click to add habit';
        nameSpan.onclick = () => openHabitModal(habitIndex);

        nameCell.appendChild(categoryBadge);
        nameCell.appendChild(nameSpan);

        // Add delete button if habit has a name
        if (habit.name) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-habit-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.setAttribute('title', 'Delete habit');
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteHabit(habitIndex);
            };
            nameCell.appendChild(deleteBtn);
        }

        // Days cells
        const daysContainer = document.createElement('div');
        daysContainer.className = 'habit-days';

        for (let day = 1; day <= 31; day++) {
            const dayCheckbox = document.createElement('div');
            dayCheckbox.className = 'day-checkbox';
            dayCheckbox.setAttribute('data-habit', habitIndex);
            dayCheckbox.setAttribute('data-day', day);
            dayCheckbox.setAttribute('title', `Day ${day}`);

            if (!habit.name || day > daysInMonth) {
                dayCheckbox.classList.add('disabled');
            } else {
                if (isHabitCompleted(habitIndex, day)) {
                    dayCheckbox.classList.add('checked');
                }

                dayCheckbox.onclick = () => {
                    if (habit.name && day <= daysInMonth) {
                        toggleHabitCompletion(habitIndex, day);
                        dayCheckbox.classList.toggle('checked');
                    }
                };
            }

            daysContainer.appendChild(dayCheckbox);
        }

        row.appendChild(nameCell);
        row.appendChild(daysContainer);
        gridContainer.appendChild(row);
    });
}

// ===================================
// ANALYTICS
// ===================================

function calculateAnalytics() {
    const daysInMonth = getDaysInMonth();
    const activeHabits = STATE.habits.filter(h => h.name);
    const totalPossible = activeHabits.length * daysInMonth;

    let totalCompleted = 0;
    const habitStats = [];

    activeHabits.forEach((habit, index) => {
        const actualIndex = STATE.habits.indexOf(habit);
        let completed = 0;
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            if (isHabitCompleted(actualIndex, day)) {
                completed++;
                totalCompleted++;
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        // Calculate current streak (from end of month backwards)
        for (let day = daysInMonth; day >= 1; day--) {
            if (isHabitCompleted(actualIndex, day)) {
                currentStreak++;
            } else {
                break;
            }
        }

        const completionRate = (completed / daysInMonth) * 100;

        habitStats.push({
            name: habit.name,
            completed,
            completionRate,
            currentStreak,
            longestStreak,
            missed: daysInMonth - completed
        });
    });

    const completionRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

    // Find best and worst habits
    const sortedByCompletion = [...habitStats].sort((a, b) => b.completionRate - a.completionRate);
    const bestHabit = sortedByCompletion[0];
    const worstHabit = sortedByCompletion[sortedByCompletion.length - 1];

    // Find longest overall streak
    const longestOverallStreak = habitStats.reduce((max, stat) =>
        Math.max(max, stat.longestStreak), 0);

    return {
        totalPossible,
        totalCompleted,
        completionRate,
        activeHabitsCount: activeHabits.length,
        habitStats,
        bestHabit,
        worstHabit,
        longestOverallStreak
    };
}

function updateAnalytics() {
    const analytics = calculateAnalytics();

    // Update summary cards
    document.getElementById('totalCompleted').textContent = analytics.totalCompleted;
    document.getElementById('totalHabits').textContent = analytics.activeHabitsCount;
    document.getElementById('longestStreak').textContent = analytics.longestOverallStreak;
    document.getElementById('completionRate').textContent =
        `${Math.round(analytics.completionRate)}%`;

    // Update overall progress
    document.getElementById('progressText').textContent =
        `${analytics.totalCompleted} out of ${analytics.totalPossible} habit actions completed`;
    document.getElementById('overallProgress').style.width =
        `${analytics.completionRate}%`;

    // Update habit performance
    renderHabitPerformance(analytics.habitStats);

    // Update best/worst performers
    if (analytics.bestHabit) {
        document.getElementById('bestHabit').textContent = analytics.bestHabit.name;
        document.getElementById('bestHabitStat').textContent =
            `${Math.round(analytics.bestHabit.completionRate)}% completion • ${analytics.bestHabit.longestStreak} day streak`;
    } else {
        document.getElementById('bestHabit').textContent = '-';
        document.getElementById('bestHabitStat').textContent = 'No habits tracked yet';
    }

    if (analytics.worstHabit && analytics.activeHabitsCount > 1) {
        document.getElementById('worstHabit').textContent = analytics.worstHabit.name;
        document.getElementById('worstHabitStat').textContent =
            `${Math.round(analytics.worstHabit.completionRate)}% completion • ${analytics.worstHabit.missed} days missed`;
    } else {
        document.getElementById('worstHabit').textContent = '-';
        document.getElementById('worstHabitStat').textContent = 'Track more habits to see';
    }
}

function renderHabitPerformance(habitStats) {
    const container = document.getElementById('habitPerformance');
    container.innerHTML = '';

    if (habitStats.length === 0) {
        container.innerHTML = '<p style="color: var(--color-gray-500); text-align: center;">No active habits to display</p>';
        return;
    }

    habitStats.forEach(stat => {
        const item = document.createElement('div');
        item.className = 'performance-item';

        const header = document.createElement('div');
        header.className = 'performance-header';

        const name = document.createElement('div');
        name.className = 'performance-name';
        name.textContent = stat.name;

        const stats = document.createElement('div');
        stats.className = 'performance-stats';
        stats.innerHTML = `
            <span>${Math.round(stat.completionRate)}%</span>
            <span>Streak: ${stat.longestStreak}</span>
            <span>Missed: ${stat.missed}</span>
        `;

        header.appendChild(name);
        header.appendChild(stats);

        const barContainer = document.createElement('div');
        barContainer.className = 'performance-bar-container';

        const bar = document.createElement('div');
        bar.className = 'performance-bar';
        bar.style.width = `${stat.completionRate}%`;

        // Color based on performance
        if (stat.completionRate >= 80) {
            bar.classList.add('excellent');
        } else if (stat.completionRate >= 60) {
            bar.classList.add('good');
        } else if (stat.completionRate >= 40) {
            bar.classList.add('average');
        } else {
            bar.classList.add('poor');
        }

        barContainer.appendChild(bar);

        item.appendChild(header);
        item.appendChild(barContainer);
        container.appendChild(item);
    });
}

// ===================================
// MODAL MANAGEMENT
// ===================================

function openHabitModal(habitIndex) {
    STATE.editingHabitIndex = habitIndex;
    const habit = STATE.habits[habitIndex];

    document.getElementById('habitName').value = habit.name || '';
    document.getElementById('habitCategory').value = habit.category || 'health';
    document.getElementById('modalTitle').textContent =
        habit.name ? 'Edit Habit' : 'Add Habit';

    document.getElementById('habitModal').classList.add('active');
    document.getElementById('habitName').focus();
}

function closeHabitModal() {
    document.getElementById('habitModal').classList.remove('active');
    STATE.editingHabitIndex = null;
}

function saveHabit() {
    if (STATE.editingHabitIndex === null) return;

    const name = document.getElementById('habitName').value.trim();
    const category = document.getElementById('habitCategory').value;

    if (name) {
        STATE.habits[STATE.editingHabitIndex] = { name, category };
        saveData();
        renderHabitGrid();
        updateAnalytics();
    }

    closeHabitModal();
}

function deleteHabit(habitIndex) {
    const habit = STATE.habits[habitIndex];

    if (!habit.name) return;

    const confirmed = confirm(
        `Are you sure you want to delete "${habit.name}"?\n\nThis will remove the habit and all its tracking data.`
    );

    if (confirmed) {
        // Clear habit name and reset to default
        STATE.habits[habitIndex] = {
            name: '',
            category: 'health'
        };

        // Remove all logs for this habit
        const daysInMonth = getDaysInMonth();
        for (let day = 1; day <= daysInMonth; day++) {
            const key = getLogKey(habitIndex, day);
            delete STATE.habitLogs[key];
        }

        saveData();
        renderHabitGrid();
        updateAnalytics();
    }
}

// ===================================
// MONTH NAVIGATION
// ===================================

function updateMonthDisplay() {
    const monthText = `${MONTHS[STATE.currentMonth]} ${STATE.currentYear}`;
    document.getElementById('currentMonth').textContent = monthText;
}

function changeMonth(delta) {
    STATE.currentMonth += delta;

    if (STATE.currentMonth > 11) {
        STATE.currentMonth = 0;
        STATE.currentYear++;
    } else if (STATE.currentMonth < 0) {
        STATE.currentMonth = 11;
        STATE.currentYear--;
    }

    saveData();
    updateMonthDisplay();
    renderHabitGrid();
    updateAnalytics();
}

function resetMonth() {
    const confirmed = confirm(
        `Are you sure you want to reset all habit data for ${MONTHS[STATE.currentMonth]} ${STATE.currentYear}? This action cannot be undone.`
    );

    if (confirmed) {
        const monthKey = getMonthKey();
        const daysInMonth = getDaysInMonth();

        // Remove all logs for current month
        STATE.habits.forEach((_, habitIndex) => {
            for (let day = 1; day <= daysInMonth; day++) {
                const key = getLogKey(habitIndex, day);
                delete STATE.habitLogs[key];
            }
        });

        saveData();
        renderHabitGrid();
        updateAnalytics();
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

function attachEventListeners() {
    // Month navigation
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    document.getElementById('resetBtn').addEventListener('click', resetMonth);

    // Analytics toggle
    document.getElementById('toggleAnalytics').addEventListener('click', toggleAnalyticsSection);

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeHabitModal);
    document.getElementById('cancelBtn').addEventListener('click', closeHabitModal);
    document.getElementById('saveHabitBtn').addEventListener('click', saveHabit);

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Close modal on outside click
    document.getElementById('habitModal').addEventListener('click', (e) => {
        if (e.target.id === 'habitModal') {
            closeHabitModal();
        }
    });

    // Save on Enter key in modal
    document.getElementById('habitName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveHabit();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeHabitModal();
        }
    });
}

// ===================================
// ANALYTICS TOGGLE & CHARTS
// ===================================

let barChartInstance = null;
let pieChartInstance = null;

function toggleAnalyticsSection() {
    const section = document.getElementById('analyticsSection');
    const button = document.getElementById('toggleAnalytics');

    if (section.classList.contains('hidden')) {
        section.classList.remove('hidden');
        button.textContent = 'Hide Analytics & Charts';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 12l-5 5-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Hide Analytics & Charts
        `;

        // Render charts
        renderCharts();

        // Smooth scroll to analytics
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        section.classList.add('hidden');
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 17V8m7 9V3m7 14v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            View Analytics & Charts
        `;
    }
}

function renderCharts() {
    const analytics = calculateAnalytics();

    // Destroy existing charts if they exist
    if (barChartInstance) {
        barChartInstance.destroy();
    }
    if (pieChartInstance) {
        pieChartInstance.destroy();
    }

    // Render Bar Chart
    renderBarChart(analytics);

    // Render Pie Chart
    renderPieChart(analytics);
}

function renderBarChart(analytics) {
    const ctx = document.getElementById('barChart').getContext('2d');

    const labels = analytics.habitStats.map(stat => stat.name);
    const data = analytics.habitStats.map(stat => stat.completionRate);
    const colors = analytics.habitStats.map(stat => {
        if (stat.completionRate >= 80) return '#16A34A';
        if (stat.completionRate >= 60) return '#0F766E';
        if (stat.completionRate >= 40) return '#F59E0B';
        return '#DC2626';
    });

    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length > 0 ? labels : ['No habits yet'],
            datasets: [{
                label: 'Completion Rate (%)',
                data: data.length > 0 ? data : [0],
                backgroundColor: colors.length > 0 ? colors : ['#9CA3AF'],
                borderColor: colors.length > 0 ? colors : ['#9CA3AF'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function (value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function renderPieChart(analytics) {
    const ctx = document.getElementById('pieChart').getContext('2d');

    const completed = analytics.totalCompleted;
    const remaining = analytics.totalPossible - analytics.totalCompleted;

    pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [completed, remaining],
                backgroundColor: [
                    '#16A34A',
                    '#E5E7EB'
                ],
                borderColor: [
                    '#16A34A',
                    '#D1D5DB'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function exportData() {
    const dataStr = JSON.stringify(STATE, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitgrid-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        STATE.habits = data.habits || STATE.habits;
        STATE.habitLogs = data.habitLogs || STATE.habitLogs;
        saveData();
        renderHabitGrid();
        updateAnalytics();
        alert('Data imported successfully!');
    } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
    }
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===================================
// USER SESSION MANAGEMENT
// ===================================

async function displayUserInfo() {
    try {
        // Try Firebase first
        const user = firebase.auth && firebase.auth().currentUser;
        if (user) {
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                // Try to get name from Firestore
                if (typeof getUserDocument === 'function') {
                    const userDoc = await getUserDocument(user.uid);
                    if (userDoc && userDoc.name) {
                        userNameElement.textContent = userDoc.name;
                        return;
                    }
                }

                // Fallback to display name or email
                userNameElement.textContent = user.displayName || user.email.split('@')[0];
            }
            return;
        }

        // Fallback to localStorage session
        const session = localStorage.getItem('habitgrid_session');
        if (session) {
            const userData = JSON.parse(session);
            const userNameElement = document.getElementById('userName');
            if (userNameElement && userData.name) {
                userNameElement.textContent = userData.name;
            }
        }
    } catch (error) {
        console.error('Error loading user session:', error);
    }
}

function handleLogout() {
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
        // Use the global logout function from auth.js
        if (typeof window.logout === 'function') {
            window.logout();
        } else {
            // Fallback if auth.js is not loaded
            localStorage.removeItem('habitgrid_session');
            window.location.href = 'auth.html';
        }
    }
}

// ===================================
// CONSOLE WELCOME MESSAGE
// ===================================

console.log('%c🎯 HabitGrid', 'color: #0F766E; font-size: 24px; font-weight: bold;');
console.log('%cBuild consistency. Track progress. Improve daily.', 'color: #1E3A8A; font-size: 14px;');
console.log('%cTip: Use exportData() to backup your data', 'color: #6B7280; font-size: 12px;');
