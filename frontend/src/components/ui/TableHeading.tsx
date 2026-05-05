interface tableHeadingProps {
  headings: string[];
}

function TableHeading({ headings }: tableHeadingProps) {
  const cols = `80px ${headings.map(() => "1fr").join(" ")} auto`;

  return (
    <div
      className="grid grid-cols-5 bg-gray-100 text-gray-700 font-semibold h-10 border-b border-gray-200"
      style={{ gridTemplateColumns: cols }}
    >
      {headings.map((heading: string) => (
        <div key={heading} className="px-3 py-4">
          {heading}
        </div>
      ))}
      <div className="px-3 py-4 justify-self-end">Action</div>
    </div>
  );
}

export default TableHeading;
