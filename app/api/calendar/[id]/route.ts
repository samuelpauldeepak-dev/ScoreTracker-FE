import { type NextRequest, NextResponse } from "next/server"
import { mockCalendarEvents, simulateDelay } from "../../_mock-data"
import type { CalendarEvent } from "@/lib/types"

// GET /api/calendar/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const event = mockCalendarEvents.find((e) => e.id === id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ data: event })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/calendar/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const body: Partial<CalendarEvent> = await request.json()
    const index = mockCalendarEvents.findIndex((e) => e.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    mockCalendarEvents[index] = { ...mockCalendarEvents[index], ...body }

    return NextResponse.json({ data: mockCalendarEvents[index] })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/calendar/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await simulateDelay()

  try {
    const { id } = await params
    const index = mockCalendarEvents.findIndex((e) => e.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    mockCalendarEvents.splice(index, 1)

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
