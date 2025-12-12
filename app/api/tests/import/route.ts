import { type NextRequest, NextResponse } from "next/server"
import { mockTests, mockSubjects, simulateDelay } from "../../_mock-data"
import type { Test } from "@/lib/types"

// POST /api/tests/import - Bulk import tests from CSV data
export async function POST(request: NextRequest) {
  await simulateDelay(200) // Slightly longer for bulk operation

  try {
    const body: { tests: Omit<Test, "id" | "percentage">[] } = await request.json()

    if (!body.tests || !Array.isArray(body.tests)) {
      return NextResponse.json({ error: "Invalid data format. Expected { tests: [...] }" }, { status: 400 })
    }

    const importedTests: Test[] = []
    const errors: { row: number; error: string }[] = []

    body.tests.forEach((test, index) => {
      // Validate each test
      if (!test.name || !test.subject || test.score === undefined || !test.totalMarks) {
        errors.push({ row: index + 1, error: "Missing required fields" })
        return
      }

      // Find subject ID
      const subject = mockSubjects.find((s) => s.name.toLowerCase() === test.subject.toLowerCase())

      const newTest: Test = {
        ...test,
        id: crypto.randomUUID(),
        subjectId: subject?.id || "",
        percentage: Math.round((test.score / test.totalMarks) * 100),
        userId: test.userId || "1",
      }

      mockTests.push(newTest)
      importedTests.push(newTest)
    })

    return NextResponse.json({
      data: importedTests,
      imported: importedTests.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
