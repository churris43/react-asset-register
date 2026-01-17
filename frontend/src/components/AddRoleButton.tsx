"use client";

import { useState } from "react";
import AddRoleModal from "./AddRoleModal";

function AddRoleButton() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2"
        onClick={() => setIsModalOpen(true)}
      >
        Add Role
      </button>
      <AddRoleModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default AddRoleButton;
