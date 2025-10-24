/**
 * CORS (Cross-Origin Resource Sharing) Validation
 *
 * This module provides CORS validation to ensure only authorized
 * origins can make requests to our API endpoints.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * List of allowed origins for CORS
 * In production, only add your actual production domains
 */
const getAllowedOrigins = (): string[] => {
  const origins = [
    process.env.NEXT_PUBLIC_BASE_URL,
    "http://localhost:3000", // Local development
    "http://localhost:3001",
  ].filter((origin): origin is string => !!origin);

  // Add production domain if configured
  if (process.env.NEXT_PUBLIC_PRODUCTION_URL) {
    origins.push(process.env.NEXT_PUBLIC_PRODUCTION_URL);
  }

  return origins;
};

/**
 * Validates the request origin against allowed origins
 * Returns a NextResponse with 403 if origin is not allowed
 * Returns null if origin is valid (continue processing)
 */
export function validateCORS(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const allowedOrigins = getAllowedOrigins();

  // If there's no origin header, allow the request
  // (same-origin requests don't include origin header)
  if (!origin) {
    return null;
  }

  // Check if origin is in allowed list
  if (!allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: "CORS policy violation: Origin not allowed" },
      { status: 403 }
    );
  }

  // Origin is valid
  return null;
}

/**
 * Adds CORS headers to a response
 * Use this to add CORS headers to successful responses
 */
export function addCORSHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get("origin");
  const allowedOrigins = getAllowedOrigins();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  return response;
}
