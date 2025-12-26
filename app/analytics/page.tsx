"use client";

import {
  Activity,
  Award,
  Database,
  HardDrive,
  Server,
  TrendingUp,
  Download,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { NetworkHeader } from "@/components/network-header";
import { getAllPNodes } from "@/lib/services/pnode.service";
import {
  getAnalyticsSummary,
  getExtendedSummary,
  getTopNodes,
  getVersionDistribution,
} from "@/lib/services/analytics.service";
import { TopNodesExport } from "@/components/top-nodes-export";
import { exportToCSV } from "@/lib/utils/csv-export";

export default async function AnalyticsPage() {
  const [summary, extendedSummary, topNodes, versionDist, nodes] =
    await Promise.all([
      getAnalyticsSummary(),
      getExtendedSummary(),
      getTopNodes(),
      getVersionDistribution(),
      getAllPNodes(),
    ]);

  const regionalStats = nodes.reduce((acc, node) => {
    const region = node.region || "Unknown";
    if (!acc[region]) {
      acc[region] = { total: 0, online: 0 };
    }
    acc[region].total++;
    if (node.status === "online") {
      acc[region].online++;
    }
    return acc;
  }, {} as Record<string, { total: number; online: number }>);

  const topRegions = Object.entries(regionalStats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <NetworkHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Network Analytics
          </h1>
          <p className="mt-2 text-muted-foreground">
            In-depth analysis of pNode performance and distribution
          </p>
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Network Health"
            value={`${extendedSummary.onlinePercentage.toFixed(1)}%`}
            subtitle={extendedSummary.networkHealth}
            icon={<Activity className="size-6" />}
            className="stagger-item"
          />
          <StatCard
            title="Average Uptime (24h)"
            value={`${extendedSummary.averageUptime24h.toFixed(1)}%`}
            icon={<TrendingUp className="size-6" />}
            className="stagger-item"
          />
          <StatCard
            title="Avg Health Score"
            value={extendedSummary.averageHealthScore.toFixed(1)}
            subtitle="out of 100"
            icon={<Award className="size-6" />}
            className="stagger-item"
          />
          <StatCard
            title="Storage Pressure"
            value={`${extendedSummary.storagePressurePercent.toFixed(1)}%`}
            subtitle="nodes >80% used"
            icon={<HardDrive className="size-6" />}
            className="stagger-item"
          />
        </div>

        {/* Top Performing Nodes */}
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <Card
            className="animate-fade-in transition-all hover:border-primary/50"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Performing pNodes</CardTitle>
                <CardDescription>
                  Highest health scores in the network
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const exportData = topNodes.map((node, idx) => ({
                      Rank: idx + 1,
                      "Node ID":
                        nodes.find((n) => n.pubkey === node.pubkey)?.id ||
                        node.pubkey.slice(0, 8),
                      "Public Key": node.pubkey,
                      Region:
                        nodes.find((n) => n.pubkey === node.pubkey)?.region ||
                        "Unknown",
                      "Health Score": node.healthScore.toFixed(2),
                      "Uptime 24h %": node.uptime24h.toFixed(2),
                      Status:
                        nodes.find((n) => n.pubkey === node.pubkey)?.status ||
                        "unknown",
                    }));
                    exportToCSV(exportData, "top-nodes");
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
                >
                  <Download className="size-4" />
                  Export
                </button>
                <TopNodesExport topNodes={topNodes} nodes={nodes} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topNodes.map((node, idx) => {
                  const fullNode = nodes.find((n) => n.pubkey === node.pubkey);
                  return (
                    <Link
                      key={node.pubkey}
                      href={`/nodes/${fullNode?.id || node.pubkey}`}
                      className="block group"
                    >
                      <div className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-all group-hover:border-primary group-hover:bg-primary/5 cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <span className="text-sm font-semibold">
                              #{idx + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-mono text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {fullNode?.id || node.pubkey.slice(0, 8)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {fullNode?.region || "Unknown"} • Uptime:{" "}
                              {node.uptime24h.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-foreground">
                            {node.healthScore.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Health Score
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card
            className="animate-fade-in transition-all hover:border-primary/50"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Top regions by node count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRegions.map(([region, stats], idx) => {
                  const percentage = (stats.online / stats.total) * 100;
                  return (
                    <div key={region} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {region}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({stats.online}/{stats.total})
                          </span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentage >= 95
                              ? "bg-chart-3"
                              : percentage >= 85
                              ? "bg-chart-5"
                              : "bg-chart-4"
                          }`}
                          style={{
                            width: `${percentage}%`,
                            transitionDelay: `${idx * 0.05}s`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Version Distribution & Pod Statistics */}
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <Card
            className="animate-fade-in transition-all hover:border-primary/50"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader>
              <CardTitle>Version Distribution</CardTitle>
              <CardDescription>
                Node software versions across the network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versionDist.slice(0, 5).map((version, idx) => {
                  const percentage =
                    (version.count / summary.totalPNodes) * 100;
                  return (
                    <div key={version.version} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-foreground">
                            {version.version}
                          </span>
                          {idx === 0 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Consensus
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-foreground">
                            {version.count}
                          </span>
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            transitionDelay: `${idx * 0.05}s`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card
            className="animate-fade-in transition-all hover:border-primary/50"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader>
              <CardTitle>Pod Statistics</CardTitle>
              <CardDescription>
                Storage pod metrics and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                      <Server className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Pods
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {summary.totalPods}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                      <Activity className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Pods
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {summary.activePods}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-chart-3">
                      {((summary.activePods / summary.totalPods) * 100).toFixed(
                        1
                      )}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">Active Rate</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                      <Database className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Storage
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {summary.totalStorageCapacityTB.toFixed(1)} TB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Status Overview */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle>Network Status Overview</CardTitle>
            <CardDescription>
              Current status distribution across all pNodes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Online Nodes
                  </span>
                  <StatusBadge status="online" size="sm" />
                </div>
                <p className="text-3xl font-semibold text-foreground">
                  {summary.onlinePNodes}
                </p>
                <p className="text-xs text-muted-foreground">
                  {((summary.onlinePNodes / summary.totalPNodes) * 100).toFixed(
                    1
                  )}
                  % of network
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Offline Nodes
                  </span>
                  <StatusBadge status="offline" size="sm" />
                </div>
                <p className="text-3xl font-semibold text-foreground">
                  {summary.totalPNodes - summary.onlinePNodes}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(
                    ((summary.totalPNodes - summary.onlinePNodes) /
                      summary.totalPNodes) *
                    100
                  ).toFixed(1)}
                  % of network
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Avg Uptime
                </span>
                <p className="text-3xl font-semibold text-foreground">
                  {summary.averageUptime.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Network-wide average
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Storage Used
                </span>
                <p className="text-3xl font-semibold text-foreground">
                  {summary.totalStorageUsedTB.toFixed(1)} TB
                </p>
                <p className="text-xs text-muted-foreground">
                  of {summary.totalStorageCapacityTB.toFixed(1)} TB capacity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
