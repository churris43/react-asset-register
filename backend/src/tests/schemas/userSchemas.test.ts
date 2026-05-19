import { describe, it, expect } from "vitest";
import { createUserSchema, updateUserSchema } from "../../schemas/userSchemas";

describe("createUserSchema", () => {
  it("accepts valid user data", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "password123",
    };
    const result = createUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const data = {
      email: "invalid-email",
      name: "Test User",
      password_hash: "password123",
    };
    const result = createUserSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].code).toBe("invalid_format");
    }
  });

  it("rejects password shorter than 8 characters", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "short",
    };
    const result = createUserSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Password must be at least 8 characters",
      );
    }
  });

  it("rejects password longer than 128 characters", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "a".repeat(129),
    };
    const result = createUserSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("128 characters");
    }
  });

  it("accepts password of exactly 8 characters (boundary)", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "12345678",
    };
    const result = createUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("accepts password of exactly 128 characters (boundary)", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "a".repeat(128),
    };
    const result = createUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const data = {
      email: "test@example.com",
      name: "",
      password_hash: "password123",
    };
    const result = createUserSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("accepts optional isAdmin field", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "password123",
      isAdmin: true,
    };
    const result = createUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("accepts optional role_id field", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "password123",
      role_id: 5,
    };
    const result = createUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe("updateUserSchema", () => {
  it("accepts valid user data with non-empty password", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "newpassword123",
    };
    const result = updateUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("accepts empty password (no change scenario)", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "",
    };
    const result = updateUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects password shorter than 8 characters when non-empty", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "short",
    };
    const result = updateUserSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("8–128 characters");
    }
  });

  it("rejects password longer than 128 characters", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "a".repeat(129),
    };
    const result = updateUserSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("accepts password of exactly 8 characters (boundary)", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "12345678",
    };
    const result = updateUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("accepts password of exactly 128 characters (boundary)", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "a".repeat(128),
    };
    const result = updateUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const data = {
      email: "not-an-email",
      name: "Test User",
      password_hash: "password123",
    };
    const result = updateUserSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const data = {
      email: "test@example.com",
      name: "",
      password_hash: "password123",
    };
    const result = updateUserSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("accepts optional isAdmin field", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "password123",
      isAdmin: false,
    };
    const result = updateUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("accepts optional role_id field", () => {
    const data = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "",
      role_id: null,
    };
    const result = updateUserSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});