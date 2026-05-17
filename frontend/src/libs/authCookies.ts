"use server";

import { cookies } from "next/headers";

// httpOnly prevents JS from reading the token — mitigates XSS attacks
// sameSite: strict blocks the cookie from being sent on cross-site requests — mitigates CSRF
// maxAge: 15 minutes matches the JWT expiry
export const setAccessTokenCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60,
  });
};
