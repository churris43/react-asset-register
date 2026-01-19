"use client";

import { MdEdit } from "react-icons/md";
import RoleModal from "./RoleModal";
import { useState } from "react";

interface EditProps {
  id: number;
}

function EditRoleButton({ id }: EditProps) {
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
