import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes that don't require authentication
const PUBLIC_PATHS = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for public pages
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  // No access token at all — send to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // jose is used instead of jsonwebtoken because middleware runs on the Edge
  // Runtime, which does not support Node.js APIs that jsonwebtoken relies on
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    await jwtVerify(token, secret);
    return NextResponse.next(); // token valid — let the request through
  } catch {
    // Access token is expired or invalid.
    // If a refresh token exists, let the request through — the refresh is handled
    // lazily by fetchWithAuth: when a server action calls the Express API and gets
    // a 401, fetchWithAuth calls POST /auth/refresh, gets a new access token, and
    // retries the original request transparently.
    // If there is no refresh token either, the session is fully expired — redirect to login.
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

// Run middleware on all routes except Next.js internals and static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
