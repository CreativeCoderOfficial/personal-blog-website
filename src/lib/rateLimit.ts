// src/lib/rateLimit.ts
//
// A lightweight in-memory rate limiter for API routes.
//
//   We keep a Map where each key is an IP address and each value tracks
//   how many requests that IP has made within the current time window.
//   On each request we either start a fresh window or increment the counter.
//   If the counter exceeds MAX_REQUESTS, we reject with a 429.
//
// Caveat / Tradeoff:
//   On Vercel, each serverless function invocation may run in a different
//   instance, so this Map is not shared across all concurrent requests.
//   This means the limit is per-instance rather than globally enforced.
//   For a personal blog donation endpoint this is an acceptable tradeoff
//   it meaningfully deters casual abuse without requiring any infrastructure.
//

// ── Types ────────────────────────────────────────────────────
// The shape of each entry in our rate limit store
interface RateLimitEntry {
  count: number;    
  windowStart: number; 
}

// ── Configuration ────────────────────────────────────────────
// 5 attempts per 10 minutes per IP.
const MAX_REQUESTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

// ── Store ────────────────────────────────────────────────────
// Module-level Map — persists for the lifetime of this serverless instance.
const rateLimitStore = new Map<string, RateLimitEntry>();

// ── Periodic cleanup ─────────────────────────────────────────
// Every 15 minutes we sweep out entries whose windows have already expired 
// setInterval at module scope runs once when the serverless instance starts.
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStart > WINDOW_MS) {
      rateLimitStore.delete(ip);
    }
  }
}, 15 * 60 * 1000);

// ── checkRateLimit ───────────────────────────────────────────
// Returns true if the request should be BLOCKED (limit exceeded).
// Returns false if the request is allowed through.
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    // First request from this IP — start a fresh window with count 1
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false; // allow
  }

  if (now - entry.windowStart > WINDOW_MS) {
    // The previous window has expired — reset to a fresh window
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false; // allow
  }

  if (entry.count >= MAX_REQUESTS) {
    // Within the window and limit already reached — block
    return true; // block
  }

  // Within the window and still under the limit — increment and allow.
  // We mutate the object directly since Map stores object references,
  // so no need to call .set() again.
  entry.count += 1;
  return false; // allow
}

// ── getIp ────────────────────────────────────────────────────
// Extracts the real client IP from a Next.js API request.
// On Vercel, the "x-forwarded-for" header contains a comma-separated list of IPs.
export function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}