interface Asset {
  id: number;
  asset_name: string;
  role_id?: number | null;
  asset_type_id?: number | null;
}

export default Asset;
