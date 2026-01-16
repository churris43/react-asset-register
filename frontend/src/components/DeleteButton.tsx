"use client";
import { useRouter } from "next/navigation";

interface DeleteProps {
  record: string;
  id: number;
  whenClicked: () => void;
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
    <button className="px-3 py-4 underline text-red-200" onClick={DeleteButton}>
      Delete
    </button>
  );
}

export default DeleteButton;
