import { describe, it, expect } from "vitest";
import { parsePaginationParams } from "../../utils/parsePaginationParams";

const ALLOWED = ["asset_name", "asset_type_name"] as const;

describe("parsePaginationParams", () => {
  it("returns defaults when query is empty", () => {
    expect(parsePaginationParams({}, ALLOWED, "asset_name")).toEqual({
      page: 1,
      limit: 20,
      sortField: "asset_name",
      sortOrder: "asc",
    });
  });

  it("parses valid page and limit", () => {
    const { page, limit } = parsePaginationParams(
      { page: "3", limit: "50" },
      ALLOWED,
      "asset_name",
    );
    expect(page).toBe(3);
    expect(limit).toBe(50);
  });

  it("clamps limit to 100", () => {
    const { limit } = parsePaginationParams(
      { limit: "999" },
      ALLOWED,
      "asset_name",
    );
    expect(limit).toBe(100);
  });

  it("clamps page to 1 minimum", () => {
    const { page } = parsePaginationParams(
      { page: "-5" },
      ALLOWED,
      "asset_name",
    );
    expect(page).toBe(1);
  });

  it("rejects a sortField not in the allowlist", () => {
    const { sortField } = parsePaginationParams(
      { sortField: "password_hash" },
      ALLOWED,
      "asset_name",
    );
    expect(sortField).toBe("asset_name");
  });

  it("accepts desc sortOrder", () => {
    const { sortOrder } = parsePaginationParams(
      { sortOrder: "desc" },
      ALLOWED,
      "asset_name",
    );
    expect(sortOrder).toBe("desc");
  });

  it("defaults sortOrder to asc for unknown values", () => {
    const { sortOrder } = parsePaginationParams(
      { sortOrder: "random" },
      ALLOWED,
      "asset_name",
    );
    expect(sortOrder).toBe("asc");
  });

  it("returns undefined search when search param is absent", () => {
    const { search } = parsePaginationParams({}, ALLOWED, "asset_name");
    expect(search).toBeUndefined();
  });

  it("returns search string when search param is a plain string", () => {
    const { search } = parsePaginationParams(
      { search: "laptop" },
      ALLOWED,
      "asset_name",
    );
    expect(search).toBe("laptop");
  });

  it("returns undefined search when search param is a non-string query value", () => {
    // Express parses repeated keys (e.g. ?search[]=foo) as objects or arrays — both invalid here.
    const { search } = parsePaginationParams(
      { search: { nested: "value" } },
      ALLOWED,
      "asset_name",
    );
    expect(search).toBeUndefined();
  });
});
