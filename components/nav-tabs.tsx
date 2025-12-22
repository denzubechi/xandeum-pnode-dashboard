"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, BarChart3, Server } from "lucide-react"

const tabs = [
  { name: "Overview", href: "/", icon: Activity },
  { name: "pNodes", href: "/nodes", icon: Server },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export function NavTabs() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className="flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
      {tabs.map((tab) => {
        const active = isActive(tab.href)
        const Icon = tab.icon
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{tab.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
