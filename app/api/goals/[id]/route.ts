import { type NextRequest, NextResponse } from "next/server"
import { mockGoals, simulateDelay } from "../../_mock-data"
import type { Goal } from "@/lib/types"

// PUT /api/goals/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const body: Partial<Goal> = await request.json()
    const index = mockGoals.findIndex((g) => g.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    mockGoals[index] = { ...mockGoals[index], ...body }

    return NextResponse.json({ data: mockGoals[index] })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/goals/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const index = mockGoals.findIndex((g) => g.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    mockGoals.splice(index, 1)

    return NextResponse.json({ message: "Goal deleted successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
