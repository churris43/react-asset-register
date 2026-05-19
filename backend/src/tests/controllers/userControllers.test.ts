import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { createUser } from "../../controllers/userControllers";
import * as UserService from "../../services/userServices";

vi.mock("../../services/userServices", () => ({
  createUser: vi.fn(),
  getUsers: vi.fn(),
  getPaginatedUsers: vi.fn(),
  deleteUser: vi.fn(),
  updateUser: vi.fn(),
}));

const buildReq = (body: Record<string, unknown>) =>
  ({ body }) as unknown as Request;

const buildRes = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("createUser controller validation", () => {
  beforeEach(() => {
    vi.mocked(UserService.createUser).mockReset();
  });

  it("returns 400 when email is missing", async () => {
    const res = buildRes();
    await createUser(buildReq({ password_hash: "password123" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(UserService.createUser).not.toHaveBeenCalled();
  });

  it("returns 400 when password_hash is missing", async () => {
    const res = buildRes();
    await createUser(buildReq({ email: "x@y.com" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(UserService.createUser).not.toHaveBeenCalled();
  });

  it("returns 400 when password_hash is shorter than 8 characters", async () => {
    const res = buildRes();
    await createUser(buildReq({ email: "x@y.com", password_hash: "short" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password must be at least 8 characters",
    });
    expect(UserService.createUser).not.toHaveBeenCalled();
  });

  it("returns 400 when password_hash is longer than 128 characters", async () => {
    const res = buildRes();
    await createUser(
      buildReq({ email: "x@y.com", password_hash: "a".repeat(129) }),
      res,
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password must be 128 characters or fewer",
    });
    expect(UserService.createUser).not.toHaveBeenCalled();
  });

  it("accepts a password_hash of exactly 8 characters (boundary)", async () => {
    vi.mocked(UserService.createUser).mockResolvedValue({
      id: 1,
      email: "x@y.com",
      password_hash: "hash",
      name: "Test",
      isAdmin: false,
      role_id: null,
      created_at: new Date(),
    });
    const res = buildRes();
    await createUser(
      buildReq({ email: "x@y.com", password_hash: "12345678" }),
      res,
    );
    expect(UserService.createUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("accepts a password_hash of exactly 128 characters (boundary)", async () => {
    vi.mocked(UserService.createUser).mockResolvedValue({
      id: 1,
      email: "x@y.com",
      password_hash: "hash",
      name: "Test",
      isAdmin: false,
      role_id: null,
      created_at: new Date(),
    });
    const res = buildRes();
    await createUser(
      buildReq({ email: "x@y.com", password_hash: "a".repeat(128) }),
      res,
    );
    expect(UserService.createUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
