interface SaveOrAddButtonProps {
  mode: string;
}

function SaveOrAddButton({ mode }: SaveOrAddButtonProps) {
  return (
    <button className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2">
      {mode == "edit" ? "Save" : "Add"}
    </button>
  );
}

export default SaveOrAddButton;
