import { Request, Response } from "express";
import * as AuthService from "../services/authServices";
import * as userServices from "../services/userServices";

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    // Auth service throws specific error messages for invalid credentials
    if (message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Any other error is a server issue (e.g., missing JWT_SECRET)
    console.error("Login error:", message);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
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

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await userServices.getUserById(req.user!.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Unable to get user" });
  }
};
