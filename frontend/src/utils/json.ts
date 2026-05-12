/**
 * Equivalent to Lodash's _.get(obj, path) — traverses a dot-separated path into a nested object
 * @param obj - The object to traverse e.g. an asset object that includes the role as a child record
 * @param path - Dot-separated string e.g. "role.role_name"
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
