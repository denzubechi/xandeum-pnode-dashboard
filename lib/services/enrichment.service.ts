import { resolveNodeGeo } from "./geo.service";
import type { PNode } from "../types";

/**
 * Enrich a single pNode with geographic data
 */
export async function enrichPNodeWithGeo(node: PNode): Promise<PNode> {
  // Skip if already enriched with valid geo data
  if (node.region !== "Unknown" && node.country !== "Unknown") {
    return node;
  }

  const geo = await resolveNodeGeo(node.address || node.ip);

  if (geo) {
    return {
      ...node,
      region: geo.region,
      country: geo.country,
      city: geo.city,
      lat: geo.lat,
      lng: geo.lng,
    };
  }

  return node;
}

/**
 * Enrich multiple pNodes with geographic data in parallel (with concurrency limit)
 */
export async function enrichPNodesWithGeo(
  nodes: PNode[],
  concurrency = 10
): Promise<PNode[]> {
  const enrichedNodes: PNode[] = [];

  // Process in batches to avoid overwhelming the geo API
  for (let i = 0; i < nodes.length; i += concurrency) {
    const batch = nodes.slice(i, i + concurrency);
    const enrichedBatch = await Promise.all(
      batch.map((node) => enrichPNodeWithGeo(node))
    );
    enrichedNodes.push(...enrichedBatch);
  }

  return enrichedNodes;
}
