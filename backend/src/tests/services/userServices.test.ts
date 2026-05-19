import { describe, it, expect } from "vitest";
import { createUser, updateUser } from "../../services/userServices";

describe("userServices", () => {
  describe("createUser", () => {
    it("creates a user and returns the user object", async () => {
      const result = await createUser({
        email: "alice@example.com",
        password_hash: "password123",
        name: "Alice",
        isAdmin: false,
      });
      expect(result.email).toBe("alice@example.com");
      expect(result.name).toBe("Alice");
      expect(result.id).toBeDefined();
      expect(result.password_hash).not.toBe("password123");
    });

    it("throws EMAIL_TAKEN for a duplicate email", async () => {
      await createUser({
        email: "bob@example.com",
        password_hash: "password123",
        name: "Bob",
        isAdmin: false,
      });
      await expect(
        createUser({
          email: "bob@example.com",
          password_hash: "different",
          name: "Bob2",
          isAdmin: false,
        }),
      ).rejects.toThrow("EMAIL_TAKEN");
    });

    it("hashes the password using bcrypt", async () => {
      const result = await createUser({
        email: "charlie@example.com",
        password_hash: "password123",
        name: "Charlie",
        isAdmin: false,
      });
      expect(result.password_hash).not.toBe("password123");
      expect(result.password_hash).toMatch(/^\$2[aby]\$/);
    });

    it("allows creating user without role_id", async () => {
      const result = await createUser({
        email: "dave@example.com",
        password_hash: "password123",
        name: "Dave",
        isAdmin: false,
      });
      expect(result.role_id).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("updates user fields", async () => {
      const created = await createUser({
        email: "eve@example.com",
        password_hash: "password123",
        name: "Eve",
        isAdmin: false,
      });

      const result = await updateUser(created.id, {
        email: "eve@example.com",
        password_hash: "",
        name: "Evelyn",
        isAdmin: true,
      });

      expect(result?.name).toBe("Evelyn");
      expect(result?.isAdmin).toBe(true);
    });

    it("allows updating without changing password", async () => {
      const created = await createUser({
        email: "frank@example.com",
        password_hash: "password123",
        name: "Frank",
        isAdmin: false,
      });

      const originalHash = created.password_hash;
      const result = await updateUser(created.id, {
        email: "frank@example.com",
        password_hash: "",
        name: "Franklin",
        isAdmin: false,
      });

      expect(result?.password_hash).toBe(originalHash);
    });

    it("throws error when updating to duplicate email", async () => {
      await createUser({
        email: "grace@example.com",
        password_hash: "password123",
        name: "Grace",
        isAdmin: false,
      });

      const user2 = await createUser({
        email: "henry@example.com",
        password_hash: "password123",
        name: "Henry",
        isAdmin: false,
      });

      await expect(
        updateUser(user2.id, {
          email: "grace@example.com",
          password_hash: "",
          name: "Henry",
          isAdmin: false,
        }),
      ).rejects.toThrow();
    });

    it("allows updating password when provided", async () => {
      const created = await createUser({
        email: "iris@example.com",
        password_hash: "password123",
        name: "Iris",
        isAdmin: false,
      });

      const originalHash = created.password_hash;
      const result = await updateUser(created.id, {
        email: "iris@example.com",
        password_hash: "newpassword456",
        name: "Iris",
        isAdmin: false,
      });

      expect(result?.password_hash).not.toBe(originalHash);
      expect(result?.password_hash).toMatch(/^\$2[aby]\$/);
    });
  });
});
