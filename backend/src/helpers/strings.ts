/**
 * Converts a "" to null. Practical to use for ForeignKeys as an empty string is not accepted
 * @param stringValue
 * @returns
 */
function convertEmptyStringToNull(stringValue: string): string | null {
  return stringValue === "" ? null : stringValue;
}

export default convertEmptyStringToNull;
