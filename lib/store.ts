import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  examType?: string
  targetScore?: number
  examPreferences: string[]
  joinedDate: string
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    studyReminders: boolean
    weeklyGoals: boolean
  }
}

export interface StudySession {
  id: string
  subject: string
  topics: string[]
  duration: number // in minutes
  date: string
  notes?: string
  difficulty: "easy" | "medium" | "hard"
  completedTopics: string[]
  mood: "excellent" | "good" | "average" | "poor"
}

export interface Test {
  id: string
  name: string
  subject: string
  category: "mock" | "practice" | "sectional" | "full"
  score: number
  totalMarks: number
  date: string
  topics: string[]
  difficulty: "easy" | "medium" | "hard"
  timeSpent?: number
  accuracy?: number
  rank?: number
  percentile?: number
}

export interface Subject {
  id: string
  name: string
  color: string
  icon: string
  topics: Topic[]
  totalStudyTime: number
  lastStudied?: string
  priority: "high" | "medium" | "low"
}

export interface Topic {
  id: string
  name: string
  progress: number
  difficulty: "easy" | "medium" | "hard"
  testsCount: number
  studyTime: number
  lastStudied?: string
  mastery: "beginner" | "intermediate" | "advanced" | "expert"
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: "test" | "study" | "reminder"
  description?: string
  duration?: number
  completed?: boolean
  priority: "high" | "medium" | "low"
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedDate?: string
  progress: number
  target: number
  category: "study" | "test" | "streak" | "milestone"
  points: number
}

export interface Goal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: string
  status: "active" | "completed" | "paused"
  createdDate: string
  category: "daily" | "weekly" | "monthly" | "yearly"
  priority: "high" | "medium" | "low"
}

export interface Milestone {
  id: string
  title: string
  description: string
  icon: string
  requirement: number
  currentProgress: number
  category: "study_hours" | "tests_completed" | "streak_days" | "subjects_mastered"
  reward: string
  unlocked: boolean
  unlockedDate?: string
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean

  // Data
  tests: Test[]
  subjects: Subject[]
  calendarEvents: CalendarEvent[]
  achievements: Achievement[]
  goals: Goal[]
  studySessions: StudySession[]
  milestones: Milestone[]

  // UI State
  sidebarCollapsed: boolean
  currentExamType: string

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<boolean>
  updateUser: (updates: Partial<User>) => void
  updateProfile: (updates: Partial<User>) => void

  // Test management
  addTest: (test: Omit<Test, "id">) => void
  updateTest: (id: string, updates: Partial<Test>) => void
  deleteTest: (id: string) => void

  // Subject management
  addSubject: (subject: Omit<Subject, "id">) => void
  updateSubject: (id: string, updates: Partial<Subject>) => void
  deleteSubject: (id: string) => void

  // Calendar
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void
  deleteCalendarEvent: (id: string) => void

  addGoal: (goal: Omit<Goal, "id">) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  addStudySession: (session: Omit<StudySession, "id">) => void
  updateStudySession: (id: string, updates: Partial<StudySession>) => void
  deleteStudySession: (id: string) => void

  addMilestone: (milestone: Omit<Milestone, "id">) => void
  updateMilestone: (id: string, updates: Partial<Milestone>) => void
  unlockMilestone: (id: string) => void

  switchExamType: (examType: string) => void

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  clearAllData: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      tests: [],
      subjects: [],
      calendarEvents: [],
      achievements: [],
      goals: [],
      studySessions: [],
      milestones: [],
      sidebarCollapsed: false,
      currentExamType: "NEET",

