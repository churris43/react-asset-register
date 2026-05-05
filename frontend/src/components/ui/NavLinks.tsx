"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/assets", label: "Assets" },
  { href: "/assetTypes", label: "Asset Types" },
  { href: "/roles", label: "Roles" },
];

function NavLinks() {
  const pathname = usePathname();
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
    </div>
  );
}

export default NavLinks;
