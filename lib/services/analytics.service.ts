import { getAllPNodes, getRawPodsForAnalytics } from "./pnode.service"
import { analyticsCacheService } from "./cache.service"
import { calculateUtilization, calculateUptime24h, calculateHealthScore, getNodeTier } from "../utils/format"
import type {
  AnalyticsSummary,
  StorageAnalytics,
  VersionDistribution,
  NetworkHealth,
  ExtendedSummary,
  NodeMetrics,
  TopNode,
  StoragePressure,
  PNode,
} from "../types"
import type { Pod } from "xandeum-prpc"

function calculateNetworkHealth(onlinePercentage: number): NetworkHealth {
  if (onlinePercentage >= 95) return "healthy"
  if (onlinePercentage >= 85) return "degraded"
  return "unstable"
}

const NODE_METRICS_CACHE_KEY = "computed_node_metrics"
const NODE_METRICS_CACHE_TTL_SECONDS = 60

function computeNodeMetricsFromData(pods: Pod[], nodes: PNode[]): NodeMetrics[] {
  const metrics: NodeMetrics[] = []

  for (const pod of pods) {
    const node = nodes.find((n) => n.pubkey === pod.pubkey)
    if (!node || !pod.pubkey) continue

    const uptimeSeconds = pod.uptime || 0
    const uptime24h = calculateUptime24h(uptimeSeconds)

    const storageCommitted = pod.storage_committed || 0
    const storageUsed = pod.storage_used || 0
    const storageUtilization = storageCommitted > 0 ? Math.round((storageUsed / storageCommitted) * 100 * 100) / 100 : 0

    const healthScore = calculateHealthScore(uptime24h, storageUtilization, node.status === "online")

    const tier = getNodeTier(healthScore)

    metrics.push({
      pubkey: pod.pubkey,
      healthScore,
      uptime24h,
      storageUtilization,
      tier,
    })
  }

  return metrics
}

export async function getCachedNodeMetrics(): Promise<NodeMetrics[]> {
  const cached = analyticsCacheService.get<NodeMetrics[]>(NODE_METRICS_CACHE_KEY)
  if (cached) {
    return cached
  }

  const [pods, nodes] = await Promise.all([getRawPodsForAnalytics(), getAllPNodes()])

  const metrics = computeNodeMetricsFromData(pods, nodes)
  analyticsCacheService.set(NODE_METRICS_CACHE_KEY, metrics, NODE_METRICS_CACHE_TTL_SECONDS)

  return metrics
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const nodes = await getAllPNodes()
  const rawPods = await getRawPodsForAnalytics()

  const ONLINE_THRESHOLD_SECONDS = Number(process.env.ONLINE_THRESHOLD_SECONDS) || 300
  const thresholdTime = Math.floor(Date.now() / 1000) - ONLINE_THRESHOLD_SECONDS
  const activePods = rawPods.filter((pod) => pod.last_seen_timestamp >= thresholdTime).length
  const totalPods = rawPods.length

  const totalPNodes = nodes.length
  const onlineNodes = nodes.filter((n) => n.status === "online")
  const onlinePNodes = onlineNodes.length

  const onlinePercentage = totalPNodes > 0 ? Math.round((onlinePNodes / totalPNodes) * 100 * 100) / 100 : 0

  const uptimes = onlineNodes.map((n) => n.uptime).filter((u) => u > 0)
  const averageUptime =
    uptimes.length > 0 ? Math.round((uptimes.reduce((sum, u) => sum + u, 0) / uptimes.length) * 100) / 100 : 0

  const totalStorageUsed = nodes.reduce((sum, n) => sum + (n.storageUsed || 0), 0)

  const totalStorageCapacity = rawPods.reduce((sum, pod) => {
    if (pod.storage_committed && pod.storage_committed > 0) {
      return sum + pod.storage_committed
    }
    return sum
  }, 0)

  const totalStorageUsedTB = totalStorageUsed / 1024 ** 4
  const totalStorageCapacityTB = totalStorageCapacity / 1024 ** 4

  const versionMap = new Map<string, number>()
  for (const node of nodes) {
    const version = node.version || "unknown"
    versionMap.set(version, (versionMap.get(version) || 0) + 1)
  }

  let consensusVersion = "unknown"
  let maxCount = 0
  for (const [version, count] of versionMap.entries()) {
    if (count > maxCount) {
      maxCount = count
      consensusVersion = version
    }
  }

  const networkHealth = calculateNetworkHealth(onlinePercentage)

  return {
    totalPNodes,
    onlinePNodes,
    onlinePercentage,
    totalPods,
    activePods,
    averageUptime,
    totalStorageUsed,
    totalStorageCapacity,
    totalStorageUsedTB,
    totalStorageCapacityTB,
    networkHealth,
    consensusVersion,
  }
}

