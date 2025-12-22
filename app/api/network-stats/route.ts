import { NextResponse } from "next/server"
import { getAnalyticsSummary } from "@/lib/services/analytics.service"

export async function GET() {
  try {
    const summary = await getAnalyticsSummary()

    const stats = {
      totalNodes: summary.totalPNodes,
      onlineNodes: summary.onlinePNodes,
      offlineNodes: summary.totalPNodes - summary.onlinePNodes,
      degradedNodes: 0,
      totalStorageCapacityTB: summary.totalStorageCapacityTB,
      totalStorageUsedTB: summary.totalStorageUsedTB,
      averageUptime: summary.averageUptime,
      networkHealthScore: summary.onlinePercentage,
      consensusVersion: summary.consensusVersion,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching network stats:", error)
    return NextResponse.json({ error: "Failed to fetch network stats" }, { status: 500 })
  }
}
