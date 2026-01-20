"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Field from "../interfaces/field";

interface AddModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  id: number;
  mode: string;
  fields: Field[];
  getAction?: () => Promise<any>;
  editAction?: (
    id: number,
    data: any,
  ) => Promise<{ success: boolean; error?: string }>;
  createAction?: (data: any) => Promise<{ success: boolean; error?: string }>;
}

function GenericModal({
  isModalOpen,
  onClose,
  id,
  mode,
  fields,
  getAction,
  editAction,
  createAction,
}: AddModalProps) {
  const defaultValues = (fields: Field[]): Record<string, string | number> => {
    return Object.fromEntries(
      fields.map(({ name, defaultValue }) => [name, defaultValue || ""]),
    );
  };

  const [formData, setFormData] = useState(defaultValues(fields));

  useEffect(() => {
    if (!isModalOpen) return; // Skip fetching if modal is closed

    // This can be changed and get this passed from the parent object as opposed to fetching it from the Db
    if (mode != "add") {
      const fetchRecord = async () => {
        try {
          const data = getAction ? await getAction() : null;
          setFormData(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchRecord();
    }
  }, [id, isModalOpen]);

  if (!isModalOpen) return; // Skip fetching if modal is closed

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: implement the loading
    try {
      const response = createAction ? await createAction(formData) : null;
      // todo: clean form
    } catch (error) {
      //TODO: implement error handling
      console.log(error);
    } finally {
      setFormData(defaultValues(fields)); // Reset modal values to default
      onClose();
    }
  };

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = editAction ? await editAction(id, formData) : null;
      // todo: clean form
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
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
          <h2 className="mb-2 text-xl border-b-2">
            {mode == "add" ? " Add new record" : "Edit Record"}
          </h2>
          <form onSubmit={mode == "add" ? handleAdd : handleEdit}>
            {fields.map((field) => (
              <div className="mb-4" key={field.label}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium mb-2"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  name={field.name}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.placeholder}
                  required={field.required}
                />
              </div>
            ))}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2"
              >
                Close
              </button>
              <button className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2">
                {mode == "edit" ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default GenericModal;
