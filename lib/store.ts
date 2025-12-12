import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SubscriptionPlanId } from "./constants"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  examPreferences: string[]
  joinedDate: string
  subscription: {
    planId: SubscriptionPlanId
    status: "active" | "cancelled" | "expired"
    startDate: string
    endDate?: string
  }
}

export interface Test {
  id: string
  name: string
  subject: string
  category: "mock" | "practice" | "sectional" | "full"
  score: number
  totalMarks: number
  percentage: number
  date: string
  duration?: number
  topics?: string[]
}

export interface Subject {
  id: string
  name: string
  color: string
  icon: string
  totalTopics: number
  completedTopics: number
  averageScore: number
  tests: number
}

export interface Topic {
  id: string
  subjectId: string
  name: string
  difficulty: "easy" | "medium" | "hard"
  progress: number
  lastStudied?: string
}

export interface CalendarEvent {
  id: string
  title: string
  type: "test" | "study" | "revision"
  date: string
  time?: string
  subject?: string
  description?: string
}

export interface Exam {
  id: string
  name: string
  category: "NEET" | "JEE" | "UPSC" | "SSC" | "Other"
  targetDate?: string
  description?: string
  createdAt: string
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean

  // Data
  tests: Test[]
  subjects: Subject[]
  topics: Topic[]
  calendarEvents: CalendarEvent[]

  // Exam management
  exams: Exam[]
  activeExamId: string | null

  // Actions
  login: (user: User) => void
  logout: () => void
  addTest: (test: Omit<Test, "id">) => void
  updateTest: (id: string, test: Partial<Test>) => void
  deleteTest: (id: string) => void
  addSubject: (subject: Omit<Subject, "id">) => void
  updateSubject: (id: string, subject: Partial<Subject>) => void
  deleteSubject: (id: string) => void
  addTopic: (topic: Omit<Topic, "id">) => void
  updateTopic: (id: string, topic: Partial<Topic>) => void
  deleteTopic: (id: string) => void
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void
  updateCalendarEvent: (id: string, event: Partial<CalendarEvent>) => void
  deleteCalendarEvent: (id: string) => void
  initializeMockData: () => void
  addExam: (exam: Omit<Exam, "id" | "createdAt">) => void
  updateExam: (id: string, exam: Partial<Exam>) => void
  deleteExam: (id: string) => void
  setActiveExam: (id: string) => void
  getUsage: () => { exams: number; tests: number; subjects: number }
  canCreateExam: () => boolean
  canCreateTest: () => boolean
  canCreateSubject: () => boolean
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      exams: [],
      activeExamId: null,
      tests: [],
      subjects: [],
      topics: [],
      calendarEvents: [],

