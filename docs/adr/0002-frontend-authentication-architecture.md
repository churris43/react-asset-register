# ADR 0002: Frontend Authentication Architecture

- **Date:** 2026-05-08
- **Status:** Accepted

---

## Context

ADR 0001 covers the backend JWT implementation and the overall token strategy. This document covers how the Next.js frontend enforces authentication — specifically how `middleware.ts`, `fetchWithAuth`, and the server actions work together to protect pages and API calls without exposing tokens to the browser.

---

## Key constraint: tokens are never accessible to browser JavaScript

Both cookies are set with `httpOnly: true`. This means the browser cannot read them via `document.cookie` or any JavaScript API. All token handling happens server-side — in Next.js middleware, server actions, and server components.

This is the reason the frontend is split into two distinct layers: middleware for route protection and `fetchWithAuth` for API calls.

---

## How middleware.ts protects pages

`middleware.ts` runs on the Edge Runtime before every page request. It is the first line of defence — it decides whether to let the request through, silently refresh the session, or redirect to `/login`.

```
Browser requests /roles
        ↓
middleware.ts runs (edge, before any page renders)
        ↓
Is the path in PUBLIC_PATHS (/login)?
  Yes → NextResponse.next()  (no auth check)
  No  → check access_token cookie
          ↓
        Token present and valid?
          Yes → NextResponse.next()
          No  → refresh_token exists?
                  No  → NextResponse.redirect(/login)
                  Yes → POST /auth/refresh (server-to-server to Express)
                            ↓
                        Refresh succeeded?
                          No  → NextResponse.redirect(/login)
                          Yes → set new access_token on response cookie
                                update request Cookie header
                                NextResponse.next()
```

### Why middleware handles the refresh rather than fetchWithAuth

Query functions (`getAssets`, `getRoles`, etc.) are called directly from Server Components during page rendering. In Next.js, `cookies().set()` is not allowed during Server Component rendering — it can only be called from Server Actions or Route Handlers. If the refresh were handled lazily inside `fetchWithAuth`, the attempt to write the new access token cookie would throw, causing every query to return empty data silently.

By handling the refresh in middleware, the new token is available before any Server Component renders. Middleware sets it in two places:
- **Response `Set-Cookie` header** — so the browser stores the new token for future requests
- **Request `Cookie` header** — so server components in the same request see the new token immediately, without a second round-trip

### What middleware does NOT do

Middleware only handles authentication, not authorisation. It does not:
- Verify the user exists in the database
- Check roles or permissions

---

## How the Navbar verifies authentication

The `Navbar` component (in `components/layout/Navbar.tsx`) is a Server Component that renders on every page load. Rather than checking whether the `access_token` cookie **exists**, it verifies the JWT is **valid**:

```
Navbar executes in server component context
  ↓
Get access_token cookie value
  ↓
JWT_SECRET defined?
  Yes → jwtVerify(token, secret)
    Valid   → isLoggedIn = true  → render NavLinks
    Expired → isLoggedIn = false → hide NavLinks
    Invalid → isLoggedIn = false → hide NavLinks
  No  → isLoggedIn = false → hide NavLinks
```

Why verify the JWT instead of checking cookie presence? A browser cookie with an expired JWT inside can persist longer than the JWT's validity window (due to timing differences in `maxAge`). Simply checking `!!cookie` would show nav links on the login page with a stale, expired cookie.

---

## How NavLinks handles the Next.js client-side router cache

The `NavLinks` component (in `components/layout/NavLinks.tsx`) is a client component that renders inside the `Navbar`. In Next.js App Router, **the root layout is reused across navigations** via the client-side router cache. When middleware redirects to `/login` due to expired tokens, the Navbar may be served from cache (using the previous JWT verification result from when the user was logged in), causing nav links to briefly show.

To handle this, `NavLinks` checks the current pathname on the client side:

```
NavLinks renders (possibly from cached layout)
  ↓
Check usePathname()
  ↓
pathname === '/login'?
  Yes → return null (no nav links)
  No  → render links normally
```

`usePathname()` is always in sync with the actual current URL (never cached), so this check fires immediately and prevents any flash of nav links on public pages.

**Why both layers (Navbar JWT + NavLinks pathname)?**
- **Navbar JWT check** — handles the primary case: verifies tokens are actually valid before rendering
- **NavLinks pathname check** — handles the edge case: the client-side router cache reusing layout segments. It's a defensive check that works regardless of the layout cache state.

---

## How fetchWithAuth makes authenticated API calls

All server actions call `fetchWithAuth` instead of `fetch` directly. It handles three responsibilities:

**1. Forwarding the access token to Express**

Since all API calls are server-to-server (Next.js → Express), the browser cookie is not automatically included. `fetchWithAuth` reads the `access_token` from the Next.js cookie store and manually attaches it as a `Cookie` header on the outgoing request.

