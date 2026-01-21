"use client";

import { MdDelete } from "react-icons/md";

interface DeleteButtonProps {
  onDelete: () => void;
  isPending?: boolean;
  ariaLabel?: string;
}

export function DeleteButton({
  onDelete,
  isPending = false,
  ariaLabel = "Delete",
}: DeleteButtonProps) {
  return (
    <button
      onClick={onDelete}
      disabled={isPending}
      aria-label={ariaLabel} // Accessibility
      className={isPending ? "opacity-50 cursor-not-allowed" : ""}
    >
      <MdDelete className="h-4 w-4" />
    </button>
  );
}
