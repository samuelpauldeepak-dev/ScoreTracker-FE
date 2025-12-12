// Centralized type definitions for the entire app
// These types are shared between API routes and client components

export interface User {
  id: string
  name: string
  email: string
  password?: string // Only used server-side
  avatar?: string
  examPreferences: string[]
  joinedDate: string
  role: "student" | "admin"
}

export interface Test {
  id: string
  name: string
  subjectId: string
  subject: string
  category: "mock" | "practice" | "sectional" | "full"
  score: number
  totalMarks: number
  percentage: number
  date: string
  duration?: number
  topics?: string[]
  notes?: string
  userId: string
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
  targetScore?: number
  userId: string
}

export interface Topic {
  id: string
  subjectId: string
  name: string
  difficulty: "easy" | "medium" | "hard"
  progress: number
  lastStudied?: string
  notes?: string
  userId: string
}

export interface CalendarEvent {
  id: string
  title: string
  type: "test" | "study" | "revision"
  date: string
  time?: string
  subject?: string
  description?: string
  userId: string
}

export interface Goal {
  id: string
  type: "avgScore" | "studyHours" | "testsCount"
  period: "weekly" | "monthly"
  target: number
  current: number
  status: "active" | "achieved" | "missed"
  startDate: string
  endDate: string
  userId: string
}

export interface StudySession {
  id: string
  subjectId: string
  topicId?: string
  start: string
  end: string
  durationMins: number
  notes?: string
  focusType?: "deep" | "review" | "practice"
  userId: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
  examPreferences: string[]
}

export interface AuthResponse {
  user: Omit<User, "password">
  token: string
}

export interface Exam {
  id: string
  name: string
  category: "NEET" | "JEE" | "UPSC" | "SSC" | "Other"
  targetDate?: string
  description?: string
  userId: string
  createdAt: string
}

export interface UserSubscription {
  planId: "free" | "basic" | "pro" | "pro_plus"
  status: "active" | "cancelled" | "expired"
  startDate: string
  endDate?: string
  usage: {
    exams: number
    tests: number
    subjects: number
  }
}
