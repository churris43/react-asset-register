import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import type { Connection } from "mysql2/promise";

dotenv.config();

const app = express();

let connection: Connection;

async function initConnection() {
  connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  console.log("-----------Connected to database");
}

app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;
const DB_PORT = Number(process.env.MYSQL_PORT) || 3306;

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/roles", async (req: Request, res: Response) => {
  try {
    const [rows] = await connection.execute("SELECT * FROM role");
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

/**
 * CRITICAL FIX:
 * Bind to 0.0.0.0 so Nginx can reach the container
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});

initConnection()
  .then(() => {
    app.listen(DB_PORT, () => {
      console.log(`Server running on port ${DB_PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
