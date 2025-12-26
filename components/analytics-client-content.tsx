"use client";

import { Download, Server, Activity, Database } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { exportToCSV } from "@/lib/utils/csv-export";
import type {
  PNode,
  TopNode,
  VersionDistribution,
  AnalyticsSummary,
} from "@/lib/types";

interface AnalyticsClientContentProps {
  topNodes: TopNode[];
  nodes: PNode[];
  versionDist: VersionDistribution[];
  summary: AnalyticsSummary;
  topRegions: Array<[string, { total: number; online: number }]>;
}

export function AnalyticsClientContent({
  topNodes,
  nodes,
  versionDist,
  summary,
  topRegions,
}: AnalyticsClientContentProps) {
  const handleExportTopNodes = () => {
    const exportData = topNodes.map((node, idx) => ({
      Rank: idx + 1,
      "Node ID":
        nodes.find((n) => n.pubkey === node.pubkey)?.id ||
        node.pubkey.slice(0, 8),
      "Public Key": node.pubkey,
      Region: nodes.find((n) => n.pubkey === node.pubkey)?.region || "Unknown",
      "Health Score": node.healthScore.toFixed(2),
      "Uptime 24h %": node.uptime24h.toFixed(2),
      Status: nodes.find((n) => n.pubkey === node.pubkey)?.status || "unknown",
    }));
    exportToCSV(exportData, "top-nodes");
  };

  const handleExportVersionDist = () => {
    const exportData = versionDist.map((v) => ({
      Version: v.version,
      Count: v.count,
      Percentage: ((v.count / summary.totalPNodes) * 100).toFixed(2) + "%",
    }));
    exportToCSV(exportData, "version-distribution");
  };

  return (
    <>
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
            <button
              onClick={handleExportTopNodes}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
            >
              <Download className="size-4" />
              Export
            </button>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Version Distribution</CardTitle>
              <CardDescription>
                Node software versions across the network
              </CardDescription>
            </div>
            <button
              onClick={handleExportVersionDist}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
            >
              <Download className="size-4" />
              Export
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {versionDist.slice(0, 5).map((version, idx) => {
                const percentage = (version.count / summary.totalPNodes) * 100;
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
            <CardDescription>Storage pod metrics and activity</CardDescription>
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
    </>
  );
}
