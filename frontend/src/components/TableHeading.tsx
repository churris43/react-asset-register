interface tableHeadingProps {
  headings: string[];
}

function TableHeading({ headings }: tableHeadingProps) {
  return (
    <div className="grid grid-cols-4 bg-slate-800 text-white font-semibold  h-10 grid-cols-[80px_1fr_1fr_1fr]">
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
