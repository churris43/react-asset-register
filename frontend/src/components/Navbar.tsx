import Link from "next/link";

function Navbar() {
  return (
    <>
      <nav className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold text-white">Asset Register</div>

          <div className="flex space-x-8 text-sm font-medium">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition"
            >
              Home
            </Link>
            <Link
              href="roles"
              className="text-gray-300 hover:text-white transition"
            >
              Roles
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
