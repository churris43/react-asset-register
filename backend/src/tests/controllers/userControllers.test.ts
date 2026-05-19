import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUser } from "../../controllers/userControllers";
import * as UserService from "../../services/userServices";
import { buildReq, buildRes } from "../testUtils";

vi.mock("../../services/userServices", () => ({
  createUser: vi.fn(),
  getUsers: vi.fn(),
  getPaginatedUsers: vi.fn(),
  deleteUser: vi.fn(),
  updateUser: vi.fn(),
}));

describe("createUser controller", () => {
  beforeEach(() => {
    vi.mocked(UserService.createUser).mockReset();
  });

  it("calls createUser service and returns 200 on success", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password_hash: "hashed",
      name: "Test User",
      isAdmin: false,
      role_id: null,
      created_at: new Date(),
    };
    vi.mocked(UserService.createUser).mockResolvedValue(mockUser);

    const req = buildReq({
      body: {
        email: "test@example.com",
        password_hash: "password123",
        name: "Test User",
      },
    });
    const res = buildRes();

    await createUser(req, res);

    expect(UserService.createUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User created" });
  });

  it("returns 500 when service throws", async () => {
    vi.mocked(UserService.createUser).mockRejectedValue(
      new Error("Database error"),
    );

    const req = buildReq({
      body: {
        email: "test@example.com",
        password_hash: "password123",
        name: "Test User",
      },
    });
    const res = buildRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Unable to create user" });
  });
});
