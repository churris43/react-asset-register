// searchParams: the current URL query params from Next.js — values can be a single string,
//   an array of strings (e.g. ?tag=a&tag=b), or undefined. Typed this way to match Next.js page props.
// overrides: the params to set or overwrite, always plain strings (e.g. { page: "2" } or { sort: "role_name", page: "1" })
export function buildHref(
  searchParams: { [key: string]: string | string[] | undefined },
  overrides: { [key: string]: string } = {},
): string {
  const qs = new URLSearchParams();

  // Convert searchParams to [key, value] pairs and copy only single string values into qs.
  // Arrays and undefined are skipped — pagination and sort params are always single strings.
  Object.entries(searchParams).forEach(([k, v]) => {
    if (typeof v === "string") qs.set(k, v);
  });

  // Apply overrides last so they always win over whatever was in searchParams.
  Object.entries(overrides).forEach(([k, v]) => qs.set(k, v));

  return `?${qs.toString()}`;
}