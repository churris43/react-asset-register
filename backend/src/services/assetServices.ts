import { connection } from "../index";
import Asset from "../types/Asset";
import convertEmptyStringToNull from "../helpers/strings";

export const getAssets = async (): Promise<Asset[] | null> => {
  const [rows] = await connection.execute<Asset[]>("SELECT * FROM asset");
  return rows ?? null;
};

export const getAssetsById = async (id: number): Promise<Asset | null> => {
  const [result] = await connection.execute<Asset[]>(
    "SELECT * FROM asset WHERE id = ?",
    [id],
  );
  const asset_type = result[0];
  return asset_type ?? null;
};

export const deleteAsset = async (id: number): Promise<null> => {
  const [result] = await connection.execute("DELETE FROM asset WHERE id = ?", [
    id,
  ]);
  return null;
};

export const createAsset = async (asset: Asset): Promise<null> => {
  console.log(
    "INSERT INTO asset (asset_name, role_id, asset_type_id) VALUES (?, ?)",
    [
      asset.asset_name,
      convertEmptyStringToNull(asset.role_id),
      convertEmptyStringToNull(asset.asset_type_id),
    ],
  );
  const [result] = await connection.execute(
    "INSERT INTO asset (asset_name, role_id, asset_type_id) VALUES (?, ?, ?)",
    [
      asset.asset_name,
      convertEmptyStringToNull(asset.role_id),
      convertEmptyStringToNull(asset.asset_type_id),
    ],
  );
  return null;
};

export const updateAsset = async (id: number, asset: Asset): Promise<null> => {
  const [result] = await connection.execute(
    "UPDATE asset SET asset_name = ?, role_id = ?, asset_type_id = ? WHERE id = ?",
    [
      asset.asset_name,
      convertEmptyStringToNull(asset.role_id),
      convertEmptyStringToNull(asset.asset_type_id),
      id,
    ],
  );
  return null;
};

export default getAssetsById;
