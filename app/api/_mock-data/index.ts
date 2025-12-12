// Central export for all mock data
// In production, replace these imports with actual database queries

export { mockUsers } from "./users"
export { mockSubjects } from "./subjects"
export { mockTests } from "./tests"
export { mockTopics } from "./topics"
export { mockCalendarEvents } from "./calendar"
export { mockGoals } from "./goals"
export { mockStudySessions } from "./study-sessions"

// Helper to simulate API delay (remove in production)
export const simulateDelay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms))
