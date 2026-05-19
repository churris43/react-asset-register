import { vi } from "vitest";
import type { Request, Response } from "express";

export const buildReq = (overrides: Record<string, any> = {}): Request => {
  return {
    body: {},
    cookies: {},
    params: {},
    query: {},
    ...overrides,
  } as unknown as Request;
};

export const buildRes = (): Response => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};