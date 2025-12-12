import { type NextRequest, NextResponse } from "next/server"
import { mockCalendarEvents, simulateDelay } from "../_mock-data"
import type { CalendarEvent } from "@/lib/types"

// GET /api/calendar - Get calendar events
export async function GET(request: NextRequest) {
  await simulateDelay()

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const type = searchParams.get("type")

    let events = mockCalendarEvents.filter((e) => e.userId === userId)

    if (startDate) {
      events = events.filter((e) => e.date >= startDate)
    }
    if (endDate) {
      events = events.filter((e) => e.date <= endDate)
    }
    if (type) {
      events = events.filter((e) => e.type === type)
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({ data: events })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/calendar - Create a new event
export async function POST(request: NextRequest) {
  await simulateDelay()

  try {
    const body: Omit<CalendarEvent, "id"> = await request.json()

    if (!body.title || !body.type || !body.date) {
      return NextResponse.json({ error: "Title, type, and date are required" }, { status: 400 })
    }

    const newEvent: CalendarEvent = {
      ...body,
      id: crypto.randomUUID(),
    }

    mockCalendarEvents.push(newEvent)

    return NextResponse.json({ data: newEvent }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
