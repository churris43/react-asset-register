"use client";

import { useState } from "react";
import GenericModal from "../ui/GenericModal";
import Field from "../../interfaces/field";
import FieldConfig from "../../interfaces/fieldConfig";

interface AddButtonProps {
  recordName: string;
  fields: Field[];
  createAction: (data: any) => Promise<{ success: boolean; error?: string }>;
  fieldConfig?: FieldConfig;
}
function AddButton({ recordName, fields, createAction, fieldConfig }: AddButtonProps) {
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
        fieldConfig={fieldConfig}
        createAction={createAction}
      />
    </>
  );
}

export default AddButton;
