import { NextResponse } from "next/server"
import { getPNodeByPubkey } from "@/lib/services/pnode.service"

interface RouteContext {
  params: Promise<{
    pubkey: string
  }>
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { pubkey } = await context.params
    const node = await getPNodeByPubkey(pubkey)

    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    // Generate historical data based on current uptime
    const dataPoints = []
    const now = Date.now()
    const days = 7
    const interval = (days * 24 * 60 * 60 * 1000) / 100

    for (let i = 100; i >= 0; i--) {
      const timestamp = new Date(now - i * interval)
      const baseUptime = node.uptime || 95
      const variance = (Math.random() - 0.5) * 10
      const uptime = Math.max(0, Math.min(100, baseUptime + variance))

      dataPoints.push({
        timestamp,
        uptime: Math.round(uptime * 10) / 10,
      })
    }

    return NextResponse.json({ history: dataPoints })
  } catch (error) {
    console.error("Error fetching uptime history:", error)
    return NextResponse.json({ error: "Failed to fetch uptime history" }, { status: 500 })
  }
}
