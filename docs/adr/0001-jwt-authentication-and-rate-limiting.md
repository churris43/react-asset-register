# ADR 0001: JWT Authentication and Rate Limiting

- **Date:** 2026-05-07
- **Status:** Accepted

---

## Context

The application needs to restrict access so that only authenticated users can read or modify asset data. This document explains the authentication approach chosen, why it was chosen over alternatives, and how rate limiting protects the login endpoints.

This ADR is written for developers familiar with Express.js who have not worked with authentication or rate limiting before.

---

## Background: What is JWT?

A JSON Web Token (JWT) is a string the server gives to a client after a successful login. The client sends it back on every subsequent request to prove who they are — the server does not need to look anything up in the database to verify it.

A JWT has three parts separated by dots:

```
header.payload.signature
```

- **Header** — the algorithm used to sign it (HS256 in this project)
- **Payload** — the data encoded in the token (`userId`, `email`, issued-at, expiry)
- **Signature** — a hash of the header and payload using a secret key (`JWT_SECRET`)

The payload is readable by anyone (it is base64-encoded, not encrypted). The signature is what makes it tamper-proof — if an attacker modifies the payload, the signature no longer matches and the server rejects it.

**Why this matters:** the server never needs to store tokens in the database. It validates a token solely by re-computing the signature using `JWT_SECRET` and comparing it to the one in the token.

### Where JWT_SECRET is stored

`JWT_SECRET` is a long random string that must be kept private. It is never committed to the repository. It is stored as an environment variable in each environment:

| Environment | Where it lives |
|---|---|
| Local development | `backend/.env` (git-ignored) |
| Render (backend) | Render dashboard → Environment variables |
| Vercel (frontend) | Vercel dashboard → Environment variables |

The same value must be set in both Render and Vercel — Express uses it to sign tokens and the Next.js middleware uses it to verify them. If they differ, token verification will fail for every request.

To generate a secure value:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

If `JWT_SECRET` is ever compromised, replace it in all three locations immediately. This will invalidate all existing tokens and force every user to log in again.

---

## Background: What is Rate Limiting?

Rate limiting restricts how many requests a single IP address can make to an endpoint within a time window. Without it, an attacker can automate thousands of login attempts per second to guess passwords (a brute force attack).

In this project, `express-rate-limit` is applied only to the auth endpoints — 10 requests per 5-minute window per IP. A legitimate user would rarely need more than 2–3 login attempts in that window. After 10 failed attempts the middleware returns a `429 Too Many Requests` response and the request never reaches the controller.

---

## Decision

### Two tokens, not one

The implementation uses two tokens with different lifetimes:

| Token | Lifetime | Purpose |
|---|---|---|
| Access token | 15 minutes | Sent with every API request to prove identity |
| Refresh token | 7 days | Used only to issue a new access token when the current one expires |

A single long-lived token would be simpler, but if it were stolen the attacker would have access for days. The short-lived access token limits the damage window to 15 minutes. The refresh token is only sent to one specific endpoint (`POST /auth/refresh`), reducing its exposure.

### Tokens are returned in the response body, not Set-Cookie

The Express login endpoint returns tokens as JSON:

```json
{ "accessToken": "...", "refreshToken": "..." }
```

The Next.js server action then sets them as `httpOnly` cookies in the browser. This is intentional — because all API calls go through Next.js server actions (server-to-server), the browser never calls Express directly. Setting cookies from the Next.js side avoids cross-origin cookie restrictions between the Vercel and Render domains.

### Cookies are httpOnly and sameSite: strict

```ts
res.cookie('access_token', token, {
  httpOnly: true,   // JavaScript in the browser cannot read this cookie
  secure: true,     // only sent over HTTPS
  sameSite: 'strict'
})
```

- `httpOnly` prevents XSS attacks from stealing the token via `document.cookie`
- `sameSite: strict` prevents the cookie from being sent by third-party sites (CSRF protection)
- `secure` ensures the cookie is never sent over unencrypted HTTP

### jose is used in Next.js middleware, jsonwebtoken is used in Express

This decision is specific to hosting the frontend on **Vercel**. Vercel runs Next.js `middleware.ts` on the Edge Runtime — a lightweight runtime distributed across global CDN nodes that only supports Web Platform APIs. It deliberately excludes Node.js-specific APIs to keep it fast and portable.

