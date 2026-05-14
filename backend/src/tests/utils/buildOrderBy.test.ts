import { describe, it, expect } from "vitest";
import { buildOrderBy } from "../../utils/buildOrderBy";

describe("buildOrderBy", () => {
  it("returns a flat orderBy for a direct field", () => {
    expect(buildOrderBy("asset_name", "asc")).toEqual({ asset_name: "asc" });
  });

  it("returns a flat orderBy with desc order", () => {
    expect(buildOrderBy("asset_name", "desc")).toEqual({ asset_name: "desc" });
  });

  it("uses the nested factory for a relation field", () => {
    const nestedFields = {
      asset_type_name: (order: "asc" | "desc") => ({
        asset_type: { asset_type_name: order },
      }),
    };
    expect(buildOrderBy("asset_type_name", "asc", nestedFields)).toEqual({
      asset_type: { asset_type_name: "asc" },
    });
  });

  it("falls back to flat when field is not in nestedFields", () => {
    const nestedFields = {
      asset_type_name: (order: "asc" | "desc") => ({
        asset_type: { asset_type_name: order },
      }),
    };
    expect(buildOrderBy("asset_name", "asc", nestedFields)).toEqual({
      asset_name: "asc",
    });
  });
});
