"use client";

import { useState } from "react";
import RoleModal from "./RoleModal";

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
      <RoleModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roleId={0}
      />
    </>
  );
}

export default AddRoleButton;
