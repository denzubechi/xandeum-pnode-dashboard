import { NetworkHeader } from "@/components/network-header"
import { NodesTable } from "@/components/nodes-table"
import { getAllPNodes } from "@/lib/services/pnode.service"

export default async function NodesPage() {
  const nodes = await getAllPNodes()

  return (
    <div className="min-h-screen bg-background">
      <NetworkHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">pNode Network</h1>
          <p className="mt-2 text-muted-foreground">View and monitor all active pNodes in the Xandeum network</p>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <NodesTable nodes={nodes} />
        </div>
      </main>
    </div>
  )
}
