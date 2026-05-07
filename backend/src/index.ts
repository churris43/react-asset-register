import express, { Request, Response } from "express";
import routes from "./routes";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import type { Connection, RowDataPacket } from "mysql2/promise";
import Role from "./types/Role";
import { prisma } from "./lib/prisma";
import cors from "cors";

// Routes

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));

export let connection: Connection;

app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;
const DB_PORT = Number(process.env.MYSQL_PORT) || 3306;

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
