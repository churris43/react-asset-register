import { connection } from "../index";
import Asset from "../types/Asset";

export const getAssets = async (): Promise<Asset[] | null> => {
  const [rows] = await connection.execute<Asset[]>(
    "SELECT * FROM asset_register",
  );
  return rows ?? null;
};

export const getAssetsById = async (id: number): Promise<Asset | null> => {
  const [result] = await connection.execute<Asset[]>(
    "SELECT * FROM asset_register WHERE id = ?",
    [id],
  );
  const asset_type = result[0];
  return asset_type ?? null;
};

export const deleteAsset = async (id: number): Promise<null> => {
  const [result] = await connection.execute(
    "DELETE FROM asset_register WHERE id = ?",
    [id],
  );
  return null;
};

export const createAsset = async (asset: Asset): Promise<null> => {
  const [result] = await connection.execute(
    "INSERT INTO asset_register (asset_name) VALUES (?)",
    [asset.asset_name],
  );
  return null;
};

export const updateAsset = async (id: number, asset: Asset): Promise<null> => {
  const [result] = await connection.execute(
    "UPDATE asset_register SET asset_name = ? WHERE id = ?",
    [asset.asset_name, id],
  );
  return null;
};

export default getAssetsById;
