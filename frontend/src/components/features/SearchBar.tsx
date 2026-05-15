"use client";

import { MdSearch } from "react-icons/md";
import { useSearchBar } from "@/src/hooks/useSearchBar";

function SearchBar() {
  const { searchValue, handleChange, handleSubmit } = useSearchBar();

  return (
    <div className="relative w-full max-w-sm mb-4">
      <MdSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by name, type, owner ..."
          name="search"
          value={searchValue}
          onChange={handleChange}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </form>
    </div>
  );
}

export default SearchBar;
