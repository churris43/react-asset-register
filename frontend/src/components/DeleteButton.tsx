"use client";
import { MdDelete } from "react-icons/md";
import { useTransition } from "react";

interface DeleteProps {
  record: string;
  id: number;
  deleteAction: () => Promise<{ success: boolean; error?: string }>;
}

function DeleteButton({ record, id, deleteAction }: DeleteProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete this ${record}?`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteAction();
    });
  };

  return (
    <>
      <button onClick={handleDelete}>
        <MdDelete className="h-4 w-4" />
      </button>
    </>
  );
}

export default DeleteButton;
