"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRole, editRole, getRole } from "../external/api/roles/roles";

interface AddModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  roleId: number;
}

function RoleModal({ isModalOpen, onClose, roleId }: AddModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    role_name: "",
    staff_name: "",
  });

  useEffect(() => {
    if (!isModalOpen) return; // Skip fetching if modal is closed

    // This can be changed and get this passed from the parent object as opposed to fetching it from the Db
    if (roleId > 0) {
      const fetchRecord = async () => {
        try {
          const data = await getRole(roleId);
          setFormData({
            role_name: data.role_name,
            staff_name: data.staff_name,
          });
        } catch (error) {
          console.log(error);
        }
      };
      fetchRecord();
    }
  }, [roleId, isModalOpen]);

  if (!isModalOpen) return; // Skip fetching if modal is closed

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: implement the loading
    try {
      const response = await createRole(formData);
      // todo: clean form
    } catch (error) {
      //TODO: implement error handling
      console.log(error);
    } finally {
      onClose();
      router.refresh();
    }
  };

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //TO DO: investigate what this does

    try {
      const response = await editRole(roleId, formData);
      // todo: clean form
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
      router.refresh();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 "
        onClick={onClose}
      >
        <div
          className="bg-black rounded-lg p-6 max-w-md w-full mx-4 border-2 border-white"
          onClick={(e: React.MouseEvent) => e.stopPropagation()} //Prevents clicks inside the modal from bubbling up to the backdrop
        >
          <h2 className="mb-2 text-xl border-b-2">Add a new role</h2>
          <form onSubmit={roleId > 0 ? handleEdit : handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="role_name"
                className="block text-sm font-medium mb-2"
              >
                Role *
              </label>
              <input
                id="role_name"
                type="text"
                value={formData.role_name}
                onChange={handleChange}
                name="role_name"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="General Manager"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="staff_name"
                className="block text-sm font-medium mb-2"
              >
                Staff Name
              </label>
              <input
                id="staff_name"
                type="text"
                value={formData.staff_name}
                onChange={handleChange}
                name="staff_name"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tom Waits"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2"
              >
                Close
              </button>
              <button className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2">
                {roleId > 0 ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RoleModal;
