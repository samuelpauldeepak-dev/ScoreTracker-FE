import { type NextRequest, NextResponse } from "next/server"
import { mockUsers, simulateDelay } from "../../_mock-data"

export async function GET(request: NextRequest) {
  await simulateDelay()

  try {
    // Get token from header (in production, validate JWT)
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    // Extract user ID from mock token
    const userId = token.split("-")[3]

    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { password: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
