"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setAccessTokenCookie } from "@/src/libs/authCookies";

const API_BASE = process.env.API_URL;

export async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      let message = "Login failed. Please try again.";

      if (res.status === 401) {
        message = "Invalid email or password";
      } else if (res.status === 400) {
        message = "Email and password are required";
      } else if (res.status === 500) {
        message = "Server error. Please try again later.";
      } else if (res.status === 503) {
        message = "Service unavailable. Please try again later.";
      } else if (res.status === 404) {
        message = "Login service not found. Please contact support.";
      }

      return { success: false, message };
    }

    const { accessToken, refreshToken } = await res.json();
    const cookieStore = await cookies();

    await setAccessTokenCookie(accessToken);

    // maxAge: 7 days — longer lived so the access token can be silently refreshed
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    console.error("Login error:", message, "API_BASE:", API_BASE);
    return { success: false, message: `Login failed: ${message}` };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  redirect("/login");
}
