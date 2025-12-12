import { type NextRequest, NextResponse } from "next/server"
import { mockStudySessions, simulateDelay } from "../_mock-data"
import type { StudySession } from "@/lib/types"

// GET /api/study-sessions
export async function GET(request: NextRequest) {
  await simulateDelay()

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"
    const subjectId = searchParams.get("subjectId")

    let sessions = mockStudySessions.filter((s) => s.userId === userId)

    if (subjectId) {
      sessions = sessions.filter((s) => s.subjectId === subjectId)
    }

    // Sort by start time descending
    sessions.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())

    return NextResponse.json({ data: sessions })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/study-sessions
export async function POST(request: NextRequest) {
  await simulateDelay()

  try {
    const body: Omit<StudySession, "id"> = await request.json()

    if (!body.subjectId || !body.start || !body.end || !body.durationMins) {
      return NextResponse.json({ error: "SubjectId, start, end, and durationMins are required" }, { status: 400 })
    }

    const newSession: StudySession = {
      ...body,
      id: crypto.randomUUID(),
    }

    mockStudySessions.push(newSession)

    return NextResponse.json({ data: newSession }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
