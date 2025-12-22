import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  variant?: "default" | "primary" | "success" | "warning" | "danger"
  className?: string
}

export function StatCard({ title, value, subtitle, icon, trend, variant = "default", className }: StatCardProps) {
  return (
    <Card
      className={cn(
        "border-border/50 transition-all hover:border-border hover:shadow-sm",
        variant === "primary" && "border-primary/20 bg-primary/5",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
              {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
            </div>
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium",
                  trend.value > 0 ? "text-chart-3" : trend.value < 0 ? "text-chart-4" : "text-muted-foreground",
                )}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}% {trend.label}
              </p>
            )}
          </div>
          {icon && <div className="text-muted-foreground/50">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
