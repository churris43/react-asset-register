import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "../types/AuthTypes";

// Higher value = more secure but slower — 12 is the recommended production default
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET!;

// Pre-computed bcrypt hash used when the supplied email has no matching user.
// Running bcrypt.compare against this keeps login timing identical for
// "user not found" and "wrong password" cases — without it, an attacker could
// enumerate valid emails by measuring response time.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("never-matches", SALT_ROUNDS);

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always run bcrypt.compare — even when the user is missing — so response
  // timing does not reveal whether the email exists (prevents enumeration).
  // The same generic error is returned for both failure modes.
  const hashToCheck = user?.password_hash ?? DUMMY_PASSWORD_HASH;
  const valid = await bcrypt.compare(password, hashToCheck);
  if (!user || !valid) throw new Error("INVALID_CREDENTIALS");

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
    expiresIn: "15m",
    algorithm: "HS256",
  });
  const refreshToken = jwt.sign(refreshPayload, JWT_SECRET, {
    expiresIn: "7d",
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
