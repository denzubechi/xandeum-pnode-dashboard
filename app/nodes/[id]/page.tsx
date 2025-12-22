import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Globe,
  HardDrive,
  MapPin,
  Server,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NetworkHeader } from "@/components/network-header";
import { StatusBadge } from "@/components/status-badge";
import { MetricItem } from "@/components/metric-item";
import { UptimeHistoryChart } from "@/components/uptime-history-chart";
import { getPNodeById } from "@/lib/services/pnode.service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NodeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const node = await getPNodeById(id);

  if (!node) {
    notFound();
  }

  const storageUsedPercentage = Math.round(
    (node.storageUsedGB / node.storageCapacityGB) * 100
  );
  const storageAvailable = node.storageCapacityGB - node.storageUsedGB;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <NetworkHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/nodes">
          <Button variant="ghost" className="animate-fade-in mb-6 -ml-2">
            <ArrowLeft className="mr-2 size-4" />
            Back to Nodes
          </Button>
        </Link>

        {/* Node Header */}
        <div className="stagger-item mb-8 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-border sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-14">
                  <Server className="size-6 sm:size-7" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
                    {node.id}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    pNode Storage Provider
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <StatusBadge status={node.status} />
                <Badge
                  variant="outline"
                  className="border-border/50 bg-secondary/30 font-mono"
                >
                  v{node.version}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-border/50 bg-secondary/30"
                >
                  <MapPin className="mr-1 size-3" />
                  {node.region}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-sm text-muted-foreground">
                    Public Key:
                  </span>
                  <code className="rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground break-all">
                    {node.pubkey}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-fit p-1 sm:w-7"
                  >
                    <Copy className="size-3" />
                  </Button>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-sm text-muted-foreground">
                    IP Address:
                  </span>
                  <code className="rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground">
                    {node.ip}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-fit p-1 sm:w-7"
                  >
                    <Copy className="size-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p
                  className={`mt-1 text-3xl font-bold ${
                    node.uptime >= 95
                      ? "text-chart-3"
                      : node.uptime >= 85
                      ? "text-chart-5"
                      : "text-chart-4"
                  }`}
                >
                  {node.uptime.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="stagger-item transition-all hover:border-primary/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <MetricItem
                  label="Storage Capacity"
                  value={`${node.storageCapacityGB} GB`}
                  sublabel="Total available"
                />
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HardDrive className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stagger-item transition-all hover:border-primary/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <MetricItem
                  label="Storage Used"
                  value={`${node.storageUsedGB} GB`}
                  sublabel={`${storageUsedPercentage}% utilized`}
                />
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <HardDrive className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stagger-item transition-all hover:border-primary/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <MetricItem
                  label="Location"
                  value={node.region}
                  sublabel={node.country}
                />
                <div className="flex size-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                  <Globe className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stagger-item transition-all hover:border-primary/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <MetricItem
                  label="Last Seen"
                  value={formatDate(node.lastSeen)}
                  sublabel="Latest activity"
                />
                <div className="flex size-10 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                  <Wifi className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Uptime History Chart */}
        <div
          className="animate-fade-in mb-8"
          style={{ animationDelay: "0.2s" }}
        >
          <UptimeHistoryChart nodeId={node.pubkey} />
        </div>

        {/* Detailed Information */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Storage Details */}
          <Card
            className="animate-fade-in transition-all hover:border-primary/50"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader>
              <CardTitle>Storage Details</CardTitle>
              <CardDescription>
                Capacity and utilization information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Capacity</span>
                  <span className="font-medium text-foreground">
                    {node.storageCapacityGB} GB
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Used Storage</span>
                  <span className="font-medium text-foreground">
                    {node.storageUsedGB} GB
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Available Storage
                  </span>
                  <span className="font-medium text-chart-3">
                    {storageAvailable.toFixed(1)} GB
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className="font-medium text-foreground">
                    {storageUsedPercentage}%
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Storage Usage</span>
                  <span className="text-muted-foreground">
                    {storageUsedPercentage}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      storageUsedPercentage >= 90
                        ? "bg-chart-4"
                        : storageUsedPercentage >= 75
                        ? "bg-chart-5"
                        : "bg-primary"
                    }`}
                    style={{ width: `${storageUsedPercentage}%` }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <p className="text-sm font-medium text-foreground">
                  Storage Health
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {storageUsedPercentage < 75
                    ? "Healthy - Storage capacity is within optimal range"
                    : storageUsedPercentage < 90
                    ? "Warning - Storage is approaching capacity limits"
                    : "Critical - Storage capacity is nearly full"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Node Information */}
          <Card
            className="animate-fade-in transition-all hover:border-primary/50"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader>
              <CardTitle>Node Information</CardTitle>
              <CardDescription>
                Technical details and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricItem label="Node ID" value={node.id} />
                <MetricItem label="Version" value={node.version} />
                <MetricItem label="Region" value={node.region} />
                <MetricItem label="Country" value={node.country} />
                <MetricItem label="IP Address" value={node.ip} />
                <MetricItem
                  label="Status"
                  value={
                    node.status.charAt(0).toUpperCase() + node.status.slice(1)
                  }
                />
              </div>

              <div className="space-y-2 rounded-lg border border-border/50 bg-secondary/30 p-4">
                <p className="text-sm font-medium text-foreground">
                  Public Key
                </p>
                <code className="block break-all font-mono text-xs text-muted-foreground">
                  {node.pubkey}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full bg-transparent"
                >
                  <Copy className="mr-2 size-3" />
                  Copy Public Key
                </Button>
              </div>

              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <p className="text-sm font-medium text-foreground">
                  Network Status
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {node.status === "online"
                    ? "Node is online and responding to requests"
                    : node.status === "offline"
                    ? "Node is currently offline or unreachable"
                    : "Node is experiencing performance issues"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card
            className="animate-fade-in transition-all hover:border-primary/50 lg:col-span-2"
            style={{ animationDelay: "0.5s" }}
          >
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Uptime and reliability statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Current Uptime
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {node.uptime.toFixed(2)}%
                  </p>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        node.uptime >= 95
                          ? "bg-chart-3"
                          : node.uptime >= 85
                          ? "bg-chart-5"
                          : "bg-chart-4"
                      }`}
                      style={{ width: `${node.uptime}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Reliability Score
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {node.status === "online"
                      ? "A+"
                      : node.status === "degraded"
                      ? "B"
                      : "C"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on uptime and response time
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Last Activity</p>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round((Date.now() - node.lastSeen.getTime()) / 60000)}
                    m
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(node.lastSeen)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