      // Auth actions
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, activeExamId: null }),

      addExam: (exam) =>
        set((state) => {
          const newExam = { ...exam, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
          return {
            exams: [...state.exams, newExam],
            activeExamId: state.activeExamId || newExam.id,
          }
        }),
      updateExam: (id, exam) =>
        set((state) => ({
          exams: state.exams.map((e) => (e.id === id ? { ...e, ...exam } : e)),
        })),
      deleteExam: (id) =>
        set((state) => ({
          exams: state.exams.filter((e) => e.id !== id),
          activeExamId: state.activeExamId === id ? state.exams[0]?.id || null : state.activeExamId,
        })),
      setActiveExam: (id) => set({ activeExamId: id }),

      // Test actions
      addTest: (test) =>
        set((state) => ({
          tests: [...state.tests, { ...test, id: crypto.randomUUID() }],
        })),
      updateTest: (id, test) =>
        set((state) => ({
          tests: state.tests.map((t) => (t.id === id ? { ...t, ...test } : t)),
        })),
      deleteTest: (id) =>
        set((state) => ({
          tests: state.tests.filter((t) => t.id !== id),
        })),

      // Subject actions
      addSubject: (subject) =>
        set((state) => ({
          subjects: [...state.subjects, { ...subject, id: crypto.randomUUID() }],
        })),
      updateSubject: (id, subject) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...subject } : s)),
        })),
      deleteSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
        })),

      // Topic actions
      addTopic: (topic) =>
        set((state) => ({
          topics: [...state.topics, { ...topic, id: crypto.randomUUID() }],
        })),
      updateTopic: (id, topic) =>
        set((state) => ({
          topics: state.topics.map((t) => (t.id === id ? { ...t, ...topic } : t)),
        })),
      deleteTopic: (id) =>
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== id),
        })),

      // Calendar actions
      addCalendarEvent: (event) =>
        set((state) => ({
          calendarEvents: [...state.calendarEvents, { ...event, id: crypto.randomUUID() }],
        })),
      updateCalendarEvent: (id, event) =>
        set((state) => ({
          calendarEvents: state.calendarEvents.map((e) => (e.id === id ? { ...e, ...event } : e)),
        })),
      deleteCalendarEvent: (id) =>
        set((state) => ({
          calendarEvents: state.calendarEvents.filter((e) => e.id !== id),
        })),

      getUsage: () => {
        const state = get()
        return {
          exams: state.exams.length,
          tests: state.tests.length,
          subjects: state.subjects.length,
        }
      },
      canCreateExam: () => {
        const state = get()
        const plan = state.user?.subscription.planId || "free"
        const { SUBSCRIPTION_PLANS } = require("./constants")
        const limit = SUBSCRIPTION_PLANS[plan.toUpperCase()].limits.exams
        return state.exams.length < limit
      },
      canCreateTest: () => {
        const state = get()
        const plan = state.user?.subscription.planId || "free"
        const { SUBSCRIPTION_PLANS } = require("./constants")
        const limit = SUBSCRIPTION_PLANS[plan.toUpperCase()].limits.tests
        return state.tests.length < limit
      },
      canCreateSubject: () => {
        const state = get()
        const plan = state.user?.subscription.planId || "free"
        const { SUBSCRIPTION_PLANS } = require("./constants")
        const limit = SUBSCRIPTION_PLANS[plan.toUpperCase()].limits.subjects
        return state.subjects.length < limit
      },

      // Initialize mock data
      initializeMockData: () => {
        const mockUser: User = {
          id: "1",
          name: "Priya Sharma",
          email: "priya.sharma@email.com",
          avatar: "/student-avatar.png",
          examPreferences: ["NEET", "JEE"],
          joinedDate: "2024-01-15",
          subscription: {
            planId: "FREE",
            status: "active",
            startDate: "2024-01-15",
          },
        }

        const mockExams: Exam[] = [
          {
            id: "1",
            name: "NEET 2025",
            category: "NEET",
            targetDate: "2025-05-05",
            description: "National Eligibility cum Entrance Test for Medical",
            createdAt: "2024-01-15",
          },
        ]

        const mockSubjects: Subject[] = [
          {
            id: "1",
            name: "Physics",
            color: "#3b82f6",
            icon: "⚛️",
            totalTopics: 25,
            completedTopics: 18,
            averageScore: 78,
            tests: 12,
          },
          {
            id: "2",
            name: "Chemistry",
            color: "#10b981",
            icon: "🧪",
            totalTopics: 22,
            completedTopics: 15,
            averageScore: 82,
            tests: 10,
          },
          {
            id: "3",
            name: "Biology",
            color: "#f59e0b",
            icon: "🧬",
            totalTopics: 28,
            completedTopics: 20,
            averageScore: 85,
            tests: 14,
          },
          {
            id: "4",
            name: "Mathematics",
            color: "#ef4444",
            icon: "📐",
            totalTopics: 30,
            completedTopics: 22,
            averageScore: 75,
            tests: 15,
          },
          {
            id: "5",
            name: "History",
            color: "#8b5cf6",
            icon: "📚",
            totalTopics: 20,
            completedTopics: 12,
            averageScore: 70,
            tests: 8,
          },
        ]

        const mockTests: Test[] = [
          {
            id: "1",
            name: "NEET Mock Test 1",
            subject: "Physics",
            category: "mock",
            score: 85,
            totalMarks: 100,
            percentage: 85,
            date: "2024-01-20",
          },
          {
            id: "2",
            name: "JEE Practice Set",
            subject: "Mathematics",
            category: "practice",
            score: 72,
            totalMarks: 100,
            percentage: 72,
            date: "2024-01-18",
          },
          {
            id: "3",
            name: "Chemistry Full Test",
            subject: "Chemistry",
            category: "full",
            score: 88,
            totalMarks: 100,
            percentage: 88,
            date: "2024-01-15",
          },
          {
            id: "4",
            name: "Biology Sectional",
            subject: "Biology",
            category: "sectional",
            score: 92,
            totalMarks: 100,
            percentage: 92,
            date: "2024-01-12",
          },
          {
            id: "5",
            name: "Physics Practice",
            subject: "Physics",
            category: "practice",
            score: 76,
            totalMarks: 100,
            percentage: 76,
            date: "2024-01-10",
          },
        ]

        const mockTopics: Topic[] = [
          { id: "1", subjectId: "1", name: "Mechanics", difficulty: "medium", progress: 85 },
          { id: "2", subjectId: "1", name: "Thermodynamics", difficulty: "hard", progress: 60 },
          { id: "3", subjectId: "2", name: "Organic Chemistry", difficulty: "hard", progress: 70 },
          { id: "4", subjectId: "3", name: "Cell Biology", difficulty: "easy", progress: 95 },
          { id: "5", subjectId: "4", name: "Calculus", difficulty: "medium", progress: 80 },
        ]

        const mockEvents: CalendarEvent[] = [
          {
            id: "1",
            title: "NEET Mock Test 2",
            type: "test",
            date: "2024-01-25",
            time: "10:00",
            subject: "All Subjects",
          },
          {
            id: "2",
            title: "Physics Study Session",
            type: "study",
            date: "2024-01-24",
            time: "14:00",
            subject: "Physics",
          },
          {
            id: "3",
            title: "Chemistry Revision",
            type: "revision",
            date: "2024-01-26",
            time: "16:00",
            subject: "Chemistry",
          },
        ]

        set({
          user: mockUser,
          isAuthenticated: true,
          exams: mockExams,
          activeExamId: mockExams[0].id,
          subjects: mockSubjects,
          tests: mockTests,
          topics: mockTopics,
          calendarEvents: mockEvents,
        })
      },
    }),
    {
      name: "venyto-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        exams: state.exams,
        activeExamId: state.activeExamId,
        tests: state.tests,
        subjects: state.subjects,
        topics: state.topics,
        calendarEvents: state.calendarEvents,
      }),
    },
  ),
)
