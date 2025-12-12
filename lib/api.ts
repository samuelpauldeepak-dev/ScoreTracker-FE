// Client-side API service layer
// When moving to production, only update the base URL and add proper auth headers

import type {
  User,
  Test,
  Subject,
  Topic,
  CalendarEvent,
  Goal,
  StudySession,
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
} from "./types"

const API_BASE = "/api"

// Helper for making API requests
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || "Request failed" }
    }

    return data
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Network error" }
  }
}

// ============ Auth API ============
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name: string, email: string, password: string, examPreferences: string[]) =>
    fetchApi<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, examPreferences }),
    }),

  me: () => fetchApi<{ user: User }>("/auth/me"),
}

// ============ Tests API ============
export const testsApi = {
  getAll: (params?: {
    subject?: string
    category?: string
    startDate?: string
    endDate?: string
    page?: number
    pageSize?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.subject) searchParams.set("subject", params.subject)
    if (params?.category) searchParams.set("category", params.category)
    if (params?.startDate) searchParams.set("startDate", params.startDate)
    if (params?.endDate) searchParams.set("endDate", params.endDate)
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.pageSize) searchParams.set("pageSize", params.pageSize.toString())

    return fetchApi<PaginatedResponse<Test>>(`/tests?${searchParams}`)
  },

  getById: (id: string) => fetchApi<{ data: Test }>(`/tests/${id}`),

  create: (test: Omit<Test, "id" | "percentage">) =>
    fetchApi<{ data: Test }>("/tests", {
      method: "POST",
      body: JSON.stringify(test),
    }),

  update: (id: string, test: Partial<Test>) =>
    fetchApi<{ data: Test }>(`/tests/${id}`, {
      method: "PUT",
      body: JSON.stringify(test),
    }),

  delete: (id: string) => fetchApi<{ message: string }>(`/tests/${id}`, { method: "DELETE" }),

  import: (tests: Omit<Test, "id" | "percentage">[]) =>
    fetchApi<{ data: Test[]; imported: number; errors?: { row: number; error: string }[] }>("/tests/import", {
      method: "POST",
      body: JSON.stringify({ tests }),
    }),
}

// ============ Subjects API ============
export const subjectsApi = {
  getAll: () => fetchApi<{ data: Subject[] }>("/subjects"),

  getById: (id: string) => fetchApi<{ data: Subject & { topics: Topic[] } }>(`/subjects/${id}`),

  create: (subject: Omit<Subject, "id" | "totalTopics" | "completedTopics" | "averageScore" | "tests">) =>
    fetchApi<{ data: Subject }>("/subjects", {
      method: "POST",
      body: JSON.stringify(subject),
    }),

  update: (id: string, subject: Partial<Subject>) =>
    fetchApi<{ data: Subject }>(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(subject),
    }),

  delete: (id: string) => fetchApi<{ message: string }>(`/subjects/${id}`, { method: "DELETE" }),
}

// ============ Topics API ============
export const topicsApi = {
  getAll: (subjectId?: string) => {
    const params = subjectId ? `?subjectId=${subjectId}` : ""
    return fetchApi<{ data: Topic[] }>(`/topics${params}`)
  },

  getById: (id: string) => fetchApi<{ data: Topic }>(`/topics/${id}`),

  create: (topic: Omit<Topic, "id">) =>
    fetchApi<{ data: Topic }>("/topics", {
      method: "POST",
      body: JSON.stringify(topic),
    }),

  update: (id: string, topic: Partial<Topic>) =>
    fetchApi<{ data: Topic }>(`/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(topic),
    }),

  delete: (id: string) => fetchApi<{ message: string }>(`/topics/${id}`, { method: "DELETE" }),
}

// ============ Calendar API ============
export const calendarApi = {
  getAll: (params?: { startDate?: string; endDate?: string; type?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set("startDate", params.startDate)
    if (params?.endDate) searchParams.set("endDate", params.endDate)
    if (params?.type) searchParams.set("type", params.type)

    return fetchApi<{ data: CalendarEvent[] }>(`/calendar?${searchParams}`)
  },

  getById: (id: string) => fetchApi<{ data: CalendarEvent }>(`/calendar/${id}`),

  create: (event: Omit<CalendarEvent, "id">) =>
    fetchApi<{ data: CalendarEvent }>("/calendar", {
      method: "POST",
      body: JSON.stringify(event),
    }),

  update: (id: string, event: Partial<CalendarEvent>) =>
    fetchApi<{ data: CalendarEvent }>(`/calendar/${id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    }),

  delete: (id: string) => fetchApi<{ message: string }>(`/calendar/${id}`, { method: "DELETE" }),
}

// ============ Goals API ============
export const goalsApi = {
  getAll: (status?: string) => {
    const params = status ? `?status=${status}` : ""
    return fetchApi<{ data: Goal[] }>(`/goals${params}`)
  },

  create: (goal: Omit<Goal, "id">) =>
    fetchApi<{ data: Goal }>("/goals", {
      method: "POST",
      body: JSON.stringify(goal),
    }),

  update: (id: string, goal: Partial<Goal>) =>
    fetchApi<{ data: Goal }>(`/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(goal),
    }),

  delete: (id: string) => fetchApi<{ message: string }>(`/goals/${id}`, { method: "DELETE" }),
}

// ============ Study Sessions API ============
export const studySessionsApi = {
  getAll: (subjectId?: string) => {
    const params = subjectId ? `?subjectId=${subjectId}` : ""
    return fetchApi<{ data: StudySession[] }>(`/study-sessions${params}`)
  },

  create: (session: Omit<StudySession, "id">) =>
    fetchApi<{ data: StudySession }>("/study-sessions", {
      method: "POST",
      body: JSON.stringify(session),
    }),
}

// ============ Analytics API ============
export const analyticsApi = {
  getDashboard: () =>
    fetchApi<{
      data: {
        metrics: {
          totalTests: number
          averageScore: number
          bestScore: number
          trend: number
          totalStudyHours: number
        }
        subjectPerformance: {
          id: string
          name: string
          color: string
          averageScore: number
          testCount: number
        }[]
        activeGoals: Goal[]
        recentTests: Test[]
        weeklyData: {
          week: string
          date: string
          averageScore: number | null
          testCount: number
        }[]
      }
    }>("/analytics/dashboard"),
}
