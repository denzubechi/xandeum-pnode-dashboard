import type { PNode, PNodeStatus } from "../types";
import type { Pod } from "xandeum-prpc";

/**
 * Generate a deterministic ID from pubkey for display purposes
 */
function generateNodeId(pubkey: string): string {
  if (!pubkey) return "node-unknown";
  // Use first 8 chars of pubkey for a readable ID
  const shortHash = pubkey.slice(0, 8);
  return `node-${shortHash}`;
}

/**
 * Normalize a raw Pod from pRPC into our PNode type
 */
export function normalizePNode(pod: Pod): PNode {
  const ONLINE_THRESHOLD_SECONDS =
    Number(process.env.ONLINE_THRESHOLD_SECONDS) || 300;
  const thresholdTime =
    Math.floor(Date.now() / 1000) - ONLINE_THRESHOLD_SECONDS;

  const isOnline = pod.last_seen_timestamp >= thresholdTime;
  const status: PNodeStatus = isOnline ? "online" : "offline";

  const uptimeSeconds = pod.uptime || 0;
  const uptime = calculateUptime24h(uptimeSeconds);

  const storageUsedGB = Number(
    ((pod.storage_used || 0) / (1024 * 1024 * 1024)).toFixed(2)
  );
  const storageCapacityGB = Number(
    ((pod.storage_committed || 0) / (1024 * 1024 * 1024)).toFixed(2)
  );

  return {
    pubkey: pod.pubkey || "",
    status,
    address: pod.address || "",
    ip: pod.address?.split(":")[0] || "",
    lastSeen: new Date((pod.last_seen_timestamp || 0) * 1000),
    uptime,
    version: pod.version || "unknown",
    storageUsed: pod.storage_used || 0,
    storageTotal: pod.storage_committed || 0, // Use storage_committed as storage_total
    storageCommitted: pod.storage_committed || 0,
    id: generateNodeId(pod.pubkey || ""),
    region: "Unknown", // Will be enriched by geo service
    country: "Unknown", // Will be enriched by geo service
    city: undefined,
    storageUsedGB,
    storageCapacityGB,
    uptimePercentage: uptime,
    lat: undefined,
    lng: undefined,
  };
}

/**
 * Calculate 24h uptime percentage from uptime seconds
 */
export function calculateUptime24h(uptimeSeconds: number): number {
  const SECONDS_IN_24H = 86400;
  return Math.min((uptimeSeconds / SECONDS_IN_24H) * 100, 100);
}

/**
 * Calculate storage utilization percentage
 */
export function calculateUtilization(used: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((used / total) * 100 * 100) / 100;
}

/**
 * Calculate health score from multiple factors
 */
export function calculateHealthScore(
  uptime24h: number,
  storageUtilization: number,
  isOnline: boolean
): number {
  const uptimeScore = uptime24h * 0.5; // 50% weight
  const storageScore = (100 - storageUtilization) * 0.3; // 30% weight (lower is better)
  const onlineScore = isOnline ? 100 * 0.2 : 0; // 20% weight

  return uptimeScore + storageScore + onlineScore;
}

/**
 * Determine node tier based on health score
 */
export function getNodeTier(
  healthScore: number
): "premium" | "standard" | "basic" {
  if (healthScore >= 85) return "premium";
  if (healthScore >= 70) return "standard";
  return "basic";
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format date to relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}
