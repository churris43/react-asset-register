interface Field {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  class?: string;
  defaultValue?: string | number;
  htmlElementType: string;
}

export default Field;
