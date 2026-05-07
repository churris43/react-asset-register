import { Request, Response } from "express";
import * as AuthService from "../services/authServices";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  if (password.length < 8)
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });

  try {
    const user = await AuthService.registerUser(email, password);
    return res.status(201).json({ message: "User registered", user });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN")
      return res.status(409).json({ message: "Email already registered" });
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const { accessToken, refreshToken } = await AuthService.loginUser(
      email,
      password,
    );
    return res.status(200).json({ accessToken, refreshToken });
  } catch {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

export const logout = (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Logged out" });
};

export const refresh = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const accessToken = AuthService.refreshAccessToken(refreshToken);
    return res.status(200).json({ accessToken });
  } catch {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};
