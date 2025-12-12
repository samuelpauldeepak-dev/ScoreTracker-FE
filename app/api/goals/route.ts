import { type NextRequest, NextResponse } from "next/server"
import { mockGoals, simulateDelay } from "../_mock-data"
import type { Goal } from "@/lib/types"

// GET /api/goals
export async function GET(request: NextRequest) {
  await simulateDelay()

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"
    const status = searchParams.get("status")

    let goals = mockGoals.filter((g) => g.userId === userId)

    if (status) {
      goals = goals.filter((g) => g.status === status)
    }

    return NextResponse.json({ data: goals })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/goals
export async function POST(request: NextRequest) {
  await simulateDelay()

  try {
    const body: Omit<Goal, "id"> = await request.json()

    if (!body.type || !body.period || body.target === undefined) {
      return NextResponse.json({ error: "Type, period, and target are required" }, { status: 400 })
    }

    const newGoal: Goal = {
      ...body,
      id: crypto.randomUUID(),
      current: body.current || 0,
      status: body.status || "active",
    }

    mockGoals.push(newGoal)

    return NextResponse.json({ data: newGoal }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
