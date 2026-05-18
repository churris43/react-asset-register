// Exception-based configuration for form fields that need mode-dependent behavior.
// Used across all tables to customize field requirements
// based on whether the form is in "add" or "edit" mode. Most fields don't need this.
interface FieldConfig {
  // Map field names to their mode-specific configuration
  [fieldName: string]: {
    // Specifies which mode(s) require this field. If "add", field is required only
    // when creating new records. If "edit", field is required only when editing.
    requiredInMode?: "add" | "edit";
  };
}

export default FieldConfig;
