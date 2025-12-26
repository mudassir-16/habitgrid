# 🎯 HabitGrid - Build Consistency. Track Progress. Improve Daily.

A beautiful, modern habit tracking application with Firebase backend for secure authentication and cloud data storage.

![HabitGrid](https://img.shields.io/badge/version-2.0.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 📊 Habit Tracking
- **Monthly Grid View** - Track up to 10 habits with an intuitive visual grid
- **31-Day Calendar** - Complete view of the entire month
- **Quick Check-off** - One-click habit completion
- **Category System** - Organize habits by Health, Study, Work, or Personal
- **Streak Tracking** - Monitor your consistency with streak counters

### 📈 Analytics & Insights
- **Dynamic Charts** - Bar and pie charts powered by Chart.js
- **Completion Rates** - Track your overall progress
- **Performance Metrics** - See your best and worst performing habits
- **Monthly Summaries** - Comprehensive monthly statistics
- **Longest Streaks** - Celebrate your achievements

### 🔐 Authentication & Security
- **Firebase Authentication** - Secure email/password login
- **User Profiles** - Personal account management
- **Session Management** - Persistent login across sessions
- **Secure Logout** - Safe account termination

### ☁️ Cloud Storage
- **Firebase Firestore** - Real-time cloud database
- **Auto-Sync** - Automatic data synchronization
- **Cross-Device** - Access your habits from anywhere
- **Offline Support** - Works without internet connection
- **Data Migration** - Seamless upgrade from localStorage

### 🎨 Design
- **Modern UI** - Clean, professional interface
- **Responsive Design** - Works on desktop and mobile
- **Smooth Animations** - Delightful micro-interactions
- **Dark Mode Ready** - Eye-friendly color scheme
- **Glassmorphism** - Modern design aesthetics

---

## 🚀 Quick Start

### For Users

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/habitgrid.git
   cd habitgrid
   ```

2. **Set Up Firebase**
   ```bash
   # Copy the example config
   cp firebase-config.example.js firebase-config.js
   ```

3. **Configure Firebase**
   - Open `firebase-config.js`
   - Replace placeholder values with your Firebase credentials
   - See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions

4. **Open the App**
   - Open `index.html` in your browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js
     npx http-server
     ```
   - Navigate to `http://localhost:8000`

5. **Create an Account**
   - Register with your email and password
   - Start tracking your habits!

---

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase account (free tier available)
- Internet connection (for Firebase features)

---

## 🔧 Setup Guide

### Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Register a web app
4. Copy your Firebase configuration

### Step 2: Enable Firebase Services

1. **Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password

2. **Firestore Database**
   - Go to Firestore Database
   - Create database in test mode
   - Apply security rules (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))

### Step 3: Configure the App

1. Copy `firebase-config.example.js` to `firebase-config.js`
2. Update with your Firebase credentials
3. Save the file

**📖 For detailed instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)**

---

## 📁 Project Structure

```
habitgrid/
├── index.html                  # Main application page
├── auth.html                   # Login/Register page
├── app.js                      # Main application logic
├── styles.css                  # Main styles
├── auth.css                    # Authentication page styles
│
├── firebase-config.example.js  # Firebase config template
├── firebase-auth.js            # Firebase authentication
├── firebase-data.js            # Firestore data management
│
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── FIREBASE_SETUP.md           # Firebase setup guide
├── SECURITY_GUIDE.md           # Security best practices
└── GIT_SETUP.md                # Git initialization guide
```

---

## 🎯 How to Use

### Creating Habits
1. Click on "Click to add habit" in any row
2. Enter habit name and select category
3. Click "Save Habit"

### Tracking Progress
1. Click on any day to mark it complete
2. Click again to unmark
3. View your progress in the grid

### Viewing Analytics
1. Click "View Analytics & Charts"
2. See your completion rates, streaks, and trends
3. Identify your best and worst performing habits

### Managing Account
1. Your name appears in the header
2. Click "Logout" to sign out
3. Your data is automatically saved to the cloud

---

## 🔒 Security

### Firebase API Keys
- Firebase API keys are **safe to be public**
- Security is enforced through Firestore rules
- See [SECURITY_GUIDE.md](SECURITY_GUIDE.md) for details

