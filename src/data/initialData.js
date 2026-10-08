// Clean Initial Datasets for EduTrack Pro - Starts 100% Empty for Every User

export const defaultProfileTemplate = {
  name: "Student",
  email: "student@example.com",
  targetExam: "My Academic & Study Goals",
  dailyTargetHours: 6.0,
  streakDays: 1,
  xp: 100,
  level: 1,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
};

export const initialRevisionConfig = {
  intervals: [1, 3, 7, 15, 30],
  autoScheduleOnComplete: true
};

export const initialPlannerSlots = [];
export const initialRevisions = [];
export const initialGoals = [];
export const initialNotes = [];
export const initialBadges = [];
export const initialTasks = [];
export const initialSubjects = [];
export const initialTopics = [];
export const initialExams = [];
export const initialMockTests = [];
export const initialStudyLogs = [];

// Clean initial data generator - always empty so user builds their own workspace
export const getStreamInitialData = () => {
  return {
    subjects: [],
    topics: [],
    exams: []
  };
};

export const getInitialMockTests = () => {
  return [];
};
