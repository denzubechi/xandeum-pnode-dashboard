"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, Copy, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Pagination } from "@/components/pagination"
import { useToast } from "@/hooks/use-toast"
import type { PNode, PNodeStatus } from "@/lib/types"

interface NodesTableProps {
  nodes: PNode[]
}

type SortKey = "id" | "status" | "region" | "uptime" | "storage" | "lastSeen"
type SortDirection = "asc" | "desc"

export function NodesTable({ nodes }: NodesTableProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<PNodeStatus | "all">("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("lastSeen")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Get unique regions for filter
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(nodes.map((n) => n.region)))
    return uniqueRegions.sort()
  }, [nodes])

  // Filter and sort nodes
  const filteredNodes = useMemo(() => {
    let filtered = nodes

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (node) =>
          node.id.toLowerCase().includes(query) ||
          node.pubkey.toLowerCase().includes(query) ||
          node.region.toLowerCase().includes(query) ||
          node.country.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((node) => node.status === statusFilter)
    }

    // Apply region filter
    if (regionFilter !== "all") {
      filtered = filtered.filter((node) => node.region === regionFilter)
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortKey) {
        case "id":
          comparison = a.id.localeCompare(b.id)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "region":
          comparison = a.region.localeCompare(b.region)
          break
        case "uptime":
          comparison = a.uptimePercentage - b.uptimePercentage
          break
        case "storage":
          comparison = a.storageUsedGB / a.storageCapacityGB - b.storageUsedGB / b.storageCapacityGB
          break
        case "lastSeen":
          comparison = a.lastSeen.getTime() - b.lastSeen.getTime()
          break
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [nodes, searchQuery, statusFilter, regionFilter, sortKey, sortDirection])

  const paginatedNodes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredNodes.slice(startIndex, startIndex + pageSize)
  }, [filteredNodes, currentPage, pageSize])

  const totalPages = Math.ceil(filteredNodes.length / pageSize)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("desc")
    }
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    })
  }

  const formatLastSeen = (date: Date) => {
    const minutes = Math.round((Date.now() - date.getTime()) / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>pNode Network</CardTitle>
        <CardDescription>
          {filteredNodes.length} of {nodes.length} nodes displayed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID, pubkey, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PNodeStatus | "all")}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="degraded">Degraded</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchQuery || statusFilter !== "all" || regionFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setRegionFilter("all")
                }}
                className="h-10"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("id")} className="-ml-2 h-8 font-medium">
                    Node ID
                    <ArrowUpDown className="ml-2 size-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("status")}
                    className="-ml-2 h-8 font-medium"
                  >
                    Status
                    <ArrowUpDown className="ml-2 size-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("region")}
                    className="-ml-2 h-8 font-medium"
                  >
                    Region
                    <ArrowUpDown className="ml-2 size-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("uptime")}
                    className="-ml-2 h-8 font-medium"
                  >
                    Uptime
                    <ArrowUpDown className="ml-2 size-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("storage")}
                    className="-ml-2 h-8 font-medium"
                  >
                    Storage
                    <ArrowUpDown className="ml-2 size-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("lastSeen")}
                    className="-ml-2 h-8 font-medium"
                  >
                    Last Seen
                    <ArrowUpDown className="ml-2 size-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No nodes found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedNodes.map((node) => (
                  <tr key={node.id} className="group border-b border-border/50 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-foreground">{node.id}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(node.pubkey, "Public key")}
                          className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Copy className="size-3" />
                        </Button>
                      </div>
                      <div className="mt-1 flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        <span className="truncate max-w-[200px]">{node.pubkey.slice(0, 16)}...</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(node.pubkey, "Public key")}
                          className="h-4 w-4 p-0"
                        >
                          <Copy className="size-2.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={node.status} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{node.region}</p>
                        <p className="text-xs text-muted-foreground">{node.country}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{node.uptimePercentage.toFixed(1)}%</span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={`h-full rounded-full transition-all ${
                              node.uptimePercentage >= 95
                                ? "bg-chart-3"
                                : node.uptimePercentage >= 85
                                  ? "bg-chart-5"
                                  : "bg-chart-4"
                            }`}
                            style={{ width: `${node.uptimePercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {node.storageUsedGB} / {node.storageCapacityGB} GB
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((node.storageUsedGB / node.storageCapacityGB) * 100)}% used
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">{formatLastSeen(node.lastSeen)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/nodes/${node.id}`}>
                        <Button variant="ghost" size="sm" className="h-8">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredNodes.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredNodes.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </CardContent>
    </Card>
  )
}
