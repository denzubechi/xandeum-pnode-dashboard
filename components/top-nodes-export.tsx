"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/lib/utils/csv-export";
import { useToast } from "@/hooks/use-toast";
import type { TopNode, PNode } from "@/lib/types";

interface TopNodesExportProps {
  topNodes: TopNode[];
  nodes: PNode[];
}

export function TopNodesExport({ topNodes, nodes }: TopNodesExportProps) {
  const { toast } = useToast();

  const handleExport = () => {
    const exportData = topNodes.map((node) => {
      const fullNode = nodes.find((n) => n.pubkey === node.pubkey);
      return {
        "Node ID": fullNode?.id || node.pubkey.slice(0, 8),
        "Public Key": node.pubkey,
        "Health Score": node.healthScore.toFixed(2),
        "Uptime 24h %": node.uptime24h.toFixed(2),
        Region: fullNode?.region || "Unknown",
        Country: fullNode?.country || "Unknown",
        Status: fullNode?.status || "Unknown",
      };
    });

    exportToCSV(exportData, "xandeum-top-nodes");
    toast({
      title: "Export successful",
      description: `Exported ${exportData.length} top nodes to CSV`,
    });
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      className="gap-2 bg-transparent"
    >
      <Download className="size-4" />
      Export
    </Button>
  );
}
