import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { register, login } from "../../controllers/authControllers";
import * as AuthService from "../../services/authServices";

// Mock the service layer so validation tests never touch bcrypt or the DB.
// If the controller's validation regresses and lets a bad payload through,
// these mocks would be called and the spy assertions below would fail loudly.
vi.mock("../../services/authServices", () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  refreshAccessToken: vi.fn(),
}));

const buildReq = (body: Record<string, unknown>) =>
  ({ body }) as unknown as Request;

const buildRes = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("register controller validation", () => {
  beforeEach(() => {
    vi.mocked(AuthService.registerUser).mockReset();
  });

  it("returns 400 when email is missing", async () => {
    const res = buildRes();
    await register(buildReq({ password: "password123" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(AuthService.registerUser).not.toHaveBeenCalled();
  });

  it("returns 400 when password is missing", async () => {
    const res = buildRes();
    await register(buildReq({ email: "x@y.com" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(AuthService.registerUser).not.toHaveBeenCalled();
  });

  it("returns 400 when password is shorter than 8 characters", async () => {
    const res = buildRes();
    await register(buildReq({ email: "x@y.com", password: "short" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password must be at least 8 characters",
    });
    expect(AuthService.registerUser).not.toHaveBeenCalled();
  });

  it("returns 400 when password is longer than 128 characters", async () => {
    const res = buildRes();
    await register(
      buildReq({ email: "x@y.com", password: "a".repeat(129) }),
      res,
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password must be 128 characters or fewer",
    });
    expect(AuthService.registerUser).not.toHaveBeenCalled();
  });

  it("accepts a password of exactly 8 characters (boundary)", async () => {
    vi.mocked(AuthService.registerUser).mockResolvedValue({
      id: 1,
      email: "x@y.com",
    });
    const res = buildRes();
    await register(buildReq({ email: "x@y.com", password: "12345678" }), res);
    expect(AuthService.registerUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("accepts a password of exactly 128 characters (boundary)", async () => {
    vi.mocked(AuthService.registerUser).mockResolvedValue({
      id: 1,
      email: "x@y.com",
    });
    const res = buildRes();
    await register(
      buildReq({ email: "x@y.com", password: "a".repeat(128) }),
      res,
    );
    expect(AuthService.registerUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

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
