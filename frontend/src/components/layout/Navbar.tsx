import NavLinks from "../ui/NavLinks";

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          Asset Register
        </div>
        <NavLinks />
      </div>
    </nav>
  );
}

export default Navbar;
