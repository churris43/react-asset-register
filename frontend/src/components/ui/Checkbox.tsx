"use client";

import { ChangeEvent } from "react";
import Field from "@/src/interfaces/field";

interface CheckboxProps {
  field: Field;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  formData: Record<string, string | number | boolean>;
}

function Checkbox({ field, handleChange, formData }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        id={field.name}
        type="checkbox"
        checked={formData[field.name] === true || formData[field.name] === "true"}
        onChange={handleChange}
        name={field.name}
        className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />
    </div>
  );
}

export default Checkbox;