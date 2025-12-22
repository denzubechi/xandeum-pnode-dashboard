import { geoCacheService } from "./cache.service";
import type { GeoLocation } from "../types";

const GEO_CACHE_KEY_PREFIX = "geo:";
const GEO_CACHE_TTL_SECONDS = 86400; // 24 hours

/**
 * Extract IP address from address string (format: "ip:port" or just "ip")
 */
function extractIP(address: string | undefined): string | null {
  if (!address) return null;

  // Remove port if present (format: "ip:port")
  const ip = address.split(":")[0].trim();

  // Basic IPv4 validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) {
    return null;
  }

  return ip;
}

/**
 * Resolve IP address to geographic location using ip-api.com
 * Results are cached for 24 hours to minimize API calls.
 */
export async function resolveIPToGeo(
  ip: string,
  timeoutMs = 5000
): Promise<GeoLocation | null> {
  // Check cache first
  const cacheKey = `${GEO_CACHE_KEY_PREFIX}${ip}`;
  const cached = geoCacheService.get<GeoLocation>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon`,
        {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as {
        status?: string;
        message?: string;
        lat?: number | string;
        lon?: number | string;
        country?: string;

        regionName?: string;
        city?: string;
      };

      if (data.status === "fail" || !data.lat || !data.lon || !data.country) {
        return null;
      }

      const geo: GeoLocation = {
        lat:
          typeof data.lat === "string" ? Number.parseFloat(data.lat) : data.lat,
        lng:
          typeof data.lon === "string" ? Number.parseFloat(data.lon) : data.lon,
        country: data.country || "Unknown",
        region: data.regionName || "Unknown",
        city: data.city || undefined,
      };

      // Cache for 24 hours
      geoCacheService.set(cacheKey, geo, GEO_CACHE_TTL_SECONDS);

      return geo;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (
        fetchError.name === "AbortError" ||
        fetchError.message?.includes("timeout")
      ) {
        return null;
      }

      throw fetchError;
    }
  } catch (error) {
    return null;
  }
}

/**
 * Resolve IP address from node address string
 */
export async function resolveNodeGeo(
  address: string | undefined,
  timeoutMs = 3000
): Promise<GeoLocation | null> {
  const ip = extractIP(address);
  if (!ip) {
    return null;
  }

  return resolveIPToGeo(ip, timeoutMs);
}
