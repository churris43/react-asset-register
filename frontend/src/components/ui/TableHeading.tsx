import Heading from "@/src/interfaces/heading";
import { PaginationSearchParams } from "@/src/interfaces/paginationSearchParams";
import HeadingSortButton from "./HeadingSortButton";

interface tableHeadingProps {
  headings: Heading[];
  currentSortField?: string;
  currentSortOrder?: string;
  searchParams?: PaginationSearchParams;
}

function TableHeading({
  headings,
  currentSortField,
  currentSortOrder,
  searchParams,
}: tableHeadingProps) {
  const cols = `80px ${headings.map(() => "1fr").join(" ")} auto`;

  return (
    <div
      className="grid grid-cols-5 bg-gray-100 text-gray-700 font-semibold h-10 border-b border-gray-200"
      style={{ gridTemplateColumns: cols }}
    >
      {headings.map((heading: Heading) => (
        <div key={heading.label} className="px-3 py-4 flex items-center gap-1">
          {heading.label}
          {heading.sortField !== undefined && (
            <HeadingSortButton
              sortField={heading.sortField}
              currentSortField={currentSortField}
              currentSortOrder={currentSortOrder}
              searchParams={searchParams}
            />
          )}
        </div>
      ))}
      <div className="px-3 py-4 justify-self-end">Action</div>
    </div>
  );
}

export default TableHeading;