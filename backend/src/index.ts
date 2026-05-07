import express, { Request, Response } from "express";
import routes from "./routes";
import dotenv from "dotenv";
import type { Connection } from "mysql2/promise";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

export let connection: Connection;

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

/**
 * CRITICAL FIX:
 * Bind to 0.0.0.0 so Nginx can reach the container
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});
