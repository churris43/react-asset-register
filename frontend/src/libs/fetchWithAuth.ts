import { cookies } from "next/headers";
import { setAccessTokenCookie } from "./authCookies";

const API_BASE = process.env.API_URL;

const buildCookieHeader = (token: string) => `access_token=${token}`;

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  // First attempt — forward the access token cookie to the Express API
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(accessToken ? { Cookie: buildCookieHeader(accessToken) } : {}),
    },
  });

  // If the response is not 401 the request succeeded — return it as-is
  if (res.status !== 401) return res;

  // --- Token refresh ---
  // The access token is expired or invalid. Attempt to get a new one using
  // the refresh token before retrying the original request.
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) throw new Error("UNAUTHORIZED");

  const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { Cookie: `refresh_token=${refreshToken}` },
  });

  // Refresh token is also expired or invalid — session is fully expired
  if (!refreshRes.ok) throw new Error("UNAUTHORIZED");

  const { accessToken: newAccessToken } = await refreshRes.json();

  // Persist the new access token in the cookie store for subsequent requests
  await setAccessTokenCookie(newAccessToken);

  // Retry the original request with the new access token
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Cookie: buildCookieHeader(newAccessToken),
    },
  });
}
