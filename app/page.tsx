import { Activity, Database, HardDrive, Server } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { NodeCountChart } from "@/components/node-count-chart";
import { StatusDistributionChart } from "@/components/status-distribution-chart";
import { RegionDistributionChart } from "@/components/region-distribution-chart";
import { getAllPNodes } from "@/lib/services/pnode.service";
import { getAnalyticsSummary } from "@/lib/services/analytics.service";

export default async function DashboardPage() {
  const [summary, nodes] = await Promise.all([
    getAnalyticsSummary(),
    getAllPNodes(),
  ]);

  const degradedNodes = nodes.filter((n) => n.status === "degraded").length;

  const stats = {
    totalNodes: summary.totalPNodes,
    onlineNodes: summary.onlinePNodes,
    offlineNodes: summary.totalPNodes - summary.onlinePNodes - degradedNodes,
    degradedNodes: degradedNodes,
    totalStorageCapacityTB: summary.totalStorageCapacityTB,
    totalStorageUsedTB: summary.totalStorageUsedTB,
    averageUptime: summary.averageUptime,
    networkHealthScore: summary.onlinePercentage,
    consensusVersion: summary.consensusVersion,
    totalPods: summary.totalPods,
    activePods: summary.activePods,
  };

  const recentNodes = nodes
    .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
    .slice(0, 5);

  const healthColor =
    stats.networkHealthScore >= 95
      ? "text-chart-3"
      : stats.networkHealthScore >= 85
      ? "text-chart-5"
      : "text-chart-4";

  return (
    <div className="min-h-screen bg-background">
      <NetworkHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Network Health Banner */}
        <div className="stagger-item mb-8 overflow-hidden rounded-xl border border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-6 transition-all hover:border-primary/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <Activity className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    Network Health
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Real-time monitoring of Xandeum storage network
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${healthColor}`}>
                {stats.networkHealthScore.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Health Score</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total pNodes"
            value={stats.totalNodes}
            subtitle="active"
            icon={<Server className="size-6" />}
            variant="primary"
            className="stagger-item"
          />
          <StatCard
            title="Online Nodes"
            value={stats.onlineNodes}
            subtitle={`${Math.round(
              (stats.onlineNodes / stats.totalNodes) * 100
            )}%`}
            icon={<Activity className="size-6" />}
            className="stagger-item"
          />
          <StatCard
            title="Storage Capacity"
            value={stats.totalStorageCapacityTB.toFixed(1)}
            subtitle="TB total"
            icon={<HardDrive className="size-6" />}
            className="stagger-item"
          />
          <StatCard
            title="Average Uptime"
            value={`${stats.averageUptime.toFixed(1)}%`}
            icon={<Database className="size-6" />}
            className="stagger-item"
          />
        </div>

        {/* Status Breakdown */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="stagger-item border-chart-3/20 bg-chart-3/5 transition-all hover:border-chart-3/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Online
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">
                    {stats.onlineNodes}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-chart-3/20">
                  <div className="size-3 rounded-full bg-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stagger-item border-chart-5/20 bg-chart-5/5 transition-all hover:border-chart-5/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Degraded
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">
                    {stats.degradedNodes}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-chart-5/20">
                  <div className="size-3 rounded-full bg-chart-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stagger-item border-chart-4/20 bg-chart-4/5 transition-all hover:border-chart-4/40 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Offline
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">
                    {stats.offlineNodes}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-chart-4/20">
                  <div className="size-3 rounded-full bg-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Visualizations */}
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <div className="animate-fade-in">
            <NodeCountChart totalNodes={stats.totalNodes} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <StatusDistributionChart stats={stats} />
          </div>
        </div>

        <div
          className="animate-fade-in mb-8"
          style={{ animationDelay: "0.2s" }}
        >
          <RegionDistributionChart nodes={nodes} />
        </div>

        {/* Storage Overview */}
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <Card
            className="animate-fade-in transition-all hover:border-primary/50"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader>
              <CardTitle>Storage Overview</CardTitle>
              <CardDescription>
                Network-wide storage utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Capacity
                    </span>
                    <span className="font-medium text-foreground">
                      {stats.totalStorageCapacityTB.toFixed(1)} TB
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Used Storage</span>
                    <span className="font-medium text-foreground">
                      {stats.totalStorageUsedTB.toFixed(1)} TB
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Available Storage
                    </span>
                    <span className="font-medium text-chart-3">
                      {(
                        stats.totalStorageCapacityTB - stats.totalStorageUsedTB
                      ).toFixed(1)}{" "}
                      TB
                    </span>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-medium text-foreground">
                      {Math.round(
                        (stats.totalStorageUsedTB /
                          stats.totalStorageCapacityTB) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${
                          (stats.totalStorageUsedTB /
                            stats.totalStorageCapacityTB) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="animate-fade-in transition-all hover:border-primary/50"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest pNode updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNodes.map((node, idx) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-all hover:border-border hover:bg-muted/30"
                    style={{ animationDelay: `${0.05 * idx}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded bg-secondary text-xs font-mono text-muted-foreground">
                        {node.id.split("-")[1]?.slice(0, 4) ||
                          node.id.slice(0, 4)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {node.region}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(
                            (Date.now() - node.lastSeen.getTime()) / 60000
                          )}
                          m ago
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={node.status} size="sm" />
                  </div>
                ))}
              </div>
              <Link href="/nodes">
                <Button
                  variant="outline"
                  className="mt-4 w-full bg-transparent transition-all hover:bg-secondary"
                >
                  View All Nodes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