```
Server action calls fetchWithAuth('/roles')
        ↓
fetchWithAuth reads access_token from Next.js cookie store
        ↓
fetch('http://api:3000/roles', { headers: { Cookie: 'access_token=...' } })
        ↓
Express authenticate middleware reads req.cookies.access_token
        ↓
jwt.verify() validates the token → route handler runs
```

**2. Token refresh fallback for server actions**

Page loads are handled proactively by middleware (see above). However, if the access token expires while the user is already on a page and they trigger a mutation (create, edit, delete), the middleware does not re-run. In that case `fetchWithAuth` handles the refresh itself:

```
User triggers a mutation → server action calls fetchWithAuth
        ↓
fetchWithAuth forwards the (now expired) access_token to Express
        ↓
Express authenticate middleware → jwt.verify() throws → returns 401
        ↓
fetchWithAuth catches 401:
  Read refresh_token from Next.js cookie store
        ↓
  POST /auth/refresh with Cookie: refresh_token=...
        ↓
  Express validates refresh token → returns new accessToken
        ↓
  setAccessTokenCookie() writes new access_token to browser cookie
        ↓
  Retry original request with new access_token
        ↓
Return response to server action (transparent to the caller)
```

`cookies().set()` works correctly here because server actions (user-triggered mutations) are a valid context for writing cookies — unlike Server Component rendering, which is read-only.

If the refresh also fails (refresh token expired), `fetchWithAuth` throws `UNAUTHORIZED` — the server action catches this and returns an empty result, and the user will be redirected to `/login` on their next navigation.

**3. Setting common headers**

`fetchWithAuth` always sets `Content-Type: application/json`, so server actions only need to pass the method and body.

---

## How the cookie is shared between fetchWithAuth and authActions

The access token cookie options (`httpOnly`, `sameSite`, `secure`, `maxAge`) are defined once in `src/libs/authCookies.ts` and used in two places:

| File | When it sets the cookie |
|---|---|
| `authActions.ts` (login) | After a successful login — first time the cookie is written |
| `fetchWithAuth.ts` (refresh) | After a successful token refresh — updates the existing cookie |

This ensures both places use identical cookie options. If the options ever need to change (e.g. adjusting `maxAge`), there is one place to update.

---

## Request flow: authenticated page load with expired access token

This is the most complex case — the user has a valid session but their 15-minute access token has expired.

```
1.  Browser navigates to /roles
2.  middleware.ts runs:
      - access_token is missing or jwtVerify throws (expired)
      - refresh_token exists → calls POST /auth/refresh on Express (server-to-server)
      - Express validates refresh token → returns new accessToken
      - middleware sets new access_token on the response (Set-Cookie for browser)
      - middleware updates the request Cookie header with the new access_token
      - NextResponse.next() with updated request headers
3.  /roles page renders (Server Component)
      - cookies() reads the updated request Cookie header → sees the new access_token
4.  Page calls getRoles()
5.  getRoles() calls fetchWithAuth('/roles')
6.  fetchWithAuth reads the new access_token and forwards it to Express
7.  Express authenticate middleware calls jwt.verify() → valid
8.  Express returns roles data
9.  getRoles() returns data to the page — user sees their roles
```

The user sees no login redirect and no error. The refresh happens before the page renders and is completely invisible.

---

## Files introduced

| File | Purpose |
|---|---|
| `frontend/src/middleware.ts` | Edge middleware — protects all non-public routes, redirects to /login |
| `frontend/src/libs/fetchWithAuth.ts` | Fetch wrapper — forwards auth cookie, handles transparent token refresh |
| `frontend/src/libs/authCookies.ts` | Shared access token cookie setter — single source of cookie options |
| `frontend/src/app/actions/authActions.ts` | Server actions for login and logout |
| `frontend/src/app/login/page.tsx` | Login form |
| `frontend/src/components/layout/Navbar.tsx` | Server component — verifies JWT validity before rendering NavLinks |
| `frontend/src/components/layout/NavLinks.tsx` | Client component — renders nav links, checks pathname to prevent display on login page |

---

## Consequences

**What this gives you:**
- Pages are protected before they render — no flash of unauthenticated content
- Token refresh is completely transparent to the user and to server action code
- Browser JavaScript has zero access to tokens (httpOnly cookies)
- Cookie options are defined in one place
- Server components always receive a valid token — middleware refreshes it before rendering begins
- Nav links are verified at two layers: server-side JWT validation + client-side pathname check. This handles both the primary case (valid token verification) and the edge case (Next.js client router cache reusing layout segments from when the user was logged in)
- No flash of nav links on the login page, even when the root layout is served from cache

**What this does not give you:**
- Granular per-route permissions — middleware only checks authenticated vs. guest. Role-based access control would require additional middleware logic.
- Immediate feedback on session expiry for long-running pages — if the refresh token expires while the user is on a page (without navigating), they will only be redirected when they next trigger a navigation or server action.
- Refresh token rotation — the refresh token has a fixed lifetime from login and is never renewed. A user who is actively using the application will still be logged out when the refresh token expires.
