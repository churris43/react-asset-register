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
        className="rounded-full bg-blue-500 hover:bg-blue-600 text-white border-0 w-8 h-8 inline-flex items-center justify-center text-lg leading-none"
        onClick={() => setIsModalOpen(true)}
      >
        +
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
