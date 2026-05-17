import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, errors } from "jose";
import { refreshAccessToken } from "@/src/libs/refreshAccessToken";

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

  // Reaching here means the access token is missing or expired.
  // Attempt a proactive silent refresh before the page renders.
  // This must happen in middleware rather than in fetchWithAuth because query
  // functions run during Server Component rendering — a context where
  // cookies().set() is not allowed — so a lazy refresh in fetchWithAuth would
  // throw and cause pages to return empty data.
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const newAccessToken = await refreshAccessToken(refreshToken);
  if (!newAccessToken) {
    // Refresh failed, network error, or unexpected response — fail closed
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Update the request Cookie header so server components in this same request
  // see the new access token — without this they would still read the expired
  // cookie and fetchWithAuth would get a 401 with no way to recover.
  const requestHeaders = new Headers(request.headers);
  const updatedCookies = (request.headers.get("cookie") ?? "")
    .split("; ")
    .filter((c) => !c.startsWith("access_token="))
    .concat(`access_token=${newAccessToken}`)
    .join("; ");
  requestHeaders.set("cookie", updatedCookies);

  // Pass the updated headers downstream and persist the new token in the
  // browser so future requests arrive with a valid cookie.
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set("access_token", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60, // 15 minutes — must match expiresIn in authServices.ts
  });
  return response;
}

// Run middleware on all routes except Next.js internals and static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
