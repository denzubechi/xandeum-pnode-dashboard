interface MetricItemProps {
  label: string
  value: string | number
  sublabel?: string
}

export function MetricItem({ label, value, sublabel }: MetricItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
      {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
    </div>
  )
}
