import { type NextRequest, NextResponse } from "next/server"
import { mockTests, simulateDelay } from "../../_mock-data"
import type { Test } from "@/lib/types"

// GET /api/tests/[id] - Get single test
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const test = mockTests.find((t) => t.id === id)

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    return NextResponse.json({ data: test })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/tests/[id] - Update test
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const body: Partial<Test> = await request.json()
    const index = mockTests.findIndex((t) => t.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Update and recalculate percentage if score/totalMarks changed
    const updatedTest = { ...mockTests[index], ...body }
    if (body.score !== undefined || body.totalMarks !== undefined) {
      updatedTest.percentage = Math.round((updatedTest.score / updatedTest.totalMarks) * 100)
    }

    mockTests[index] = updatedTest

    return NextResponse.json({ data: updatedTest })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/tests/[id] - Delete test
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const index = mockTests.findIndex((t) => t.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    mockTests.splice(index, 1)

    return NextResponse.json({ message: "Test deleted successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
