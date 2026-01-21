import { connection } from "../index";
import AssetType from "../types/AssetTypes";

export const getAssetTypes = async (): Promise<AssetType[] | null> => {
  const [rows] = await connection.execute<AssetType[]>(
    "SELECT * FROM asset_type",
  );
  return rows ?? null;
};

export const getAssetTypesById = async (
  id: number,
): Promise<AssetType | null> => {
  const [result] = await connection.execute<AssetType[]>(
    "SELECT * FROM asset_type WHERE id = ?",
    [id],
  );
  const asset_type = result[0];
  return asset_type ?? null;
};

export const deleteAssetType = async (id: number): Promise<null> => {
  const [result] = await connection.execute(
    "DELETE FROM asset_type WHERE id = ?",
    [id],
  );
  return null;
};

export const createAssetType = async (asset_type: AssetType): Promise<null> => {
  const [result] = await connection.execute(
    "INSERT INTO asset_type (asset_type_name) VALUES (?)",
    [asset_type.asset_type_name],
  );
  return null;
};

export const updateAssetType = async (
  id: number,
  asset_type: AssetType,
): Promise<null> => {
  const [result] = await connection.execute(
    "UPDATE asset_type SET asset_type_name = ? WHERE id = ?",
    [asset_type.asset_type_name, id],
  );
  return null;
};

export default getAssetTypesById;
