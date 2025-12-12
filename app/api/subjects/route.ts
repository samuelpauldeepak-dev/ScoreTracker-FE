import { type NextRequest, NextResponse } from "next/server"
import { mockSubjects, mockTopics, mockTests, simulateDelay } from "../_mock-data"
import type { Subject } from "@/lib/types"

// GET /api/subjects - Get all subjects for user
export async function GET(request: NextRequest) {
  await simulateDelay()

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"

    // Get subjects with computed stats
    const subjects = mockSubjects
      .filter((s) => s.userId === userId)
      .map((subject) => {
        const subjectTopics = mockTopics.filter((t) => t.subjectId === subject.id)
        const subjectTests = mockTests.filter((t) => t.subjectId === subject.id)

        const avgScore =
          subjectTests.length > 0
            ? Math.round(subjectTests.reduce((sum, t) => sum + t.percentage, 0) / subjectTests.length)
            : 0

        const completedTopics = subjectTopics.filter((t) => t.progress >= 100).length

        return {
          ...subject,
          totalTopics: subjectTopics.length,
          completedTopics,
          averageScore: avgScore,
          tests: subjectTests.length,
        }
      })

    return NextResponse.json({ data: subjects })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/subjects - Create a new subject
export async function POST(request: NextRequest) {
  await simulateDelay()

  try {
    const body: Omit<Subject, "id" | "totalTopics" | "completedTopics" | "averageScore" | "tests"> =
      await request.json()

    if (!body.name || !body.color) {
      return NextResponse.json({ error: "Name and color are required" }, { status: 400 })
    }

    const newSubject: Subject = {
      ...body,
      id: crypto.randomUUID(),
      totalTopics: 0,
      completedTopics: 0,
      averageScore: 0,
      tests: 0,
    }

    mockSubjects.push(newSubject)

    return NextResponse.json({ data: newSubject }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
