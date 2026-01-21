import { RowDataPacket } from "mysql2";

interface AssetType extends RowDataPacket {
  id: number;
  asset_type_name: string;
}

export default AssetType;
