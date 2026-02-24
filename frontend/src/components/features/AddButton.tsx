"use client";

import { useState } from "react";
import GenericModal from "../ui/GenericModal";
import Field from "../../interfaces/field";

interface AddButtonProps {
  recordName: string;
  fields: Field[];
  createAction: (data: any) => Promise<{ success: boolean; error?: string }>;
}
function AddButton({ recordName, fields, createAction }: AddButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2"
        onClick={() => setIsModalOpen(true)}
      >
        + Add {recordName}
      </button>
      <GenericModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="add"
        id={0}
        fields={fields}
        createAction={createAction}
      />
    </>
  );
}

export default AddButton;
