import { NextResponse } from "next/server"
import { getNodeMetrics } from "@/lib/services/analytics.service"

export async function GET() {
  try {
    const metrics = await getNodeMetrics()
    return NextResponse.json({ metrics, count: metrics.length })
  } catch (error) {
    console.error("Error fetching node metrics:", error)
    return NextResponse.json({ error: "Failed to fetch node metrics" }, { status: 500 })
  }
}
