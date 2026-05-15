import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

// This hook encapsulates all the logic for the SearchBar component, keeping
// the component itself focused purely on presentation.
export function useSearchBar() {
  // useRouter gives us programmatic navigation — instead of the user clicking a <Link>,
  // we can push a new URL from code. Here we use it to update the URL when the user types.
  const router = useRouter();

  // usePathname returns the current URL path without the query string, e.g. "/assets".
  // We need this so we can rebuild the full URL as: /assets?search=foo&page=1
  // without hardcoding the path.
  const pathName = usePathname();

  // useSearchParams gives us read access to the current URL query string as a key/value map.
  // e.g. for /assets?page=2&sortField=asset_name it returns { page: "2", sortField: "asset_name" }
  // We use it in two ways:
  //   1. To initialise the input with whatever ?search= value is already in the URL (e.g. on page refresh)
  //   2. Inside handleChange to preserve existing params (page, sort) when we update ?search=
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );

  // useRef stores a value that persists across re-renders without triggering a new render.
  // Here we use it to hold the ID of the active debounce timer.
  // We need to remember the timer ID so we can cancel it (clearTimeout) if the user types again
  // before it fires. A plain variable wouldn't work because it resets on every render.
  // useState would also be wrong here because updating it would cause an unnecessary re-render.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Capture the input value synchronously at the top of the function, before anything async runs.
    // React reuses synthetic event objects for performance — by the time the setTimeout callback
    // fires 300ms later, e.target.value may have changed or become null. Reading it here guarantees
    // we have the value the user typed at the moment this handler was called.
    const value = e.target.value;

    // Update the input's display value immediately so the UI feels responsive.
    setSearchValue(value);

    // Cancel the previously scheduled URL update, if any.
    // Without this, every keystroke would schedule its own update and they would all fire —
    // firing 5 requests for "l", "la", "lap", "lapt", "lapto" instead of just one for "laptop".
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Schedule the URL update to fire 300ms after the user stops typing.
    debounceRef.current = setTimeout(() => {
      // Copy all current query params (page, sortField, sortOrder, etc.) so we don't lose them.
      const params = new URLSearchParams(searchParams.toString());

      if (value) params.set("search", value);
      else params.delete("search"); // remove the param entirely when the input is cleared

      // Always reset to page 1 when the search changes — otherwise you could land on
      // e.g. page 3 of results for "laptop" which may not exist.
      params.set("page", "1");

      // Push the new URL. Because the assets page is a Server Component, Next.js will re-fetch
      // assets from the backend with the new search param and re-render the table.
      router.push(`${pathName}?${params.toString()}`);
    }, 300);
  }

  function handleSubmit(e: React.FormEvent) {
    // Prevent the form from doing a full browser page reload on Enter.
    // The search is already handled by handleChange, so we just block the default behaviour.
    e.preventDefault();
  }

  return { searchValue, handleChange, handleSubmit };
}
