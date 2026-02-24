import { startTransition, useCallback, useTransition } from "react";

interface UseDeleteProps {
  recordName: string;
  onConfirm?: (record: string) => boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDelete(
  deleteAction: () => Promise<{ success: boolean; error?: string }>,
  props: UseDeleteProps,
) {
  const [isPending, setIsPending] = useTransition();
  const { recordName, onConfirm, onSuccess, onError } = props;

  //useCallback: This memoizes the function so it doesn't change on every render unless dependencies change.
  const handleDelete = useCallback(() => {
    //This makes the hook flexible and testable:
    //- In production: Uses browser's confirm() dialog
    //- In tests: You can inject a mock function that always returns true
    //- For custom UI: You could pass a function that opens a fancy modal
    const confirmed = onConfirm
      ? onConfirm(recordName)
      : confirm(`Are you sure you want to delete this ${recordName}?`);

    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteAction();

      if (result.success) {
        onSuccess?.();
      } else if (result.error) {
        onError?.(result.error);
      }
    });
  }, [deleteAction, recordName, onConfirm, onSuccess, onError]);

  return { handleDelete, isPending };
}
