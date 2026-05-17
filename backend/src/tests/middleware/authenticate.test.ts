import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../../middleware/authenticate";

const JWT_SECRET = process.env.JWT_SECRET!;

// Builds a minimal Express Request with a cookies bag
const buildReq = (cookies: Record<string, string> = {}) =>
  ({ cookies }) as unknown as Request;

const buildRes = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("authenticate middleware", () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it("returns 401 when no access_token cookie is present", () => {
    const req = buildReq();
    const res = buildRes();
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for a malformed token", () => {
    const req = buildReq({ access_token: "not-a-jwt" });
    const res = buildRes();
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for a token signed with a different secret", () => {
    const token = jwt.sign(
      { userId: 1, email: "x@y.com", type: "access" },
      "different-secret",
      { algorithm: "HS256" },
    );
    const req = buildReq({ access_token: token });
    const res = buildRes();
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for an expired token", () => {
    const token = jwt.sign(
      { userId: 1, email: "x@y.com", type: "access" },
      JWT_SECRET,
      { algorithm: "HS256", expiresIn: "-1s" },
    );
    const req = buildReq({ access_token: token });
    const res = buildRes();
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when a refresh token is presented to a protected route", () => {
    const refreshToken = jwt.sign(
      { userId: 1, email: "x@y.com", type: "refresh" },
      JWT_SECRET,
      { algorithm: "HS256" },
    );
    const req = buildReq({ access_token: refreshToken });
    const res = buildRes();
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token type" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for a token signed with the 'none' algorithm", () => {
    // The explicit algorithms: ['HS256'] in authenticate() must reject this —
    // otherwise an attacker could forge tokens by stripping the signature.
    const token = jwt.sign(
      { userId: 1, email: "x@y.com", type: "access" },
      "",
      { algorithm: "none" },
    );
    const req = buildReq({ access_token: token });
    const res = buildRes();
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next() and populates req.user for a valid access token", () => {
    const token = jwt.sign(
      { userId: 42, email: "x@y.com", type: "access" },
      JWT_SECRET,
      { algorithm: "HS256" },
    );
    const req = buildReq({ access_token: token });
    const res = buildRes();
    authenticate(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(req.user).toMatchObject({
      userId: 42,
      email: "x@y.com",
      type: "access",
    });
  });
});
