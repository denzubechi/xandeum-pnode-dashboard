import { cn } from "@/lib/utils"
import type { PNodeStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: PNodeStatus
  size?: "sm" | "md"
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        status === "online" && "border-chart-3/30 bg-chart-3/10 text-chart-3",
        status === "offline" && "border-chart-4/30 bg-chart-4/10 text-chart-4",
        status === "degraded" && "border-chart-5/30 bg-chart-5/10 text-chart-5",
      )}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" ? "size-1.5" : "size-2",
          status === "online" && "bg-chart-3",
          status === "offline" && "bg-chart-4",
          status === "degraded" && "bg-chart-5",
        )}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  )
}
