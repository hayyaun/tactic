import "server-only";

// One shared bucket prevents spoofed IP/email headers from bypassing the limit.
// No enquiry data or IP addresses are sent to Redis.
const script =
  "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end; return n";
let localWindow = { until: 0, count: 0 };

export async function allowEnquiry(request: Request) {
  const hostname = new URL(`http://${request.headers.get("host") ?? "invalid"}`)
    .hostname;
  const localHost = ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
  const localOverride =
    localHost && process.env.CONTACT_LOCAL_RATE_LIMIT === "true";
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  const windowSeconds = 60;
  const limit = 30;
  if (url && token && !localOverride) {
    const endpoint = new URL(url);
    if (endpoint.protocol !== "https:")
      throw new Error("Invalid rate-limit configuration");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        script,
        "1",
        "tactic:enquiry:global",
        String(windowSeconds),
      ]),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    const result: { result?: unknown; error?: unknown } = await response.json();
    if (!response.ok || result.error || typeof result.result !== "number")
      throw new Error("Rate limiter unavailable");
    return result.result <= limit;
  }
  if (
    !localHost ||
    (process.env.NODE_ENV === "production" &&
      process.env.CONTACT_LOCAL_RATE_LIMIT !== "true")
  )
    throw new Error("Rate limiter not configured");
  const now = Date.now();
  if (now >= localWindow.until)
    localWindow = { until: now + windowSeconds * 1000, count: 0 };
  return ++localWindow.count <= limit;
}
