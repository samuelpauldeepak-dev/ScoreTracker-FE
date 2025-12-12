import { type NextRequest, NextResponse } from "next/server"
import { mockTopics, simulateDelay } from "../_mock-data"
import type { Topic } from "@/lib/types"

// GET /api/topics - Get all topics (optionally filtered by subject)
export async function GET(request: NextRequest) {
  await simulateDelay()

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"
    const subjectId = searchParams.get("subjectId")

    let topics = mockTopics.filter((t) => t.userId === userId)

    if (subjectId) {
      topics = topics.filter((t) => t.subjectId === subjectId)
    }

    return NextResponse.json({ data: topics })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/topics - Create a new topic
export async function POST(request: NextRequest) {
  await simulateDelay()

  try {
    const body: Omit<Topic, "id"> = await request.json()

    if (!body.name || !body.subjectId || !body.difficulty) {
      return NextResponse.json({ error: "Name, subjectId, and difficulty are required" }, { status: 400 })
    }

    const newTopic: Topic = {
      ...body,
      id: crypto.randomUUID(),
      progress: body.progress || 0,
    }

    mockTopics.push(newTopic)

    return NextResponse.json({ data: newTopic }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
