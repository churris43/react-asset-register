"use client";

import { MdEdit } from "react-icons/md";
import RoleModal from "./RoleModal";
import { useState } from "react";
import Field from "../interfaces/field";

interface EditProps {
  id: number;
  fields: Field[];
  getAction: () => Promise<{ success: boolean; error?: string }>; // No ID needed
}

function EditRoleButton({ id, fields, getAction }: EditProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="" onClick={() => setIsModalOpen(true)}>
        <MdEdit className="h-4 w-4" />
      </button>
      <RoleModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={id}
        mode="edit"
        fields={fields}
        getAction={getAction}
      />
    </>
  );
}

export default EditRoleButton;
