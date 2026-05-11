interface SaveOrAddButtonProps {
  mode: string;
  isPending: boolean;
}

function SaveOrAddButton({ mode, isPending }: SaveOrAddButtonProps) {
  const buttonClass = `border border-blue-500 rounded bg-blue-500 text-white py-1 px-3 ${
    isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
  }`;

  return (
    <button disabled={isPending} className={buttonClass}>
      {mode == "edit" ? "Save" : "Add"}
    </button>
  );
}

export default SaveOrAddButton;