      // Auth actions
      login: async (email: string, password: string) => {
        // Mock authentication
        if (email && password) {
          const user: User = {
            id: "1",
            name: "Demo Student",
            email,
            phone: "+1 (555) 123-4567",
            avatar: "/student-avatar.png",
            examType: "NEET",
            targetScore: 600,
            examPreferences: ["NEET", "JEE"],
            joinedDate: new Date().toISOString(),
            preferences: {
              theme: "system",
              notifications: true,
              studyReminders: true,
              weeklyGoals: true,
            },
          }
          set({ user, isAuthenticated: true })

          const { seedTests, seedSubjects, seedCalendarEvents, seedGoals, seedStudySessions, seedMilestones } =
            await import("./seed-data")
          const state = get()
          if (state.tests.length === 0) {
            seedTests.forEach((test) => state.addTest(test))
          }
          if (state.subjects.length === 0) {
            seedSubjects.forEach((subject) => state.addSubject(subject))
          }
          if (state.calendarEvents.length === 0) {
            seedCalendarEvents.forEach((event) => state.addCalendarEvent(event))
          }
          if (state.goals.length === 0) {
            seedGoals.forEach((goal) => state.addGoal(goal))
          }
          if (state.studySessions.length === 0) {
            seedStudySessions.forEach((session) => state.addStudySession(session))
          }
          if (state.milestones.length === 0) {
            seedMilestones.forEach((milestone) => state.addMilestone(milestone))
          }

          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      signup: async (name: string, email: string, password: string) => {
        // Mock signup
        if (name && email && password) {
          const user: User = {
            id: Date.now().toString(),
            name,
            email,
            avatar: "/student-avatar.png",
            examPreferences: [],
            joinedDate: new Date().toISOString(),
            preferences: {
              theme: "system",
              notifications: true,
              studyReminders: true,
              weeklyGoals: true,
            },
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      updateUser: (updates) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },

      updateProfile: (updates) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },

      // Test management
      addTest: (test) => {
        const newTest = { ...test, id: Date.now().toString() }
        set((state) => ({ tests: [...state.tests, newTest] }))
      },

      updateTest: (id, updates) => {
        set((state) => ({
          tests: state.tests.map((test) => (test.id === id ? { ...test, ...updates } : test)),
        }))
      },

      deleteTest: (id) => {
        set((state) => ({
          tests: state.tests.filter((test) => test.id !== id),
        }))
      },

      // Subject management
      addSubject: (subject) => {
        const newSubject = {
          ...subject,
          id: Date.now().toString(),
          totalStudyTime: 0,
          priority: "medium" as const,
        }
        set((state) => ({ subjects: [...state.subjects, newSubject] }))
      },

      updateSubject: (id, updates) => {
        set((state) => ({
          subjects: state.subjects.map((subject) => (subject.id === id ? { ...subject, ...updates } : subject)),
        }))
      },

      deleteSubject: (id) => {
        set((state) => ({
          subjects: state.subjects.filter((subject) => subject.id !== id),
        }))
      },

      // Calendar
      addCalendarEvent: (event) => {
        const newEvent = {
          ...event,
          id: Date.now().toString(),
          completed: false,
          priority: "medium" as const,
        }
        set((state) => ({ calendarEvents: [...state.calendarEvents, newEvent] }))
      },

      updateCalendarEvent: (id, updates) => {
        set((state) => ({
          calendarEvents: state.calendarEvents.map((event) => (event.id === id ? { ...event, ...updates } : event)),
        }))
      },

      deleteCalendarEvent: (id) => {
        set((state) => ({
          calendarEvents: state.calendarEvents.filter((event) => event.id !== id),
        }))
      },

      addGoal: (goal) => {
        const newGoal = {
          ...goal,
          id: Date.now().toString(),
          category: "weekly" as const,
          priority: "medium" as const,
        }
        set((state) => ({ goals: [...state.goals, newGoal] }))
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)),
        }))
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }))
      },

      addStudySession: (session) => {
        const newSession = { ...session, id: Date.now().toString() }
        set((state) => ({ studySessions: [...state.studySessions, newSession] }))

        // Update subject study time
        const { subjects, updateSubject } = get()
        const subject = subjects.find((s) => s.name === session.subject)
        if (subject) {
          updateSubject(subject.id, {
            totalStudyTime: subject.totalStudyTime + session.duration,
            lastStudied: session.date,
          })
        }
      },

      updateStudySession: (id, updates) => {
        set((state) => ({
          studySessions: state.studySessions.map((session) =>
            session.id === id ? { ...session, ...updates } : session,
          ),
        }))
      },

      deleteStudySession: (id) => {
        set((state) => ({
          studySessions: state.studySessions.filter((session) => session.id !== id),
        }))
      },

      addMilestone: (milestone) => {
        const newMilestone = {
          ...milestone,
          id: Date.now().toString(),
          unlocked: false,
        }
        set((state) => ({ milestones: [...state.milestones, newMilestone] }))
      },

      updateMilestone: (id, updates) => {
        set((state) => ({
          milestones: state.milestones.map((milestone) =>
            milestone.id === id ? { ...milestone, ...updates } : milestone,
          ),
        }))
      },

      unlockMilestone: (id) => {
        set((state) => ({
          milestones: state.milestones.map((milestone) =>
            milestone.id === id ? { ...milestone, unlocked: true, unlockedDate: new Date().toISOString() } : milestone,
          ),
        }))
      },

      switchExamType: (examType) => {
        set({ currentExamType: examType })
        const { user, updateUser } = get()
        if (user) {
          updateUser({ examType })
        }
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed })
      },

      // Added data management function for settings
      clearAllData: () => {
        set({
          tests: [],
          subjects: [],
          calendarEvents: [],
          achievements: [],
          goals: [],
          studySessions: [],
          milestones: [],
        })
      },
    }),
    {
      name: "score-tracker-storage",
    },
  ),
)

export const useAppStore = useStore
