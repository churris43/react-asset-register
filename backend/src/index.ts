import express, { Request, Response } from "express";
import routes from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

// Fail fast — refuse to start if critical environment variables are missing
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error(
    "FATAL: JWT_SECRET is missing or too short (min 32 characters)",
  );
  process.exit(1);
}

if (!process.env.FRONTEND_URL) {
  console.error(
    "FATAL: FRONTEND_URL is not set — CORS would allow all origins",
  );
  process.exit(1);
}

const app = express();

// Required when running behind Nginx or any reverse proxy (including Render's infrastructure).
// Without this, req.ip resolves to the proxy's IP (127.0.0.1) instead of the real client IP,
// causing rate limiting to count all users as the same IP and block everyone after 10 requests.
app.set("trust proxy", 1);

//export let connection: Connection;

// Restricts which origins can call this API — only the frontend URL is allowed.
// credentials: true is required to accept requests that include cookies.
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Parses the Cookie header on incoming requests so cookies are accessible
// via req.cookies — required for reading the access_token and refresh_token.
app.use(cookieParser());

// Parses incoming JSON request bodies so they are accessible via req.body
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

app.use("/", routes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
