"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface UptimeHistoryChartProps {
  nodeId: string;
}

export function UptimeHistoryChart({ nodeId }: UptimeHistoryChartProps) {
  const [data, setData] = useState<{ date: string; uptime: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/uptime-history/${nodeId}`);
        if (!response.ok) throw new Error("Failed to fetch uptime history");

        const result = await response.json();
        const formatted = result.history.map(
          (point: { timestamp: string; uptime: number }) => ({
            date: new Date(point.timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            uptime: point.uptime,
          })
        );
        setData(formatted);
      } catch (error) {
        console.error("Error loading uptime history:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [nodeId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uptime History</CardTitle>
          <CardDescription>7-day uptime performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading chart data...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uptime History</CardTitle>
        <CardDescription>7-day uptime performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(var(--popover-foreground))",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              itemStyle={{ color: "hsl(var(--chart-3))" }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Uptime"]}
            />
            <Area
              type="monotone"
              dataKey="uptime"
              stroke="hsl(var(--chart-3))"
              strokeWidth={3}
              fill="url(#uptimeGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
