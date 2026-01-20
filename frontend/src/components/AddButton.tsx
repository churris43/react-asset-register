"use client";

import { useState } from "react";
import RoleModal from "./RoleModal";
import Field from "../interfaces/field";

interface AddButtonProps {
  record: string;
  fields: Field[];
}
function AddButton({ record, fields }: AddButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2"
        onClick={() => setIsModalOpen(true)}
      >
        + Add {record}
      </button>
      <RoleModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="add"
        id={0}
        fields={fields}
      />
    </>
  );
}

export default AddButton;
