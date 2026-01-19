"use client";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
interface DeleteProps {
  record: string;
  id: number;
}

function DeleteButton({ record, id }: DeleteProps) {
  const router = useRouter();

  const DeleteButton = async () => {
    const res = await fetch("/api/" + record + "/" + id.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch data");
    router.refresh();
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
