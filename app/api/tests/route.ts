import { type NextRequest, NextResponse } from "next/server"
import { mockTests, simulateDelay } from "../_mock-data"
import type { Test } from "@/lib/types"

// GET /api/tests - Get all tests for user
export async function GET(request: NextRequest) {
  await simulateDelay()

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"
    const subject = searchParams.get("subject")
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")

    // Filter tests
    let tests = mockTests.filter((t) => t.userId === userId)

    if (subject) {
      tests = tests.filter((t) => t.subject === subject)
    }
    if (category) {
      tests = tests.filter((t) => t.category === category)
    }
    if (startDate) {
      tests = tests.filter((t) => t.date >= startDate)
    }
    if (endDate) {
      tests = tests.filter((t) => t.date <= endDate)
    }

    // Sort by date descending
    tests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Paginate
    const total = tests.length
    const totalPages = Math.ceil(total / pageSize)
    const paginatedTests = tests.slice((page - 1) * pageSize, page * pageSize)

    return NextResponse.json({
      data: paginatedTests,
      total,
      page,
      pageSize,
      totalPages,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/tests - Create a new test
export async function POST(request: NextRequest) {
  await simulateDelay()

  try {
    const body: Omit<Test, "id"> = await request.json()

    // Validate required fields
    if (!body.name || !body.subject || body.score === undefined || !body.totalMarks) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newTest: Test = {
      ...body,
      id: crypto.randomUUID(),
      percentage: Math.round((body.score / body.totalMarks) * 100),
    }

    mockTests.push(newTest)

    return NextResponse.json({ data: newTest }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