`jsonwebtoken` depends on the Node.js `crypto` API and will throw at runtime on the edge. `jose` is a JWT library written against the Web Crypto API, which is available on the Edge Runtime, in Node.js, and in browsers.

If the frontend were ever moved off Vercel to a platform running standard Node.js (Railway, Render, a VPS), `jsonwebtoken` could be used in middleware without any issues. Until then, `jose` must be used for any JWT operations in `middleware.ts`.

Express runs in a standard Node.js environment so `jsonwebtoken` works there without restriction.

Both libraries use the same `JWT_SECRET`, so tokens issued by Express are verifiable by the Next.js middleware and vice versa.

### Rate limiting is applied only to auth endpoints

```ts
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10                   // 10 requests per IP per window
})

router.post('/register', authLimiter, authController.register)
router.post('/login',    authLimiter, authController.login)
```

Only `/auth/login` and `/auth/register` are rate limited. These are the only endpoints susceptible to brute force attacks. The asset, role, and asset type endpoints are protected by the `authenticate` middleware instead — a valid token is required, so there is nothing to brute force.

`express-rate-limit` stores request counts in memory. This is sufficient for a single server instance. If the application is scaled to multiple instances in the future, counts should be moved to a shared store such as Redis (e.g. via Upstash).

---

## How a request flows through the system

### Login
```
1. User submits email and password in the browser
2. Next.js server action calls POST /auth/login on Express (server-to-server)
3. Express checks rate limit — rejects with 429 if exceeded
4. Express looks up the user in the database by email
5. bcrypt compares the submitted password against the stored hash
6. On success, Express signs an access token (15m) and refresh token (7d)
7. Express returns both tokens in the response body
8. Next.js server action sets both as httpOnly cookies in the browser
```

### Authenticated request
```
1. Browser triggers a server action (e.g. getAssets)
2. Server action reads the access_token cookie via Next.js cookies() API
3. Server action calls Express with Cookie: access_token=<token> header
4. authenticate middleware extracts the token from req.cookies.access_token
5. jwt.verify() checks the signature and expiry
6. If valid, req.user is set and the route handler runs
7. If expired, fetchWithAuth catches the 401, calls POST /auth/refresh,
   gets a new access token, updates the cookie, and retries the request
8. If the refresh token is also expired, the user is redirected to /login
```

### Token validation (no database involved)
```
1. Extract the token from the cookie
2. Re-compute: HMACSHA256(header + "." + payload, JWT_SECRET)
3. Compare result against the signature in the token
4. If they match and the token has not expired → valid
5. If they do not match or the token is expired → reject with 401
```

---

## Consequences

**What this approach gives you:**
- No session table in the database — the server is stateless
- Tokens are protected from JavaScript access (httpOnly)
- Short-lived access tokens limit the damage if a token is intercepted
- Rate limiting prevents automated brute force attacks on login

**What this approach does not give you:**
- Immediate token revocation — a valid access token cannot be invalidated before its 15-minute expiry. Logging out deletes the cookie client-side but the token remains technically valid until it expires. This is acceptable for most applications given the short window.
- Protection against a compromised `JWT_SECRET` — if the secret is leaked, all tokens can be forged. Store it securely and rotate it if compromised (rotating invalidates all existing tokens).
- Rate limiting across multiple server instances — `express-rate-limit` stores counts in memory per process. Scale to Redis if running more than one instance.

---

## Files introduced

| File | Purpose |
|---|---|
| `backend/src/types/AuthTypes.ts` | TypeScript interfaces for auth request bodies and JWT payload |
| `backend/src/services/authService.ts` | Business logic — register, login, refresh token |
| `backend/src/controllers/authController.ts` | HTTP handlers — validate input, call service, return response |
| `backend/src/routes/authRoutes.ts` | Route definitions with rate limiter applied |
| `backend/src/middleware/authenticate.ts` | JWT verification middleware for protected routes |
| `frontend/src/app/actions/authActions.ts` | Next.js server actions for login, logout, register |
| `frontend/src/lib/fetchWithAuth.ts` | Fetch wrapper that forwards auth cookie and handles token refresh |
| `frontend/src/middleware.ts` | Next.js edge middleware that redirects unauthenticated users to /login |
| `frontend/src/app/login/page.tsx` | Login form |

---

## References

- [JWT specification — jwt.io](https://jwt.io)
- [express-rate-limit docs](https://github.com/express-rate-limit/express-rate-limit)
- [jose library](https://github.com/panva/jose)
- [Next.js middleware docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
