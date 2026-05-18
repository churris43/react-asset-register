import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useTransition,
} from "react";
import { toast } from "react-toastify";
import Field from "../interfaces/field";
import FieldConfig from "../interfaces/fieldConfig";

interface UseEditProps {
  id: number;
  initialData?: Record<string, any>;
  isModalOpen: boolean;
  mode: string;
  fields: Field[];
  fieldConfig?: FieldConfig;
  editAction?: (
    id: number,
    data: any,
  ) => Promise<{ success: boolean; error?: string }>;
  createAction?: (data: any) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

function useModalForm({
  id,
  initialData,
  isModalOpen,
  mode,
  fields,
  fieldConfig,
  editAction,
  createAction,
  onClose,
}: UseEditProps) {
  // Apply fieldConfig to adjust field properties based on mode
  const adjustedFields = fields.map((field) => {
    const config = fieldConfig?.[field.name];
    if (!config || config.requiredInMode === mode) return field;
    return { ...field, required: false };
  });

  const defaultValues = (fields: Field[]): Record<string, string | number | boolean> => {
    return Object.fromEntries(
      fields.map(({ name, defaultValue }) => [name, defaultValue || ""]),
    );
  };

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState(defaultValues(adjustedFields));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name } = e.target;
    // Cast to HTMLInputElement to access type, checked, and value properties
    const target = e.target as HTMLInputElement;
    // Checkboxes use checked property (boolean), other inputs use value property (string)
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async (e: FormEvent<HTMLFormElement>) =>
    startTransition(async () => {
      e.preventDefault();

      try {
        const response = editAction ? await editAction(id, formData) : null;
        if (response?.success) {
          toast.success("Record updated successfully");
        } else {
          toast.error("Failed to update record");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        onClose();
      }
    });

  const handleAdd = async (e: FormEvent<HTMLFormElement>) =>
    startTransition(async () => {
      e.preventDefault();
      try {
        const response = createAction ? await createAction(formData) : null;
        if (response?.success) {
          toast.success("Record created successfully");
        } else {
          toast.error("Failed to create the record");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        resetForm();
        onClose();
      }
    });

  useEffect(() => {
    if (!isModalOpen || mode === "add" || !initialData) return;

    const extracted: Record<string, string | number | boolean> = {};
    adjustedFields.forEach((field) => {
      extracted[field.name] =
        initialData[field.name] ?? defaultValues(adjustedFields)[field.name];
    });
    setFormData(extracted);
  }, [isModalOpen, mode, initialData, fields, fieldConfig]);

  // todo: This is not right, this shoule be elsewhere, maybe a hook on its own
  const resetForm = () => {
    setFormData(defaultValues(adjustedFields));
    // setError(null);
  };

  return {
    formData,
    setFormData,
    resetForm,
    handleChange,
    handleEdit,
    handleAdd,
    isPending,
    adjustedFields,
  };
}

export default useModalForm;
