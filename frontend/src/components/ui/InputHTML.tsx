"use client";

import { ChangeEvent } from "react";
import Field from "@/src/interfaces/field";

interface InputHTMLProps {
  field: Field;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  formData: Record<string, string | number | boolean>;
}

function InputHTML({ field, handleChange, formData }: InputHTMLProps) {
  return (
    <input
      id={field.name}
      type={field.type}
      value={String(formData[field.name] || "")}
      onChange={handleChange}
      name={field.name}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={field.placeholder}
      required={field.required}
    />
  );
}

export default InputHTML;
