import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Asset Register. Developed by
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
