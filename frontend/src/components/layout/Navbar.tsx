import { cookies } from "next/headers";
import NavLinks from "./NavLinks";

async function Navbar() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("access_token");

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          Asset Register
        </div>
        {isLoggedIn && <NavLinks />}
      </div>
    </nav>
  );
}

export default Navbar;
