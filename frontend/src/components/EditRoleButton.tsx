"use client";

import { MdEdit } from "react-icons/md";
import GenericModal from "./ui/GenericModal";
import { useState } from "react";
import Field from "../interfaces/field";

interface EditProps {
  id: number;
  fields: Field[];
  getAction: () => Promise<{ success: boolean; error?: string }>;
  //editAction: () => Promise<{ success: boolean; error?: string }>;
  editAction?: (
    id: number,
    data: any,
  ) => Promise<{ success: boolean; error?: string }>;
}

function EditRoleButton({ id, fields, getAction, editAction }: EditProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="" onClick={() => setIsModalOpen(true)}>
        <MdEdit className="h-4 w-4" />
      </button>
      <GenericModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={id}
        mode="edit"
        fields={fields}
        getAction={getAction}
        editAction={editAction}
      />
    </>
  );
}

export default EditRoleButton;
