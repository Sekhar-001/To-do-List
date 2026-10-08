import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  db,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateFirebaseProfile,
  doc,
  getDoc,
  setDoc
} from '../firebase';
import {
  defaultProfileTemplate,
  initialRevisionConfig
} from '../data/initialData';

const AppContext = createContext();

const sanitizeKey = (email) => (email || 'guest').replace(/[^a-zA-Z0-9_]/g, '_');

export const AppProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('edutrack_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('edutrack_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Active Navigation & Modals
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstallPWA(false);
      setIsStandalone(true);
      showToast('EduTrack Pro installed successfully! ✨', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        showToast('Installing EduTrack Pro... 🎉', 'success');
        setDeferredPrompt(null);
        setCanInstallPWA(false);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  // Authentication State
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Core Data States - 100% User-Driven (Start Empty for new users)
  const [profile, setProfile] = useState(null);
  const [revisionConfig, setRevisionConfig] = useState(initialRevisionConfig);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [plannerSlots, setPlannerSlots] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [exams, setExams] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [badges, setBadges] = useState([]);
  const [studyLogs, setStudyLogs] = useState([]);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Helper to load cached user data from localStorage
  const loadLocalCachedData = (uid, email) => {
    const key = uid || sanitizeKey(email);
    try {
      const stored = localStorage.getItem(`edutrack_cloud_cache_${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  };

  const saveLocalCachedData = (uid, email, data) => {
    const key = uid || sanitizeKey(email);
    try {
      localStorage.setItem(`edutrack_cloud_cache_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('Error caching data locally:', e);
    }
  };

  // Helper to populate all user data states from a data object
  const applyUserData = (userData, user) => {
    setProfile(userData.profile || {
      name: user?.displayName || 'Student',
      email: user?.email || '',
      targetExam: 'My Study Goals',
      dailyTargetHours: 6.0,
      streakDays: 1,
      xp: 100,
      level: 1,
      avatarUrl: user?.photoURL || defaultProfileTemplate.avatarUrl
    });
    setSubjects(userData.subjects || []);
    setTopics(userData.topics || []);
    setTasks(userData.tasks || []);
    setExams(userData.exams || []);
    setMockTests(userData.mockTests || []);
    setGoals(userData.goals || []);
    setNotes(userData.notes || []);
    setStudyLogs(userData.studyLogs || []);
  };

  // Reset all workspace states to empty
  const resetWorkspaceStates = () => {
    setProfile(null);
    setSubjects([]);
    setTopics([]);
    setTasks([]);
    setExams([]);
    setMockTests([]);
    setGoals([]);
    setNotes([]);
    setStudyLogs([]);
  };

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);

        // 1. Check local cache first for instant UI response
        const cached = loadLocalCachedData(user.uid, user.email);
        if (cached) {
          applyUserData(cached, user);
        }

        // 2. Fetch fresh data from Firestore Cloud
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const cloudData = docSnap.data();
            applyUserData(cloudData, user);
            saveLocalCachedData(user.uid, user.email, cloudData);
          } else if (!cached) {
            // New user without document: initialize clean empty document
            const defaultCleanData = {
              profile: {
                name: user.displayName || 'Student',
                email: user.email,
                targetExam: 'My Study Goals',
                dailyTargetHours: 6.0,
                streakDays: 1,
                xp: 100,
                level: 1,
                avatarUrl: user.photoURL || defaultProfileTemplate.avatarUrl
              },
              subjects: [],
              topics: [],
              exams: [],
              mockTests: [],
              tasks: [],
              notes: [],
              goals: [],
              studyLogs: []
            };

            applyUserData(defaultCleanData, user);
            saveLocalCachedData(user.uid, user.email, defaultCleanData);
            try {
              await setDoc(userDocRef, defaultCleanData);
            } catch (err) {
              console.warn('Initial doc note:', err.message);
            }
          }
        } catch (error) {
          console.warn('Cloud fetch note:', error.message);
        }
      } else {
        setFirebaseUser(null);
        resetWorkspaceStates();
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auto-Sync User Data to Firestore & Local Cache
  useEffect(() => {
    if (!firebaseUser || !profile) return;

    const dataToSave = {
      profile,
      subjects,
      topics,
      tasks,
      exams,
      mockTests,
      goals,
      notes,
      studyLogs,
      updatedAt: new Date().toISOString()
    };

    saveLocalCachedData(firebaseUser.uid, firebaseUser.email, dataToSave);

    const syncTimeout = setTimeout(async () => {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, dataToSave, { merge: true });
      } catch (err) {
        console.warn('Cloud auto-sync note:', err.message);
      }
    }, 1200);

    return () => clearTimeout(syncTimeout);
  }, [firebaseUser, profile, subjects, topics, tasks, exams, mockTests, goals, notes, studyLogs]);

  // Firebase Sign In with Email and Password
  const loginWithCredentials = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const user = userCredential.user;
      
      setFirebaseUser(user);

      // Fetch and restore their saved data from Firestore
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          applyUserData(cloudData, user);
          saveLocalCachedData(user.uid, user.email, cloudData);
        } else {
          const cached = loadLocalCachedData(user.uid, user.email);
          if (cached) {
            applyUserData(cached, user);
          } else {
            const userProfile = {
              name: user.displayName || 'Student',
              email: user.email,
              targetExam: 'My Study Goals',
              dailyTargetHours: 6.0,
              streakDays: 1,
              xp: 100,
              level: 1,
              avatarUrl: user.photoURL || defaultProfileTemplate.avatarUrl
            };
            setProfile(userProfile);
          }
        }
      } catch (err) {
        console.warn('Login fetch note:', err.message);
      }

      showToast(`Welcome back, ${user.displayName || user.email}! ✨`, 'success');
      return { success: true };
    } catch (error) {
      let message = error.message;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please verify your credentials or switch to "Create New Account".';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password for this email. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }
      return { success: false, message };
    }
  };

  // Firebase Sign Up with Email, Password, Custom Name & Custom Requirements
  const registerNewAccount = async ({ email, name, password, targetExam, stream, dailyTargetHours, avatarUrl }) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      const cleanName = name.trim() || 'Student';

      // Update Firebase Auth Display Name
      await updateFirebaseProfile(user, {
        displayName: cleanName,
        photoURL: avatarUrl || defaultProfileTemplate.avatarUrl
      });

      const newProfile = {
        name: cleanName,
        email: cleanEmail,
        targetExam: targetExam.trim() || 'My Academic Goals',
        dailyTargetHours: parseFloat(dailyTargetHours) || 6.0,
        stream: stream || 'custom',
        streakDays: 1,
        xp: 100,
        level: 1,
        avatarUrl: avatarUrl || defaultProfileTemplate.avatarUrl,
        createdAt: new Date().toISOString()
      };

      // Completely Clean / Empty Initial Document (User creates everything himself)
      const initialDoc = {
        profile: newProfile,
        subjects: [],
        topics: [],
        exams: [],
        mockTests: [],
        tasks: [],
        notes: [],
        goals: [],
        studyLogs: []
      };

      // Immediately set user and clean workspace state
      setFirebaseUser(user);
      applyUserData(initialDoc, user);

      // Save to Cloud Firestore & Local Cache
      saveLocalCachedData(user.uid, cleanEmail, initialDoc);
      try {
        await setDoc(doc(db, 'users', user.uid), initialDoc);
      } catch (err) {
        console.warn('Initial Firestore write note:', err.message);
      }

      showToast(`Welcome to EduTrack, ${newProfile.name}! 🚀 Your clean workspace is ready.`, 'success');
      return { success: true };
    } catch (error) {
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') {
        message = '⚠️ This email is already registered! You cannot create another account with this email. Please switch to the "Sign In" tab to log in with your password.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.';
      }
      return { success: false, message };
    }
  };

  // Firebase Google 1-Click Sign In
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setFirebaseUser(user);
      
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        applyUserData(cloudData, user);
      } else {
        const initialDoc = {
          profile: {
            name: user.displayName || 'Student',
            email: user.email,
            targetExam: 'My Study Goals',
            dailyTargetHours: 6.0,
            streakDays: 1,
            xp: 100,
            level: 1,
            avatarUrl: user.photoURL || defaultProfileTemplate.avatarUrl
          },
          subjects: [],
          topics: [],
          exams: [],
          mockTests: [],
          tasks: [],
          notes: [],
          goals: [],
          studyLogs: []
        };
        applyUserData(initialDoc, user);
        await setDoc(userDocRef, initialDoc);
      }

      showToast(`Signed in as ${user.displayName}! 🎉`, 'success');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      resetWorkspaceStates();
      showToast('Logged out successfully.', 'info');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = (updatedFields) => {
    setProfile(prev => ({ ...prev, ...updatedFields }));
  };

  // Gamification & XP System
  const addXP = (amount) => {
    setProfile(prev => {
      if (!prev) return prev;
      const newXp = (prev.xp || 0) + amount;
      const newLevel = Math.floor(newXp / 300) + 1;
      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });
  };

  // Subject Handlers
  const addSubject = (newSub) => {
    const id = `sub-${Date.now()}`;
    const subjectObj = {
      id,
      name: newSub.name,
      code: newSub.code || newSub.name.substring(0, 4).toUpperCase(),
      color: newSub.color || '#6366f1',
      studyHours: 0,
      weakAreas: [],
      topicsCount: 0,
      completedTopics: 0
    };
    setSubjects(prev => [...prev, subjectObj]);
    showToast(`Created subject: ${subjectObj.name}`, 'success');
  };

  const updateSubject = (id, updatedFields) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const deleteSubject = (id) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setTopics(prev => prev.filter(t => t.subjectId !== id));
    showToast('Subject deleted', 'info');
  };

  // Topic Handlers
  const addTopic = (newTopic) => {
    const trimmedName = newTopic.name?.trim() || '';
    if (!trimmedName) {
      showToast('Topic name cannot be empty!', 'warning');
      return false;
    }

    const isDuplicate = topics.some(
      t => t.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      showToast(`Topic "${trimmedName}" already exists! Duplicates are not allowed.`, 'warning');
      return false;
    }

    const id = `top-${Date.now()}`;
    const topicObj = {
      id,
      subjectId: newTopic.subjectId,
      name: trimmedName,
      status: newTopic.status || 'Not Started',
      completionDate: newTopic.status === 'Completed' || newTopic.status === 'Mastered' ? new Date().toISOString().split('T')[0] : null,
      weightage: newTopic.weightage || 'Medium',
      isWeak: !!newTopic.isWeak
    };
    setTopics(prev => [...prev, topicObj]);

    setSubjects(prev => prev.map(s => {
      if (s.id === newTopic.subjectId) {
        return {
          ...s,
          topicsCount: s.topicsCount + 1,
          completedTopics: (newTopic.status === 'Completed' || newTopic.status === 'Mastered') ? s.completedTopics + 1 : s.completedTopics
        };
      }
      return s;
    }));
    showToast(`Added topic: ${topicObj.name}`, 'success');
    return true;
  };

  const updateTopic = (topicId, updatedFields) => {
    const trimmedName = updatedFields.name?.trim();
    if (trimmedName) {
      const isDuplicate = topics.some(
        t => t.id !== topicId && t.name.trim().toLowerCase() === trimmedName.toLowerCase()
      );
      if (isDuplicate) {
        showToast(`Topic "${trimmedName}" already exists!`, 'warning');
        return false;
      }
    }
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, ...updatedFields, name: trimmedName || t.name } : t));
    showToast('Topic updated successfully', 'success');
    return true;
  };

  const updateTopicStatus = (topicId, newStatus) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const isNowCompleted = (newStatus === 'Completed' || newStatus === 'Mastered' || newStatus.startsWith('Revision'));
        const today = new Date().toISOString().split('T')[0];

        if (isNowCompleted && !t.completionDate) {
          setSubjects(subs => subs.map(s => s.id === t.subjectId ? { ...s, completedTopics: s.completedTopics + 1 } : s));
          addXP(50);
        }

        return {
          ...t,
          status: newStatus,
          completionDate: isNowCompleted ? (t.completionDate || today) : null
        };
      }
      return t;
    }));
  };

  const deleteTopic = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      setSubjects(prev => prev.map(s => {
        if (s.id === topic.subjectId) {
          return {
            ...s,
            topicsCount: Math.max(0, s.topicsCount - 1),
            completedTopics: (topic.status === 'Completed' || topic.status === 'Mastered' || topic.status.startsWith('Revision')) ? Math.max(0, s.completedTopics - 1) : s.completedTopics
          };
        }
        return s;
      }));
    }
    setTopics(prev => prev.filter(t => t.id !== topicId));
    showToast('Syllabus topic deleted', 'info');
  };

  // Exam Deadlines Handlers
  const addExam = (examData) => {
    const id = `exam-${Date.now()}`;
    const newExam = {
      id,
      title: examData.title,
      type: examData.type || 'Competitive Exam',
      date: examData.date || new Date().toISOString().split('T')[0],
      targetScore: examData.targetScore || '80 / 100',
      description: examData.description || '',
      priority: examData.priority || 'High',
      subjectId: examData.subjectId || null
    };
    setExams(prev => [...prev, newExam]);
    showToast(`Added deadline: ${newExam.title}`, 'success');
  };

  const updateExam = (examId, updatedFields) => {
    setExams(prev => prev.map(e => e.id === examId ? { ...e, ...updatedFields } : e));
    showToast('Exam deadline updated', 'success');
    return true;
  };

  const deleteExam = (id) => {
    setExams(prev => prev.filter(e => e.id !== id));
    showToast('Exam deadline deleted', 'info');
  };

  // Mock Test Handlers
  const updateMockTest = (testId, updatedFields) => {
    setMockTests(prev => prev.map(m => m.id === testId ? { ...m, ...updatedFields } : m));
    showToast('Mock test updated', 'success');
    return true;
  };

  // Task Handlers
  const addTask = (taskData) => {
    const id = `task-${Date.now()}`;
    const newTask = {
      id,
      title: taskData.title,
      subjectId: taskData.subjectId || '',
      topicId: taskData.topicId || '',
      description: taskData.description || '',
      priority: taskData.priority || 'Medium',
      startDate: taskData.startDate || new Date().toISOString().split('T')[0],
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      estMinutes: parseInt(taskData.estMinutes || 45, 10),
      actMinutes: parseInt(taskData.actMinutes || 0, 10),
      status: taskData.status || 'Not Started',
      isRecurring: !!taskData.isRecurring,
      notes: taskData.notes || '',
      attachments: taskData.attachments || []
    };
    setTasks(prev => [newTask, ...prev]);
    addXP(15);
    showToast('New Task Created!', 'success');
  };

  const updateTask = (id, updatedFields) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'Not Started' : 'Completed';
        if (nextStatus === 'Completed') {
          addXP(30);
          showToast(`Completed task: "${t.title}" (+30 XP) 🎉`, 'success');
        }
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task removed', 'info');
  };

  const clearAllTasks = () => {
    setTasks([]);
    showToast('All tasks cleared!', 'info');
  };

  // Smart Recommendations
  const getSmartRecommendations = () => {
    const recs = [];
    const scheduledMocks = (mockTests || []).filter(m => m.status === 'Scheduled');
    if (scheduledMocks.length > 0) {
      recs.push({
        id: 'rec-mock',
        type: 'info',
        title: `Upcoming Scheduled Mock Test`,
        description: `"${scheduledMocks[0].testName}" is scheduled for ${scheduledMocks[0].scheduledDate}.`,
        actionTab: 'mocktests'
      });
    }
    return recs;
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      activeTab,
      setActiveTab,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      isSearchOpen,
      setIsSearchOpen,
      searchQuery,
      setSearchQuery,
      isProfileModalOpen,
      setIsProfileModalOpen,
      isInstallModalOpen,
      setIsInstallModalOpen,
      canInstallPWA,
      isStandalone,
      installPWA,
      toasts,
      showToast,

      firebaseUser,
      currentUserEmail: firebaseUser?.email || null,
      authLoading,
      loginWithCredentials,
      registerNewAccount,
      loginWithGoogle,
      logout,
      updateProfile,

      profile,
      setProfile,
      revisionConfig,
      setRevisionConfig,
      subjects,
      setSubjects,
      topics,
      setTopics,
      tasks,
      setTasks,
      plannerSlots,
      revisions,
      exams,
      setExams,
      addExam,
      updateExam,
      deleteExam,
      mockTests,
      setMockTests,
      updateMockTest,
      goals,
      setGoals,
      notes,
      setNotes,
      badges,
      studyLogs,

      addSubject,
      updateSubject,
      deleteSubject,
      addTopic,
      updateTopic,
      updateTopicStatus,
      deleteTopic,
      addTask,
      updateTask,
      toggleTaskStatus,
      deleteTask,
      clearAllTasks,
      getSmartRecommendations
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
