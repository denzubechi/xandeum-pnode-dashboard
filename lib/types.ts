export type PNodeStatus = "online" | "offline" | "degraded";

export interface PNode {
  pubkey: string;
  status: PNodeStatus;
  address: string;
  ip: string;
  lastSeen: Date;
  uptime: number;
  version: string;
  storageUsed: number; // bytes
  storageTotal: number; // bytes
  storageCommitted: number; // bytes
  ramUsed?: number; // bytes (optional, enriched from stats)
  ramTotal?: number;
  id: string; // Generated unique ID for UI
  region: string; // Geographic region
  country: string; // Country name
  city?: string; // City name (optional)
  storageUsedGB: number; // Storage in GB for display
  storageCapacityGB: number; // Capacity in GB for display
  uptimePercentage: number; // Uptime as percentage for display
  lat?: number; // Latitude for mapping
  lng?: number; // Longitude for mapping
}

export interface NodeStats {
  ram_used: number;
  ram_total: number;
  storage_used: number;
  storage_committed: number;
}

export interface NetworkStats {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  degradedNodes: number; // Added missing degradedNodes field
  totalStorageCapacityTB: number;
  totalStorageUsedTB: number;
  averageUptime: number;
  networkHealthScore: number;
  consensusVersion: string;
  totalPods: number;
  activePods: number;
}

export interface NodeMetrics {
  pubkey: string;
  healthScore: number;
  uptime24h: number;
  storageUtilization: number;
  tier: "premium" | "standard" | "basic";
}

export interface AnalyticsSummary {
  totalPNodes: number;
  onlinePNodes: number;
  onlinePercentage: number;
  totalPods: number;
  activePods: number;
  averageUptime: number;
  totalStorageUsed: number;
  totalStorageCapacity: number;
  totalStorageUsedTB: number;
  totalStorageCapacityTB: number;
  networkHealth: NetworkHealth;
  consensusVersion: string;
}

export interface StorageAnalytics {
  pubkey: string;
  storageUsed: number;
  storageTotal: number;
  utilizationPercent: number;
}

export interface VersionDistribution {
  version: string;
  count: number;
}

export type NetworkHealth = "healthy" | "degraded" | "unstable";

export interface ExtendedSummary {
  totalPNodes: number;
  onlinePercentage: number;
  averageUptime24h: number;
  averageHealthScore: number;
  storagePressurePercent: number;
  networkHealth: NetworkHealth;
}

export interface TopNode {
  pubkey: string;
  healthScore: number;
  uptime24h: number;
}

export interface StoragePressure {
  highPressureNodes: number;
  totalNodes: number;
  percent: number;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  country: string;
  region: string;
  city?: string;
}

export interface MapNode {
  pubkey: string;
  lat: number;
  lng: number;
  country: string;
  region: string;
  status: PNodeStatus;
  healthScore: number;
  uptime24h: number;
  storageUtilization: number;
  version: string;
  lastSeen: Date;
}

export interface GeoSummary {
  countries: Array<{ country: string; count: number }>;
  regions: Array<{ region: string; count: number }>;
}

export interface UptimeDataPoint {
  timestamp: Date;
  uptime: number;
}
