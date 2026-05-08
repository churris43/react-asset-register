"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE = process.env.API_URL;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) return { success: false, message: "Invalid email or password" };

  const { accessToken, refreshToken } = await res.json();
  const cookieStore = await cookies();

  // httpOnly prevents JS from reading the token — mitigates XSS attacks
  // sameSite: strict blocks the cookie from being sent on cross-site requests — mitigates CSRF
  // maxAge: 15 minutes matches the JWT expiry
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60,
  });

  // maxAge: 7 days — longer lived so the access token can be silently refreshed
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  redirect("/login");
}
