import { RowDataPacket } from "mysql2";

interface Asset extends RowDataPacket {
  id: number;
  asset_name: string;
}

export default Asset;
