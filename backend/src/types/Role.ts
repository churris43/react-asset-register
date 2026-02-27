import { RowDataPacket } from "mysql2";

interface Role extends RowDataPacket {
  id: number;
  role_name: string;
  staff_name: string | null;
}

export default Role;
