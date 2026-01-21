"use client";

import { useDelete } from "@/src/hooks/useDelete";
import { DeleteButton } from "../ui/DeleteButton";

interface DeleteRecordButtonPageProps {
  record: string;
  id: number;
  deleteAction: () => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function DeleteRecordButton({
  record,
  id,
  deleteAction,
  onSuccess,
  onError,
}: DeleteRecordButtonPageProps) {
  const { handleDelete, isPending } = useDelete(deleteAction, {
    record,
    onSuccess,
    onError,
  });

  return (
    <DeleteButton
      onDelete={handleDelete}
      isPending={isPending}
      ariaLabel={"Delete $(record}"}
    />
  );
}
