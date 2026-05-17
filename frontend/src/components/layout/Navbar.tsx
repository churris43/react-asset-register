import { cookies } from "next/headers";
import NavLinks from "./NavLinks";

async function Navbar() {
  // Middleware guarantees a valid (or just-refreshed) access_token cookie by
  // the time a protected page renders, so presence is sufficient here. The
  // cached-layout edge case is handled client-side in NavLinks.
  const cookieStore = await cookies();
  const loggedIn = !!cookieStore.get("access_token")?.value;

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
