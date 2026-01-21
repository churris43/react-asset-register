import { useEffect, useState } from "react";
import Field from "../interfaces/field";

export interface UseLoadFormProps {
  getAction?: () => Promise<any>;
  isModalOpen: boolean;
  mode: string;
  fields: Field[];
}

function loadForm({ getAction, isModalOpen, mode, fields }: UseLoadFormProps) {
  const defaultValues = (fields: Field[]): Record<string, string | number> => {
    return Object.fromEntries(
      fields.map(({ name, defaultValue }) => [name, defaultValue || ""]),
    );
  };

  const [formData, setFormData] = useState(defaultValues(fields));

  useEffect(() => {
    if (!isModalOpen || mode === "add") return; // Skip fetching if modal is closed

    const fetchRecord = async () => {
      try {
        const data = getAction ? await getAction() : null;
        if (data) {
          // Extract only the fields defined in the fields array
          const initialData: Record<string, string | number> = {};
          fields.forEach((field) => {
            initialData[field.name] =
              data[field.name] ?? defaultValues(fields)[field.name];
          });
          setFormData(initialData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecord();
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
  };
}

export default loadForm;
