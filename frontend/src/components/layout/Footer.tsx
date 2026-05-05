// This has to be client to be able to use new Date.
// More details https://nextjs.org/docs/messages/next-prerender-current-time-client
"use client";

import Link from "next/link";
import { Suspense } from "react";

// This is done
export function RelativeTime() {
  return (
    <span className="mr-1" suppressHydrationWarning>
      {new Date().getFullYear()}
    </span>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
        ©
        <Suspense fallback={<span>...</span>}>
          <RelativeTime />
        </Suspense>
        Asset Register. Developed by
        <Link
          className="underline ml-1"
          target="_blank"
          href="https://www.linkedin.com/in/arturo-andrade-hernandez-b52391b/"
        >
          Arturo Andrade Hernandez
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
