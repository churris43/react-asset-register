"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/src/app/actions/authActions";

const links = [
  { href: "/", label: "Home" },
  { href: "/assets", label: "Assets" },
  { href: "/assetTypes", label: "Asset Types" },
  { href: "/roles", label: "Roles" },
];

function NavLinks() {
  const pathname = usePathname();

  // The root layout is served from the Next.js client-side router cache on
  // redirects, so the server-side JWT check in Navbar may not re-run.
  // Checking the pathname here (client-side, always current) ensures nav links
  // are never rendered on public pages regardless of the cached layout state.
  if (pathname === "/login") return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex space-x-8 text-sm font-medium">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={
            pathname === href
              ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5"
              : "navbar-item"
          }
        >
          {label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="navbar-item cursor-pointer mb-1.5"
      >
        Logout
      </button>
    </div>
  );
}

export default NavLinks;
