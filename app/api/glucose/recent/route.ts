import { NextResponse } from "next/server"
import { glucoseStore } from "@/lib/data-store"

export async function GET() {
  try {
    const recentReadings = glucoseStore.getRecent(5)
    return NextResponse.json(recentReadings)
  } catch (error) {
    console.error("Error fetching recent glucose readings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
