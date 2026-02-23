import Link from "next/link";

function Navbar() {
  return (
    <>
      <nav className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold text-white">Asset Register</div>

          <div className="flex space-x-8 text-sm font-medium">
            <Link href="/" className="navbar-item">
              Home
            </Link>
            <Link href="assets" className="navbar-item">
              Asset Register
            </Link>
            <Link href="assetTypes" className="navbar-item">
              Asset Types
            </Link>
            <Link href="roles" className="navbar-item">
              Roles
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
