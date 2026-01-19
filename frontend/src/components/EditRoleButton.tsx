"use client";

import { MdEdit } from "react-icons/md";
import RoleModal from "./RoleModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditRole from "../external/api/roles/roles";

interface EditProps {
  id: number;
}

function EditRoleButton({ id }: EditProps) {
  const router = useRouter();

  const EditButton = async () => {
    try {
      const res = await EditRole(id);
    } catch (error) {
      //todo: Error Handling
    } finally {
      router.refresh();
    }
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
