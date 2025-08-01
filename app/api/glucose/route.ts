import { type NextRequest, NextResponse } from "next/server"
import { glucoseStore } from "@/lib/data-store"

export async function GET() {
  try {
    const readings = glucoseStore.getAll()
    return NextResponse.json(readings)
  } catch (error) {
    console.error("Error fetching glucose readings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { value, period, notes, timestamp } = body

    if (!value || !period) {
      return NextResponse.json({ error: "Value and period are required" }, { status: 400 })
    }

    const newReading = glucoseStore.add({
      value: Number(value),
      period,
      notes: notes || "",
      timestamp: timestamp || new Date().toISOString(),
    })

    return NextResponse.json(newReading, { status: 201 })
  } catch (error) {
    console.error("Error creating glucose reading:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
