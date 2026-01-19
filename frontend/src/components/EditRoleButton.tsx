"use client";

import { MdEdit } from "react-icons/md";
import RoleModal from "./RoleModal";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditProps {
  id: number;
}

function EditRoleButton({ id }: EditProps) {
  const router = useRouter();

  const EditButton = async () => {
    const res = await fetch("/api/roles/" + id.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to update data");
    router.refresh();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="" onClick={() => setIsModalOpen(true)}>
        <MdEdit className="h-4 w-4" />
      </button>
      <RoleModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roleId={id}
      />
    </>
  );
}

export default EditRoleButton;
