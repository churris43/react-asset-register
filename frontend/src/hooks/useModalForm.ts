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
  schemas?: Record<string, { add?: unknown; edit?: unknown }>;
  editAction?: (
    id: number,
    data: any,
  ) => Promise<{
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
  }>;
  createAction?: (data: any) => Promise<{
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
  }>;

  onClose: () => void;
}

function useModalForm({
  id,
  initialData,
  isModalOpen,
  mode,
  fields,
  fieldConfig,
  schemas,
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

  const defaultValues = (
    fields: Field[],
  ): Record<string, string | number | boolean> => {
    return Object.fromEntries(
      fields.map(({ name, defaultValue }) => [name, defaultValue || ""]),
    );
  };

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState(defaultValues(adjustedFields));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateFields = (): Record<string, string> => {
    // Object to collect validation errors { fieldName: "error message" }
    const errors: Record<string, string> = {};

    // Loop through each field in the form
    adjustedFields.forEach((field) => {
      // Get the validation schema for this field in the current mode (add/edit)
      const fieldSchemas = schemas?.[field.name];
      const schema = fieldSchemas?.[mode as "add" | "edit"] as unknown;
      if (!schema || typeof schema !== "object" || !("safeParse" in schema))
        return;

      // Run validation against the current field value
      const result = (
        schema as {
          safeParse: (val: unknown) => {
            success: boolean;
            error?: { issues: { message: string }[] };
          };
        }
      ).safeParse(formData[field.name]);

      // If validation failed, store the first error message for this field
      if (!result.success) {
        errors[field.name] =
          result.error?.issues[0]?.message || "Validation failed";
      }
    });

    // Return all collected errors (empty object if no errors)
    return errors;
  };

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

      // If any client side errors, abort the submission and display the errors
      const errors = validateFields();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      try {
        const response = editAction ? await editAction(id, formData) : null;
        if (response?.fieldErrors) {
          setFieldErrors(response.fieldErrors);
          // DON'T call onClose — keep modal open so user can fix
          return;
        }
        if (response?.success) {
          toast.success("Record updated successfully");
          resetForm(); // handleAdd only
          onClose();
        } else {
          toast.error("Failed to update record");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });

  const handleAdd = async (e: FormEvent<HTMLFormElement>) =>
    startTransition(async () => {
      e.preventDefault();

      // If any client side errors, abort the submission and display the errors
      const errors = validateFields();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      try {
        const response = createAction ? await createAction(formData) : null;
        if (response?.fieldErrors) {
          setFieldErrors(response.fieldErrors);
          // DON'T call onClose — keep modal open so user can fix
          return;
        }
        if (response?.success) {
          toast.success("Record created successfully");
          resetForm(); // handleAdd only
          onClose();
        } else {
          toast.error("Failed to create the record");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
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
    fieldErrors,
  };
}

export default useModalForm;
