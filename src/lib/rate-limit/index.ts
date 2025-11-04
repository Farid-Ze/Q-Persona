/**
 * Rate Limiting Library (Recommendation #2)
 * Implements in-memory rate limiting for API endpoints
 * For production, consider using @upstash/ratelimit with Redis
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting store
// For production, use Redis or Upstash
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Rate limit configurations per plan type
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  free: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  pro: {
    maxRequests: 1000,
    windowMs: 60 * 1000, // 1 minute
  },
  business: {
    maxRequests: 5000,
    windowMs: 60 * 1000, // 1 minute
  },
};

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  // Get or create entry
  let entry = rateLimitStore.get(key);

  // Reset if window has passed
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  // Check if limit exceeded
  const success = entry.count <= config.maxRequests;

  return {
    success,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    reset: entry.resetAt,
  };
}

/**
 * Middleware helper to apply rate limiting
 */
export function rateLimitMiddleware(
  identifier: string,
  planType: 'free' | 'pro' | 'business' = 'free'
): NextResponse | null {
  const config = RATE_LIMITS[planType];
  const result = checkRateLimit(identifier, config);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded',
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}

/**
 * Get workspace plan type from subscription
 */
export async function getWorkspacePlanType(
  workspaceId: string
): Promise<'free' | 'pro' | 'business'> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return 'free'; // Default to free if DB not configured
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?workspace_id=eq.${workspaceId}&limit=1`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    );

    if (!response.ok) {
      return 'free';
    }

    const subscriptions = await response.json();

    if (subscriptions.length === 0) {
      return 'free';
    }

    return subscriptions[0].plan_type || 'free';
  } catch (error) {
    console.error('Failed to get plan type:', error);
    return 'free';
  }
}

/**
 * Clean up old entries from rate limit store (call periodically)
 * Only run in Node.js runtime, not in edge runtime
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up every 5 minutes - only in Node.js runtime
// In edge runtime, cleanup happens naturally during rate limit checks
if (typeof setInterval !== 'undefined' && typeof window === 'undefined') {
  // Check if we're in a Node.js environment (not browser, not edge)
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
  }
}
