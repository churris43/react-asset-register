import Field from "@/src/interfaces/field";
import CloseButton from "../ui/CloseButton";
import useModalForm from "@/src/hooks/useModalForm";
import SaveOrAddButton from "../ui/SaveOrAddButton";
import InputHTML from "../ui/InputHTML";

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
            {field.htmlElementType == "input" && (
              <InputHTML
                field={field}
                handleChange={handleChange}
                formData={formData}
              />
            )}
            {field.htmlElementType == "select_single" && (
              <select
                value={formData[field.name] || ""}
                onChange={handleChange}
                name={field.name}
              >
                <option value="">--Please choose an {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
        <div className="flex justify-end space-x-3">
          <CloseButton onClose={onClose} />
          <SaveOrAddButton mode={mode} />
        </div>
      </form>
    </>
  );
}

export default ModalForm;
