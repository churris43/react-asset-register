import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, errors } from "jose";

// Routes that don't require authentication
const PUBLIC_PATHS = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for public pages
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  // jose is used instead of jsonwebtoken because middleware runs on the Edge
  // Runtime, which does not support Node.js APIs that jsonwebtoken relies on
  if (token) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    try {
      await jwtVerify(token, secret);
      return NextResponse.next(); // token valid — let the request through
    } catch (err) {
      if (
        !(err instanceof errors.JWTExpired) &&
        !(err instanceof errors.JWTInvalid) &&
        !(err instanceof errors.JWTClaimValidationFailed)
      ) {
        // Unexpected error (e.g. missing JWT_SECRET env var) — fail closed
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // Known invalid/expired token — fall through to refresh check
    }
  }

  // Reaching here means either: no access token cookie (it expired and the browser
  // deleted it), or the token failed verification. Both cases are treated the same:
  // if a refresh token exists, let the request through — fetchWithAuth handles the
  // silent refresh lazily when the Express API returns a 401 (calls POST /auth/refresh,
  // stores the new access token, and retries the original request transparently).
  // If there is no refresh token either, the session is fully expired — redirect to login.
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// Run middleware on all routes except Next.js internals and static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
