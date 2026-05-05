interface TableFooterProps {
  colCount: number;
  summary?: string;
}

function TableFooter({ colCount, summary }: TableFooterProps) {
  const cols = `80px ${Array(colCount).fill("1fr").join(" ")} auto`;

  return (
    <div
      className="grid bg-slate-100 text-slate-500 border-t border-slate-300 text-sm font-medium h-10"
      style={{ gridTemplateColumns: cols }}
    >
      <div className="px-3 py-3 col-span-full">{summary ?? ""}</div>
    </div>
  );
}

export default TableFooter;
