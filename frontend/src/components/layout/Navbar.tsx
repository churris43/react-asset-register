import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import NavLinks from "./NavLinks";

// Verifies the JWT itself rather than checking cookie presence — a stale
// access_token cookie with an expired JWT would otherwise make the nav visible.
async function isTokenValid(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

async function Navbar() {
  const loggedIn = await isTokenValid();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          Asset Register
        </div>
        {loggedIn && <NavLinks />}
      </div>
    </nav>
  );
}

export default Navbar;
