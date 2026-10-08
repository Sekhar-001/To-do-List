# 📚 EduTrack — All-in-One Study & Exam Preparation Tracker

A modern, full-featured web and mobile application designed to help students organize their syllabus, plan daily study schedules, track mock test scores, manage revision cycles, and achieve their academic goals.

🌐 **Live Demo**: [https://to-do-list-lac-ten-17.vercel.app/](https://to-do-list-lac-ten-17.vercel.app/)

---

## 🔗 Live Application

You can access and use the live application directly in your browser:
👉 **[Open EduTrack App](https://to-do-list-lac-ten-17.vercel.app/)**

---

## ✨ Features

- 📊 **Dynamic Dashboard**: Overview of daily targets, upcoming deadlines, study streaks, and performance metrics.
- ✅ **Task Management**: Categorized to-do lists with priority levels, tags, and progress tracking.
- 📖 **Syllabus & Subjects**: Granular chapter-by-chapter tracking with completion percentages and weightages.
- 📅 **Study Planner**: Interactive timetable and daily schedule planner to balance subjects effectively.
- 📝 **Mock Tests & Results**: Log test scores, track accuracy percentages, and visualize score trends over time.
- 🔄 **Smart Revision Tracker**: Spaced repetition tracking to never forget previously covered topics.
- ⏱️ **Focus Study Timer**: Built-in Pomodoro & stopwatch timer with focus session logging.
- 🎯 **Target & Goals**: Set short-term and long-term milestones with visual progress bars.
- 💡 **Study Notes & Formulas**: Rich markdown/quick-reference notes organized by subject.
- 🔐 **Firebase Cloud Sync & Auth**: Seamless data synchronization across multiple devices with guest mode support.
- 📱 **PWA & Android Support**: Ready for both Progressive Web App install and native Android deployment via Capacitor.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: Modern Vanilla CSS + Glassmorphism Design System
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Mobile Runtime**: [Capacitor](https://capacitorjs.com/) (Android)
- **Deployment**: [Vercel](https://to-do-list-lac-ten-17.vercel.app/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Sekhar-001/To-do-List.git
cd To-do-List
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase (Optional for Cloud Sync)
Edit `src/firebase.js` or provide your Firebase configuration keys.

### 4. Run development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 📱 Mobile Build (Capacitor Android)

To sync and open the project in Android Studio:
```bash
npx cap sync
npx cap open android
```

---

## 📄 License
MIT License
