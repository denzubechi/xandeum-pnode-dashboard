import { prpcClient, SEED_IPS } from "../config/prpc";
import { PrpcClient } from "xandeum-prpc";
import {
  nodeCacheService,
  statsCacheService,
  analyticsCacheService,
} from "./cache.service";
import { enrichPNodesWithGeo } from "./enrichment.service";
import { normalizePNode } from "../utils/format";
import type { PNode, NodeStats } from "../types";
import type { Pod } from "xandeum-prpc";

const CACHE_KEY = "pnodes";
const CACHE_TTL_SECONDS = 30;

async function discoverPNodesViaGossip(): Promise<PNode[]> {
  const discoveredNodes: PNode[] = [];

  try {
    let response;
    try {
      response = await prpcClient.getPodsWithStats();
    } catch (statsError) {
      response = await prpcClient.getPods();
    }

    for (const pod of response.pods) {
      try {
        const normalized = normalizePNode(pod);
        if (normalized.pubkey) {
          discoveredNodes.push(normalized);
        }
      } catch (error) {
        // Continue processing other nodes
      }
    }

    if (discoveredNodes.length > 0) {
      return discoveredNodes;
    }
  } catch (error) {
    // Try fallback seeds
  }

  // Fallback: try other seed IPs if primary fails
  for (let i = 1; i < SEED_IPS.length && discoveredNodes.length === 0; i++) {
    try {
      const fallbackClient = new PrpcClient(SEED_IPS[i], { timeout: 5000 });
      const response = await fallbackClient.getPods();

      for (const pod of response.pods) {
        try {
          const normalized = normalizePNode(pod);
          if (normalized.pubkey) {
            discoveredNodes.push(normalized);
          }
        } catch (error) {
          // Continue processing other nodes
        }
      }

      if (discoveredNodes.length > 0) {
        break;
      }
    } catch (error) {
      // Continue to next seed IP
    }
  }

  return discoveredNodes;
}

/**
 * Get all pNodes, using cache if available
 */
export async function getAllPNodes(): Promise<PNode[]> {
  const cached = nodeCacheService.get<PNode[]>(CACHE_KEY);
  if (cached) {
    console.log(`📦 Using cached pNodes (${cached.length} nodes)`);
    return cached;
  }

  console.log("🔍 Discovering pNodes via gossip (cache miss)...");
  const nodes = await discoverPNodesViaGossip();
  console.log(`   Found ${nodes.length} nodes from gossip`);

  // Deduplicate by pubkey
  const seen = new Map<string, PNode>();
  const uniqueNodes: PNode[] = [];

  for (const node of nodes) {
    if (!node.pubkey) continue;

    if (!seen.has(node.pubkey)) {
      seen.set(node.pubkey, node);
      uniqueNodes.push(node);
    }
  }

  console.log(`   Deduplicated to ${uniqueNodes.length} unique nodes`);
  console.log(
    `   Online: ${
      uniqueNodes.filter((n) => n.status === "online").length
    }, Offline: ${uniqueNodes.filter((n) => n.status === "offline").length}`
  );

  console.log("   🌍 Enriching with geographic data...");
  const enrichedNodes = await enrichPNodesWithGeo(uniqueNodes, 20);
  console.log("   ✅ Geographic enrichment complete");

  nodeCacheService.set(CACHE_KEY, enrichedNodes, CACHE_TTL_SECONDS);
  console.log(`   ✅ Cached ${enrichedNodes.length} nodes`);

  return enrichedNodes;
}

export async function getPNodeByPubkey(pubkey: string): Promise<PNode | null> {
  const nodes = await getAllPNodes();
  return nodes.find((node) => node.pubkey === pubkey) || null;
}

export async function getPNodeById(id: string): Promise<PNode | null> {
  const nodes = await getAllPNodes();
  return nodes.find((node) => node.id === id) || null;
}

export async function refreshPNodes(): Promise<PNode[]> {
  nodeCacheService.delete(CACHE_KEY);
  return getAllPNodes();
}

export async function getNodeStatsByPubkey(
  pubkey: string
): Promise<NodeStats | null> {
  const CACHE_KEY = `node_stats_${pubkey}`;
  const CACHE_TTL_SECONDS = 120;

  const cached = statsCacheService.get<NodeStats>(CACHE_KEY);
  if (cached) {
    return cached;
  }

  try {
    const node = await getPNodeByPubkey(pubkey);
    if (!node || node.status !== "online") {
      return null;
    }

    const nodeAddress = node.address || node.ip;
    if (!nodeAddress) {
      return null;
    }

    const nodeIp = nodeAddress.split(":")[0];
    const nodeClient = new PrpcClient(nodeIp, { timeout: 8000 });
    const response = await nodeClient.getStats();

    if (!response) {
      return null;
    }

    const stats = {
      ram_used: (response as any).ram_used,
      ram_total: (response as any).ram_total,
      storage_used: (response as any).storage_used,
      storage_committed: (response as any).storage_committed,
    } as NodeStats;

    statsCacheService.set(CACHE_KEY, stats, CACHE_TTL_SECONDS);

    return stats;
  } catch (error) {
    return null;
  }
}

export async function getRawPodsForAnalytics(): Promise<Pod[]> {
  const CACHE_KEY_ANALYTICS = "pods_raw_analytics";
  const CACHE_TTL_SECONDS = 60;

  const cached = analyticsCacheService.get<Pod[]>(CACHE_KEY_ANALYTICS);
  if (cached) {
    return cached;
  }

  try {
    const response = await prpcClient.getPodsWithStats();
    const pods = response.pods || [];
    analyticsCacheService.set(CACHE_KEY_ANALYTICS, pods, CACHE_TTL_SECONDS);
    return pods;
  } catch (error) {
    const response = await prpcClient.getPods();
    const pods = response.pods || [];
    analyticsCacheService.set(CACHE_KEY_ANALYTICS, pods, CACHE_TTL_SECONDS);
    return pods;
  }
}
