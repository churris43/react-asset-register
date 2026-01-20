interface Field {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  class?: string;
  defaultValue?: string | number;
}

export default Field;
