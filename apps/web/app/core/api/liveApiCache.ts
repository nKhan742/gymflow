// Live API Cache, In-Flight Deduplication & Mutation Invalidation Engine
interface ICachedResponse {
  bodyText: string;
  status: number;
  statusText: string;
  headers: [string, string][];
  timestamp: number;
}

const cacheStore = new Map<string, ICachedResponse>();
const inFlightRequests = new Map<string, Promise<Response>>();

const API_DOMAINS = [
  'gymflow-api-2jdh.onrender.com',
  '/api/v1',
  'api/v1',
];

function isApiUrl(url: string): boolean {
  return API_DOMAINS.some((domain) => url.includes(domain));
}

function getCacheKey(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

function normalizeEndpoint(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.pathname;
  } catch {
    return url.split('?')[0];
  }
}

export function invalidateApiCache(pattern?: string): void {
  if (!pattern) {
    cacheStore.clear();
    return;
  }
  const normalizedPattern = pattern.toLowerCase();
  for (const key of cacheStore.keys()) {
    if (key.toLowerCase().includes(normalizedPattern)) {
      cacheStore.delete(key);
    }
  }
}

export function clearApiCache(): void {
  cacheStore.clear();
  inFlightRequests.clear();
}

export function isApiCached(url: string): boolean {
  const key = getCacheKey(url);
  return cacheStore.has(key);
}

export function getCachedJson<T>(url: string): T | null {
  const key = getCacheKey(url);
  const entry = cacheStore.get(key);
  if (!entry) return null;
  try {
    return JSON.parse(entry.bodyText) as T;
  } catch {
    return null;
  }
}

export function setCachedJson(url: string, data: any): void {
  const key = getCacheKey(url);
  cacheStore.set(key, {
    bodyText: JSON.stringify(data),
    status: 200,
    statusText: 'OK',
    headers: [['content-type', 'application/json']],
    timestamp: Date.now(),
  });
}

function createResponse(cached: ICachedResponse): Response {
  return new Response(cached.bodyText, {
    status: cached.status,
    statusText: cached.statusText,
    headers: new Headers(cached.headers),
  });
}

let isInstalled = false;

export function installLiveApiCache(): void {
  if (isInstalled || typeof window === 'undefined') return;
  isInstalled = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

    // Only intercept live backend API calls
    if (!isApiUrl(url)) {
      return originalFetch(input, init);
    }

    const cacheKey = getCacheKey(url);

    // Bypass cache if explicitly requested via headers
    const bypassCache =
      init?.headers &&
      (('x-cache-bypass' in (init.headers as any) && (init.headers as any)['x-cache-bypass'] === 'true') ||
        (init.headers instanceof Headers && init.headers.get('x-cache-bypass') === 'true'));

    // HANDLE GET REQUESTS (Deduplication + Session Memory Cache)
    if (method === 'GET' && !bypassCache) {
      // 1. Check in-memory cache
      const cached = cacheStore.get(cacheKey);
      if (cached) {
        // Return instantly from memory without hitting the network
        return createResponse(cached);
      }

      // 2. Check in-flight duplicate requests
      const inFlight = inFlightRequests.get(cacheKey);
      if (inFlight) {
        // Await the ongoing request to avoid duplicate network calls
        const res = await inFlight;
        return res.clone();
      }

      // 3. Initiate single network request and register in inFlight
      const fetchPromise = (async () => {
        try {
          const res = await originalFetch(input, init);
          if (res.ok) {
            const bodyText = await res.text();
            const headersEntries: [string, string][] = [];
            res.headers.forEach((v, k) => headersEntries.push([k, v]));

            // Store in session cache
            cacheStore.set(cacheKey, {
              bodyText,
              status: res.status,
              statusText: res.statusText,
              headers: headersEntries,
              timestamp: Date.now(),
            });

            return new Response(bodyText, {
              status: res.status,
              statusText: res.statusText,
              headers: res.headers,
            });
          }
          return res;
        } finally {
          inFlightRequests.delete(cacheKey);
        }
      })();

      inFlightRequests.set(cacheKey, fetchPromise);
      return fetchPromise;
    }

    // HANDLE MUTATION REQUESTS (POST, PUT, PATCH, DELETE)
    const mutationResponse = await originalFetch(input, init);

    if (mutationResponse.ok && method !== 'GET') {
      // Automatically invalidate cached GET responses related to this resource
      const path = normalizeEndpoint(url);
      
      // Invalidate exact path and parent collection
      const pathSegments = path.split('/').filter(Boolean);
      // e.g. /api/v1/administration/roles/123 -> invalidate administration/roles
      if (pathSegments.length >= 3) {
        const resourcePrefix = pathSegments.slice(0, 4).join('/');
        invalidateApiCache(resourcePrefix);
      } else {
        invalidateApiCache(path);
      }
    }

    return mutationResponse;
  };
}
