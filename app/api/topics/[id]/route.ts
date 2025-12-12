import { type NextRequest, NextResponse } from "next/server"
import { mockTopics, simulateDelay } from "../../_mock-data"
import type { Topic } from "@/lib/types"

// GET /api/topics/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const topic = mockTopics.find((t) => t.id === id)

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    return NextResponse.json({ data: topic })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/topics/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const body: Partial<Topic> = await request.json()
    const index = mockTopics.findIndex((t) => t.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    mockTopics[index] = { ...mockTopics[index], ...body }

    return NextResponse.json({ data: mockTopics[index] })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/topics/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const index = mockTopics.findIndex((t) => t.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    mockTopics.splice(index, 1)

    return NextResponse.json({ message: "Topic deleted successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
