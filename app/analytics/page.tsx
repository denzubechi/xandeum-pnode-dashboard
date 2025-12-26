import { Activity, Award, HardDrive, TrendingUp } from "lucide-react";
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
import { AnalyticsClientContent } from "@/components/analytics-client-content";

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
        <AnalyticsClientContent
          topNodes={topNodes}
          nodes={nodes}
          versionDist={versionDist}
          summary={summary}
          topRegions={topRegions}
        />

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
