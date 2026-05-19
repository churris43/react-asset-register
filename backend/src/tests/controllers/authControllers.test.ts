import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { login } from "../../controllers/authControllers";
import * as AuthService from "../../services/authServices";

// Mock the service layer so validation tests never touch bcrypt or the DB.
// If the controller's validation regresses and lets a bad payload through,
// these mocks would be called and the spy assertions below would fail loudly.
vi.mock("../../services/authServices", () => ({
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
