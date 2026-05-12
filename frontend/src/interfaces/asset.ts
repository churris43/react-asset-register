import AssetTypeInterface from "./assetType";
import RoleInterface from "./role";

interface AssetInterface {
  id: number;
  asset_name: string;
  role_id?: number;
  asset_type_id?: number;
  role?: RoleInterface;
  asset_type?: AssetTypeInterface;
}

export default AssetInterface;
