interface Field {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  class?: string;
  defaultValue?: string | number;
  htmlElementType: string;
  options?: { value: string | number; label: string }[];
  childField?: string;
}

export default Field;
