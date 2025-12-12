import { type NextRequest, NextResponse } from "next/server"
import { mockSubjects, mockTopics, simulateDelay } from "../../_mock-data"
import type { Subject } from "@/lib/types"

// GET /api/subjects/[id] - Get single subject with topics
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const subject = mockSubjects.find((s) => s.id === id)

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    const topics = mockTopics.filter((t) => t.subjectId === id)

    return NextResponse.json({ data: { ...subject, topics } })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/subjects/[id] - Update subject
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const body: Partial<Subject> = await request.json()
    const index = mockSubjects.findIndex((s) => s.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    mockSubjects[index] = { ...mockSubjects[index], ...body }

    return NextResponse.json({ data: mockSubjects[index] })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/subjects/[id] - Delete subject and its topics
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const index = mockSubjects.findIndex((s) => s.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    // Remove subject
    mockSubjects.splice(index, 1)

    // Remove associated topics
    const topicIndices = mockTopics
      .map((t, i) => (t.subjectId === id ? i : -1))
      .filter((i) => i !== -1)
      .reverse()

    topicIndices.forEach((i) => mockTopics.splice(i, 1))

    return NextResponse.json({ message: "Subject deleted successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