export async function getStorageAnalytics(): Promise<StorageAnalytics[]> {
  const nodes = await getAllPNodes()

  return nodes.map((node) => ({
    pubkey: node.pubkey,
    storageUsed: node.storageUsed,
    storageTotal: node.storageTotal,
    utilizationPercent: calculateUtilization(node.storageUsed, node.storageTotal),
  }))
}

export async function getVersionDistribution(): Promise<VersionDistribution[]> {
  const nodes = await getAllPNodes()
  const versionMap = new Map<string, number>()

  for (const node of nodes) {
    const version = node.version || "unknown"
    versionMap.set(version, (versionMap.get(version) || 0) + 1)
  }

  return Array.from(versionMap.entries())
    .map(([version, count]) => ({ version, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getExtendedSummary(): Promise<ExtendedSummary> {
  const metrics = await getCachedNodeMetrics()
  const nodes = await getAllPNodes()

  const totalPNodes = metrics.length
  if (totalPNodes === 0) {
    return {
      totalPNodes: 0,
      onlinePercentage: 0,
      averageUptime24h: 0,
      averageHealthScore: 0,
      storagePressurePercent: 0,
      networkHealth: "unstable",
    }
  }

  const onlineNodes = nodes.filter((n) => n.status === "online")
  const onlinePercentage = Math.round((onlineNodes.length / totalPNodes) * 100 * 100) / 100

  const averageUptime24h =
    metrics.length > 0 ? Math.round((metrics.reduce((sum, m) => sum + m.uptime24h, 0) / metrics.length) * 100) / 100 : 0

  const averageHealthScore =
    metrics.length > 0
      ? Math.round((metrics.reduce((sum, m) => sum + m.healthScore, 0) / metrics.length) * 100) / 100
      : 0

  const highPressureNodes = metrics.filter((m) => m.storageUtilization > 80).length
  const storagePressurePercent = Math.round((highPressureNodes / totalPNodes) * 100 * 100) / 100

  const networkHealth = calculateNetworkHealth(onlinePercentage)

  return {
    totalPNodes,
    onlinePercentage,
    averageUptime24h,
    averageHealthScore,
    storagePressurePercent,
    networkHealth,
  }
}

export async function getNodeMetrics(): Promise<NodeMetrics[]> {
  return getCachedNodeMetrics()
}

export async function getTopNodes(): Promise<TopNode[]> {
  const metrics = await getCachedNodeMetrics()

  return metrics
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 10)
    .map((m) => ({
      pubkey: m.pubkey,
      healthScore: m.healthScore,
      uptime24h: m.uptime24h,
    }))
}

export async function getStoragePressure(): Promise<StoragePressure> {
  const metrics = await getCachedNodeMetrics()
  const totalNodes = metrics.length
  const highPressureNodes = metrics.filter((m) => m.storageUtilization > 80).length

  const percent = totalNodes > 0 ? Math.round((highPressureNodes / totalNodes) * 100 * 100) / 100 : 0

  return {
    highPressureNodes,
    totalNodes,
    percent,
  }
}
