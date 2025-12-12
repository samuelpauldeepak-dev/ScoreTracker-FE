import type { User } from "@/lib/types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    password: "password123", // In production, this would be hashed
    avatar: "/student-avatar.png",
    examPreferences: ["NEET", "JEE"],
    joinedDate: "2024-01-15",
    role: "student",
  },
  {
    id: "2",
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    password: "password123",
    avatar: "/student-avatar.png",
    examPreferences: ["UPSC"],
    joinedDate: "2024-02-10",
    role: "student",
  },
]
