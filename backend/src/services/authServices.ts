import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "../types/AuthTypes";

// Higher value = more secure but slower — 12 is the recommended production default
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (email: string, password: string) => {
  // Prevent duplicate accounts
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("EMAIL_TAKEN");

  // Never store plain text passwords — bcrypt hashes and salts in one step
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { email, password_hash } });
  return { id: user.id, email: user.email };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Use the same error for missing user and wrong password
  // so attackers can't tell which one failed (user enumeration)
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  // type field is included so the middleware can reject a refresh token
  // presented to a protected endpoint — without it both tokens are identical
  // in structure and a stolen 7-day refresh token bypasses the 15-minute limit
  const accessPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    type: "access",
  };
  const refreshPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    type: "refresh",
  };

  // algorithm is explicit to prevent acceptance of the "none" algorithm
  const accessToken = jwt.sign(accessPayload, JWT_SECRET, {
    expiresIn: "1m",
    algorithm: "HS256",
  });
  const refreshToken = jwt.sign(refreshPayload, JWT_SECRET, {
    expiresIn: "2m",
    algorithm: "HS256",
  });

  return { accessToken, refreshToken };
};

export const refreshAccessToken = (refreshToken: string) => {
  // Throws if the token is invalid or expired — caller handles the error
  const payload = jwt.verify(refreshToken, JWT_SECRET, {
    algorithms: ["HS256"],
  }) as JwtPayload;

  // Reject if someone passes an access token to the refresh endpoint
  if (payload.type !== "refresh") throw new Error("INVALID_TOKEN_TYPE");

  return jwt.sign(
    { userId: payload.userId, email: payload.email, type: "access" },
    JWT_SECRET,
    { expiresIn: "15m", algorithm: "HS256" },
  );
};
