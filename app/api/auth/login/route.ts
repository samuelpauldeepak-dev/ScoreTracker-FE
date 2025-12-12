import { type NextRequest, NextResponse } from "next/server"
import { mockUsers, simulateDelay } from "../../_mock-data"
import type { LoginRequest, AuthResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  await simulateDelay()

  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user (in production, query database)
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create response without password
    const { password: _, ...safeUser } = user
    const response: AuthResponse = {
      user: safeUser,
      token: `mock-jwt-token-${user.id}-${Date.now()}`, // In production, use real JWT
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
