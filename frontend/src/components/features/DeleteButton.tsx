"use client";

import { useDelete } from "@/src/hooks/useDelete";
import { DeleteButton } from "../ui/DeleteButton";

interface DeleteRecordButtonPageProps {
  id: number;
  recordName: string;
  deleteAction: () => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function DeleteRecordButton({
  id,
  recordName,
  deleteAction,
  onSuccess,
  onError,
}: DeleteRecordButtonPageProps) {
  const { handleDelete, isPending } = useDelete(deleteAction, {
    recordName,
    onSuccess,
    onError,
  });

  return (
    <DeleteButton
      onDelete={handleDelete}
      isPending={isPending}
      ariaLabel={"Delete $(recordName}"}
    />
  );
}
