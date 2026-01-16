"use client";

interface DeleteProps {
  record: string;
  id: number;
  whenClicked: () => void;
}

function DeleteButton({ record, id }: DeleteProps) {
  // todo: How to update the state so the row gets removed when the record is deleted
  const DeleteButton = async () => {
    const res = await fetch("/api/" + record + "/" + id.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch data");
  };

  return (
    <button className="px-3 py-4 underline text-red-200" onClick={DeleteButton}>
      Delete
    </button>
  );
}

export default DeleteButton;
