import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { login, getMe } from "../../controllers/authControllers";
import * as AuthService from "../../services/authServices";
import * as userServices from "../../services/userServices";

// Mock the service layer so validation tests never touch bcrypt or the DB.
// If the controller's validation regresses and lets a bad payload through,
// these mocks would be called and the spy assertions below would fail loudly.
vi.mock("../../services/authServices", () => ({
  loginUser: vi.fn(),
  refreshAccessToken: vi.fn(),
}));

vi.mock("../../services/userServices", () => ({
  getUserById: vi.fn(),
}));

const buildReq = (body: Record<string, unknown>, user?: { userId: number; email: string }) =>
  ({ body, user }) as unknown as Request;

const buildRes = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("login controller validation", () => {
  beforeEach(() => {
    vi.mocked(AuthService.loginUser).mockReset();
  });

  it("returns 400 when email is missing", async () => {
    const res = buildRes();
    await login(buildReq({ password: "password123" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(AuthService.loginUser).not.toHaveBeenCalled();
  });

  it("returns 400 when password is missing", async () => {
    const res = buildRes();
    await login(buildReq({ email: "x@y.com" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(AuthService.loginUser).not.toHaveBeenCalled();
  });
});

describe("getMe controller", () => {
  beforeEach(() => {
    vi.mocked(userServices.getUserById).mockReset();
  });

  it("returns the user when found", async () => {
    const mockUser = { id: 1, email: "x@y.com", name: "Alice", isAdmin: false, role: null };
    vi.mocked(userServices.getUserById).mockResolvedValue(mockUser as any);

    const res = buildRes();
    await getMe(buildReq({}, { userId: 1, email: "x@y.com" }), res);

    expect(userServices.getUserById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it("returns 404 when user does not exist", async () => {
    vi.mocked(userServices.getUserById).mockResolvedValue(null);

    const res = buildRes();
    await getMe(buildReq({}, { userId: 99, email: "ghost@y.com" }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 500 on unexpected service error", async () => {
    vi.mocked(userServices.getUserById).mockRejectedValue(new Error("DB down"));

    const res = buildRes();
    await getMe(buildReq({}, { userId: 1, email: "x@y.com" }), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
