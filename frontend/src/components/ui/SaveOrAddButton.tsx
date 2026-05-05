interface SaveOrAddButtonProps {
  mode: string;
}

function SaveOrAddButton({ mode }: SaveOrAddButtonProps) {
  return (
    <button className="border border-blue-500 rounded bg-blue-500 hover:bg-blue-600 text-white py-1 px-3">
      {mode == "edit" ? "Save" : "Add"}
    </button>
  );
}

export default SaveOrAddButton;
