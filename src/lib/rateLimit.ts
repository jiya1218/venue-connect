/**
 * In-memory rate limiter — max 3 submissions per IP per hour.
 * For production, replace with Redis or Supabase-backed store.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp ms
}

const store = new Map<string, RateLimitEntry>();

const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    // First request in this window
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetAt - now,
    };
  }

  entry.count += 1;
  store.set(ip, entry);
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetIn: entry.resetAt - now,
  };
}

/** Periodically clean up expired entries (called lazily) */
export function pruneRateLimitStore() {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key);
  });
}
