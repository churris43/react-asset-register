import { buildHref } from "@/src/utils/url";
import Link from "next/link";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  searchParams: { [key: string]: string | string[] | undefined }; // ASK TO EXPLAIN THIS LINE
}

function PaginationNav({
  currentPage,
  totalPages,
  searchParams,
}: PaginationNavProps) {
  if (totalPages <= 1) return null;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {hasPrev ? (
        <Link
          href={buildHref(searchParams, { page: String(currentPage - 1) })}
          className="p-1 rounded hover:bg-blue-50 text-gray-600"
        >
          <MdChevronLeft size={20} />
        </Link>
      ) : (
        <span className="p-1 text-gray-300">
          <MdChevronLeft size={20} />
        </span>
      )}

      {Array.from({ length: totalPages }).map((_, i) => (
        <Link
          key={i + 1}
          href={buildHref(searchParams, { page: String(i + 1) })}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
            i + 1 === currentPage
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:bg-blue-50"
          }`}
        >
          {i + 1}
        </Link>
      ))}

      {hasNext ? (
        <Link
          href={buildHref(searchParams, { page: String(currentPage + 1) })}
          className="p-1 rounded hover:bg-blue-50 text-gray-600"
        >
          <MdChevronRight size={20} />
        </Link>
      ) : (
        <span className="p-1 text-gray-300">
          <MdChevronRight size={20} />
        </span>
      )}
    </div>
  );
}

export default PaginationNav;
