import { NextResponse } from "next/server"
import { getAllPNodes } from "@/lib/services/pnode.service"

export async function GET() {
  try {
    const nodes = await getAllPNodes()
    return NextResponse.json({ nodes, count: nodes.length })
  } catch (error) {
    console.error("Error fetching pNodes:", error)
    return NextResponse.json({ error: "Failed to fetch pNodes" }, { status: 500 })
  }
}