### Data Protection
- User data is isolated per account
- Firestore security rules prevent unauthorized access
- All data is encrypted in transit

### Best Practices
- Never commit `firebase-config.js` to public repos
- Use environment variables for production
- Enable domain restrictions in Firebase Console
- Monitor usage regularly

**📖 For more details, see [SECURITY_GUIDE.md](SECURITY_GUIDE.md)**

---

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **JavaScript (ES6+)** - Application logic

### Backend & Services
- **Firebase Authentication** - User management
- **Cloud Firestore** - NoSQL database
- **Firebase Hosting** - (Optional) Static hosting

### Libraries
- **Chart.js** - Data visualization
- **Google Fonts** - Typography (Inter, Outfit)

---

## 📊 Firebase Data Structure

```
users (collection)
  └── {userId} (document)
      ├── name: string
      ├── email: string
      ├── createdAt: timestamp
      └── habitData (subcollection)
          └── current (document)
              ├── habits: array
              ├── habitLogs: object
              ├── currentMonth: number
              └── currentYear: number
```

---

## 🎨 Features in Detail

### Habit Grid
- Visual monthly calendar
- Color-coded categories
- Quick completion toggle
- Disabled days for invalid dates

### Analytics Dashboard
- **Bar Chart**: Completion rates per habit
- **Pie Chart**: Overall progress distribution
- **Summary Cards**: Key metrics at a glance
- **Performance Bars**: Individual habit tracking
- **Best/Worst Performers**: Identify trends

### User Experience
- Smooth animations and transitions
- Responsive design for all devices
- Intuitive navigation
- Clear visual feedback
- Error handling with helpful messages

---

## 🚀 Deployment

### Option 1: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

### Option 2: GitHub Pages
1. Push to GitHub
2. Go to Settings > Pages
3. Select branch and folder
4. Save

### Option 3: Netlify/Vercel
1. Connect your GitHub repository
2. Configure build settings
3. Deploy

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Firebase** - Backend infrastructure
- **Chart.js** - Data visualization
- **Google Fonts** - Typography
- **Inspiration** - All habit tracking enthusiasts

---

## 📞 Support

- 📖 **Documentation**: See the guides in this repository
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Open an issue with the `enhancement` label
- 📧 **Contact**: [Your Email]

---

## 🗺️ Roadmap

### Planned Features
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login (Google, GitHub)
- [ ] Export data to CSV/JSON
- [ ] Habit templates
- [ ] Reminders and notifications
- [ ] Dark mode toggle
- [ ] Multiple habit grids
- [ ] Habit notes and comments
- [ ] Achievement badges
- [ ] Social sharing

---

## 📈 Version History

### v2.0.0 (Current)
- ✅ Firebase integration
- ✅ Cloud data storage
- ✅ User authentication
- ✅ Cross-device sync
- ✅ Security improvements

### v1.0.0
- ✅ Basic habit tracking
- ✅ localStorage persistence
- ✅ Analytics dashboard
- ✅ Responsive design

---

## 💡 Tips for Best Results

1. **Be Consistent** - Check in daily
2. **Start Small** - Begin with 3-5 habits
3. **Be Specific** - Clear, actionable habits
4. **Review Weekly** - Check your analytics
5. **Adjust as Needed** - Modify habits that aren't working

---

## 🎯 Why HabitGrid?

- **Simple** - No complex features, just habit tracking
- **Beautiful** - Modern, clean design
- **Secure** - Firebase-powered authentication
- **Free** - Open source and free to use
- **Private** - Your data belongs to you
- **Reliable** - Cloud backup and sync

---

## 📱 Screenshots

*Add screenshots here once deployed*

---

## ⭐ Star This Repository

If you find HabitGrid useful, please consider giving it a star! It helps others discover the project.

---

**Built with ❤️ for better habits**

---

## 🔗 Links

- [Live Demo](#) - *Add your deployed URL*
- [Documentation](FIREBASE_SETUP.md)
- [Security Guide](SECURITY_GUIDE.md)
- [Git Setup](GIT_SETUP.md)
- [Report Bug](https://github.com/YOUR_USERNAME/habitgrid/issues)
- [Request Feature](https://github.com/YOUR_USERNAME/habitgrid/issues)

---

**Happy Habit Tracking! 🎉**
