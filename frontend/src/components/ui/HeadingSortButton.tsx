import { PaginationSearchParams } from "@/src/interfaces/paginationSearchParams";
import { buildHref } from "@/src/utils/url";
import Link from "next/link";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";

interface HeadingSortButtonProps {
  sortField: string;
  currentSortField?: string;
  currentSortOrder?: string;
  searchParams?: PaginationSearchParams;
}

function HeadingSortButton({
  sortField,
  currentSortField,
  currentSortOrder,
  searchParams = {},
}: HeadingSortButtonProps) {
  const isActive = sortField === currentSortField;
  const linkOrder = isActive && currentSortOrder === "desc" ? "asc" : "desc";

  return (
    <Link
      // PaginationSearchParams has known keys, but buildHref expects an index signature.
      // TypeScript won't widen a specific interface to { [key: string]: ... } without a cast.
      href={buildHref(searchParams as Record<string, string | undefined>, {
        sortField,
        sortOrder: linkOrder,
        page: "1",
      })}
      className="p-1 rounded hover:bg-blue-50 text-gray-600"
    >
      {isActive && currentSortOrder === "desc" ? (
        <MdArrowDownward size={20} />
      ) : (
        <MdArrowUpward size={20} />
      )}
    </Link>
  );
}

export default HeadingSortButton;