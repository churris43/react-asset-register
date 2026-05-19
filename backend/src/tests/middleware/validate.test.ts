import { describe, it, expect, vi } from "vitest";
import type { NextFunction } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validate";
import { buildReq, buildRes } from "../testUtils";

const testSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be 8+ chars"),
});

describe("validate middleware", () => {
  it("calls next() and replaces req.body with parsed data on valid input", () => {
    const next = vi.fn();
    const req = buildReq({
      body: { email: "test@example.com", password: "password123" },
    });
    const res = buildRes();

    const middleware = validate(testSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("returns 422 with fieldErrors on validation failure", () => {
    const next = vi.fn();
    const req = buildReq({
      body: { email: "invalid-email", password: "short" },
    });
    const res = buildRes();

    const middleware = validate(testSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      fieldErrors: {
        email: "Invalid email",
        password: "Password must be 8+ chars",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("captures only the first error per field", () => {
    const multiErrorSchema = z.object({
      value: z.string().min(5, "Too short").max(10, "Too long"),
    });
    const next = vi.fn();
    const req = buildReq({
      body: { value: "x" },
    });
    const res = buildRes();

    const middleware = validate(multiErrorSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      fieldErrors: {
        value: "Too short",
      },
    });
  });

  it("handles missing required fields", () => {
    const next = vi.fn();
    const req = buildReq({
      body: { password: "password123" },
    });
    const res = buildRes();

    const middleware = validate(testSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      fieldErrors: expect.objectContaining({
        email: expect.any(String),
      }),
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("coerces valid data types and passes through", () => {
    const coerceSchema = z.object({
      count: z.coerce.number(),
    });
    const next = vi.fn();
    const req = buildReq({
      body: { count: "42" },
    });
    const res = buildRes();

    const middleware = validate(coerceSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body.count).toBe(42);
  });
});