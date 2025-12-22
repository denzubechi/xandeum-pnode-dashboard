import { NextResponse } from "next/server"
import { getAnalyticsSummary } from "@/lib/services/analytics.service"

export async function GET() {
  try {
    const summary = await getAnalyticsSummary()
    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error fetching analytics summary:", error)
    return NextResponse.json({ error: "Failed to fetch analytics summary" }, { status: 500 })
  }
}
