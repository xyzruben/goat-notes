/**
 * Rate Limiting Configuration using Upstash Redis
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a free account at https://upstash.com/
 * 2. Create a new Redis database
 * 3. Add these environment variables to your .env file:
 *    - UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
 *    - UPSTASH_REDIS_REST_TOKEN=your_token_here
 * 4. Add the same variables to Vercel Environment Variables for production
 *
 * IMPORTANT: Never commit your Upstash credentials to git!
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

/**
 * Extract IP address from request for rate limiting
 * Works with both local development and Vercel deployment
 */
export function getClientIp(request: NextRequest): string {
  // Try to get IP from Vercel headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  // Try real IP header (Vercel)
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback for local development
  return "127.0.0.1";
}

// In-memory fallback for development when Upstash is not configured
class InMemoryRateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();

  async limit(identifier: string, tokens: number = 1) {
    const now = Date.now();
    const key = identifier;
    const entry = this.store.get(key);

    // Clean up expired entries
    if (entry && entry.resetAt < now) {
      this.store.delete(key);
    }

    const current = entry && entry.resetAt >= now ? entry : { count: 0, resetAt: now + 10000 };

    current.count += tokens;
    this.store.set(key, current);

    return {
      success: current.count <= 10, // 10 requests per 10 seconds
      limit: 10,
      remaining: Math.max(0, 10 - current.count),
      reset: current.resetAt,
      pending: Promise.resolve()
    };
  }
}

// Check if Upstash credentials are configured
const isUpstashConfigured =
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN;

// Redis client - only initialize if Upstash is configured
const redis = isUpstashConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * Standard rate limiter for general API endpoints
 * Limits: 10 requests per 10 seconds per IP address
 */
export const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
      prefix: "ratelimit:api",
    })
  : new InMemoryRateLimiter() as any;

/**
 * Strict rate limiter for AI endpoints (expensive operations)
 * Limits: 5 requests per 30 seconds per user
 * This prevents cost explosion from OpenAI API abuse
 */
export const aiRatelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, "30 s"),
      analytics: true,
      prefix: "ratelimit:ai",
    })
  : new InMemoryRateLimiter() as any;

/**
 * Auth rate limiter for login/signup endpoints
 * Limits: 5 attempts per 15 minutes per IP
 * Prevents brute force attacks
 */
export const authRatelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "ratelimit:auth",
    })
  : new InMemoryRateLimiter() as any;

// Log warning if Upstash is not configured
if (!isUpstashConfigured && process.env.NODE_ENV === "production") {
  console.warn(
    "⚠️  WARNING: Upstash Redis is not configured! Using in-memory rate limiting fallback. " +
    "This is NOT suitable for production across multiple server instances. " +
    "Please configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
  );
}
