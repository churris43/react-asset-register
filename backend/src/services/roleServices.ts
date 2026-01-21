import { connection } from "../index";
import Role from "../types/Role";

export const getRoles = async (): Promise<Role[] | null> => {
  const [rows] = await connection.execute<Role[]>("SELECT * FROM role");
  return rows ?? null;
};

export const getRolesById = async (id: number): Promise<Role | null> => {
  const [result] = await connection.execute<Role[]>(
    "SELECT * FROM role WHERE id = ?",
    [id],
  );
  const role = result[0];
  return role ?? null;
};

export const deleteRole = async (id: number): Promise<null> => {
  const [result] = await connection.execute("DELETE from role WHERE id = ?", [
    id,
  ]);
  return null;
};

export const createRole = async (role: Role): Promise<null> => {
  const [result] = await connection.execute(
    "INSERT INTO role (role_name, staff_name) VALUES (? , ?)",
    [role.role_name, role.staff_name],
  );
  return null;
};

export const updateRole = async (id: number, role: Role): Promise<null> => {
  const [result] = await connection.execute(
    "UPDATE role SET role_name = ?, staff_name = ? WHERE id = ?",
    [role.role_name, role.staff_name, id],
  );
  return null;
};

export default getRolesById;
