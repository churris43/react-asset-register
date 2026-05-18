"use client";

import Field from "../../interfaces/field";
import FieldConfig from "../../interfaces/fieldConfig";
import CloseButton from "./CloseButton";
import ModalForm from "../features/ModalForm";

interface AddModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  id: number;
  mode: string;
  fields: Field[];
  fieldConfig?: FieldConfig;
  initialData?: Record<string, any>;
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
  fieldConfig,
  initialData,
  editAction,
  createAction,
}: AddModalProps) {
  if (!isModalOpen) return null; // Skip fetching if modal is closed

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 shadow-lg"
          onClick={(e: React.MouseEvent) => e.stopPropagation()} //Prevents clicks inside the modal from bubbling up to the backdrop
        >
          <h2 className="mb-2 text-xl border-b border-gray-200 pb-2 text-gray-900">
            {mode == "add" ? " Add new record" : "Edit Record"}
          </h2>
          <ModalForm
            isModalOpen={isModalOpen}
            onClose={onClose}
            id={id}
            mode={mode}
            fields={fields}
            fieldConfig={fieldConfig}
            initialData={initialData}
            editAction={editAction}
            createAction={createAction}
          />
        </div>
      </div>
    </>
  );
}

export default GenericModal;
