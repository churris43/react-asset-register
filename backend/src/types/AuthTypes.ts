export interface RegisterBody {
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  // Distinguishes access tokens from refresh tokens — prevents a long-lived
  // refresh token being used directly against protected API endpoints
  type: "access" | "refresh";
}

export default LoginBody;
