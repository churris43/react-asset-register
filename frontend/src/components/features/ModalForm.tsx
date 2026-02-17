import Field from "@/src/interfaces/field";
import CloseButton from "../ui/CloseButton";
import useModalForm from "@/src/hooks/useModalForm";

interface ModalFormProps {
  fields: Field[];
  isModalOpen: boolean;
  mode: string;
  id: number;
  getAction?: () => Promise<any>;
  editAction?: (
    id: number,
    data: any,
  ) => Promise<{ success: boolean; error?: string }>;
  createAction?: (data: any) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

function ModalForm({
  fields,
  isModalOpen,
  mode,
  id,
  getAction,
  editAction,
  createAction,
  onClose,
}: ModalFormProps) {
  const { formData, handleChange, handleEdit, handleAdd } = useModalForm({
    id,
    getAction,
    isModalOpen,
    mode,
    fields,
    editAction,
    createAction,
    onClose,
  });
  if (!isModalOpen) return; // Skip fetching if modal is closed

  return (
    <>
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
          <CloseButton onClose={onClose} />
          <button className="border-2 rounded bg-blue-300 hover:bg-blue-300 text-white border-blue-500 py-1 px-2">
            {mode == "edit" ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </>
  );
}

export default ModalForm;
