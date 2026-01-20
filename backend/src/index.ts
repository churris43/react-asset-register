import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import type { Connection, RowDataPacket } from "mysql2/promise";
import Role from "./types/Role";

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
    res.status(500).json({ error: "Failed to fetch roles" });
  }
});

app.post("/roles", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const formData = req.body;
    console.log("Role:" + formData.role_name);
    const [result] = await connection.execute(
      "INSERT INTO role (role_name, staff_name) VALUES (? , ?)",
      [formData.role_name, formData.staff_name],
    );
    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create role" });
  }
});

app.delete("/roles/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await connection.execute("DELETE from role WHERE id = ?", [
      id,
    ]);
    res.status(200).json({ message: "Role Deleted", result });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete role" });
  }
});

app.get("/roles/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await connection.execute<Role[]>(
      "SELECT * FROM role WHERE id = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    } else {
      const result = (rows as Role[])[0];
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch role" });
  }
});

app.put("/roles/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const role_name = req.body.role_name;
    const staff_name = req.body.staff_name;

    console.log(role_name);
    console.log(role_name);
    const [result] = await connection.execute(
      "UPDATE role SET role_name = ?, staff_name = ? WHERE id = ?",
      [role_name, staff_name, id],
    );
    res.status(200).json({ message: "Role Updated", result });
  } catch (error) {
    res.status(500).json({ message: "Unable to edit role", error });
  }
});

app.get("/assettypes", async (req: Request, res: Response) => {
  try {
    const [rows] = await connection.execute("SELECT * FROM asset_type");
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch asset types" });
  }
});

app.get("/assettypes/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await connection.execute<Role[]>(
      "SELECT * FROM asset_type WHERE id = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Asset type not found" });
    } else {
      const result = (rows as Role[])[0];
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch asset type" });
  }
});

app.post("/assettypes", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const formData = req.body;
    const [result] = await connection.execute(
      "INSERT INTO asset_type (asset_type_name) VALUES (? )",
      [formData.asset_type_name],
    );
    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create asset type" });
  }
});

app.delete("/assettypes/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await connection.execute(
      "DELETE from asset_type WHERE id = ?",
      [id],
    );
    res.status(200).json({ message: "Asset Type Deleted", result });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete asset type" });
  }
});

app.put("/assettypes/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const asset_type_name = req.body.asset_type_name;

    const [result] = await connection.execute(
      "UPDATE asset_type SET asset_type_name = ? WHERE id = ?",
      [asset_type_name, id],
    );
    res.status(200).json({ message: "Asset type Updated", result });
  } catch (error) {
    res.status(500).json({ message: "Unable to edit asset type", error });
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
