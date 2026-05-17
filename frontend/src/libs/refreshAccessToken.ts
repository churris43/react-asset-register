// Shared by middleware.ts (Edge Runtime) and fetchWithAuth.ts (Node Runtime).
// Uses only fetch and standard JS so it works in both contexts.
// Cookie writing stays in the callers — middleware writes to the response,
// fetchWithAuth writes to the Next.js cookie store.
export async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `refresh_token=${refreshToken}` },
    });
    if (!res.ok) return null;
    const { accessToken } = await res.json();
    return accessToken ?? null;
  } catch {
    return null;
  }
}
