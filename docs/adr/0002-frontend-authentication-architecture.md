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

`middleware.ts` runs on the Edge Runtime before every page request. It is the first line of defence — it decides whether to let the request through or redirect to `/login`.

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
          No  → Token expired but refresh_token exists?
                  Yes → NextResponse.next()  (fetchWithAuth will refresh later)
                  No  → NextResponse.redirect(/login)
```

### Why expired tokens are let through

When the access token is expired, middleware does not attempt the refresh itself. Instead it checks for the presence of a `refresh_token` and lets the request through if one exists. The actual refresh is handled lazily by `fetchWithAuth` when a server action makes its first API call and receives a 401 from Express.

This keeps middleware fast and simple — it avoids making an outbound HTTP call to Express on every page load. The refresh happens exactly once per expired session, triggered by the first data fetch.

### What middleware does NOT do

Middleware only checks whether a token cookie exists and whether it is valid. It does not:
- Verify the user exists in the database
- Check roles or permissions
- Handle the token refresh itself

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

**2. Transparent token refresh on 401**

If Express returns a 401 (token expired or invalid), `fetchWithAuth` automatically attempts a refresh before failing:

```
fetchWithAuth receives 401 from Express
        ↓
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

If the refresh also fails (refresh token expired), `fetchWithAuth` throws `UNAUTHORIZED` — the server action catches this and returns an empty result, and the user will be redirected to `/login` on their next page navigation.

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
      - access_token exists but jwtVerify throws (expired)
      - refresh_token exists → NextResponse.next()
3.  /roles page renders (Server Component)
4.  Page calls getRoles() server action
5.  getRoles() calls fetchWithAuth('/roles')
6.  fetchWithAuth reads the expired access_token and forwards it to Express
7.  Express authenticate middleware calls jwt.verify() → throws TokenExpiredError
8.  Express returns 401
9.  fetchWithAuth catches 401:
      - reads refresh_token from cookie store
      - calls POST /auth/refresh on Express
      - Express validates refresh token → returns new accessToken
      - fetchWithAuth calls setAccessTokenCookie(newAccessToken)
      - retries GET /roles with new access_token
10. Express returns roles data
11. getRoles() returns data to the page — user sees their roles
```

The user sees no login redirect and no error. The entire refresh cycle is invisible.

---

## Files introduced

| File | Purpose |
|---|---|
| `frontend/src/middleware.ts` | Edge middleware — protects all non-public routes, redirects to /login |
| `frontend/src/libs/fetchWithAuth.ts` | Fetch wrapper — forwards auth cookie, handles transparent token refresh |
| `frontend/src/libs/authCookies.ts` | Shared access token cookie setter — single source of cookie options |
| `frontend/src/app/actions/authActions.ts` | Server actions for login and logout |
| `frontend/src/app/login/page.tsx` | Login form |

---

## Consequences

**What this gives you:**
- Pages are protected before they render — no flash of unauthenticated content
- Token refresh is completely transparent to the user and to server action code
- Browser JavaScript has zero access to tokens (httpOnly cookies)
- Cookie options are defined in one place

**What this does not give you:**
- Granular per-route permissions — middleware only checks authenticated vs. guest. Role-based access control would require additional middleware logic.
- Immediate feedback on session expiry for long-running pages — if the refresh token expires while the user is on a page (without navigating), they will only be redirected when they next trigger a server action.
