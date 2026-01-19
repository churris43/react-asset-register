"use client";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { deleteRole } from "../external/api/roles/roles";
interface DeleteProps {
  record: string;
  id: number;
}

function DeleteButton({ record, id }: DeleteProps) {
  const router = useRouter();

  const DeleteButton = async () => {
    try {
      const res = await deleteRole(id);
    } catch {
      //todo: Error Handling
    } finally {
      router.refresh();
    }
  };

  return (
    <>
      <button onClick={DeleteButton}>
        <MdDelete className="h-4 w-4" />
      </button>
    </>
  );
}

export default DeleteButton;
