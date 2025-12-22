import { NextResponse } from "next/server"
import { getPNodeByPubkey } from "@/lib/services/pnode.service"

export async function GET(request: Request, { params }: { params: Promise<{ pubkey: string }> }) {
  try {
    const { pubkey } = await params
    const node = await getPNodeByPubkey(pubkey)

    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    return NextResponse.json({ node })
  } catch (error) {
    console.error("Error fetching pNode:", error)
    return NextResponse.json({ error: "Failed to fetch pNode" }, { status: 500 })
  }
}
