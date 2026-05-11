"use client";

import { MdEdit } from "react-icons/md";
import GenericModal from "../ui/GenericModal";
import { useState } from "react";
import Field from "../../interfaces/field";

interface EditProps {
  id: number;
  fields: Field[];
  initialData: Record<string, any>;
  editAction?: (
    id: number,
    data: any,
  ) => Promise<{ success: boolean; error?: string }>;
}

function EditButton({ id, fields, initialData, editAction }: EditProps) {
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
        initialData={initialData}
        editAction={editAction}
      />
    </>
  );
}

export default EditButton;
