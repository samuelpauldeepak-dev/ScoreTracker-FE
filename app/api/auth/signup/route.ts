import { type NextRequest, NextResponse } from "next/server"
import { mockUsers, simulateDelay } from "../../_mock-data"
import type { SignupRequest, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  await simulateDelay()

  try {
    const body: SignupRequest = await request.json()
    const { name, email, password, examPreferences } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user exists (in production, query database)
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create new user (in production, insert into database)
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // In production, hash this
      examPreferences: examPreferences || [],
      joinedDate: new Date().toISOString().split("T")[0],
      role: "student" as const,
    }

    // Add to mock data (won't persist across requests in production)
    mockUsers.push(newUser)

    const { password: _, ...safeUser } = newUser
    const response: AuthResponse = {
      user: safeUser,
      token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
    }

    return NextResponse.json(response, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
