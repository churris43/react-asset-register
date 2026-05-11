import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Field from "../interfaces/field";

interface UseEditProps {
  id: number;
  initialData?: Record<string, any>;
  isModalOpen: boolean;
  mode: string;
  fields: Field[];
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
  editAction,
  createAction,
  onClose,
}: UseEditProps) {
  const defaultValues = (fields: Field[]): Record<string, string | number> => {
    return Object.fromEntries(
      fields.map(({ name, defaultValue }) => [name, defaultValue || ""]),
    );
  };

  const [formData, setFormData] = useState(defaultValues(fields));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
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
  };

  const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: implement the loading
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
  };

  useEffect(() => {
    if (!isModalOpen || mode === "add" || !initialData) return;

    const extracted: Record<string, string | number> = {};
    fields.forEach((field) => {
      extracted[field.name] =
        initialData[field.name] ?? defaultValues(fields)[field.name];
    });
    setFormData(extracted);
  }, [isModalOpen, mode]);

  // todo: This is not right, this shoule be elsewhere, maybe a hook on its own
  const resetForm = () => {
    setFormData(defaultValues(fields));
    // setError(null);
  };

  return {
    formData,
    setFormData,
    resetForm,
    handleChange,
    handleEdit,
    handleAdd,
  };
}

export default useModalForm;
