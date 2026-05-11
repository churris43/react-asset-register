import AddButton from "@/src/components/features/AddButton";

import TableHeading from "@/src/components/ui/TableHeading";
import TableFooter from "@/src/components/ui/TableFooter";
import Field from "../../interfaces/field";
import deleteAsset, { createAsset, editAsset } from "../actions/assetActions";
import { getAssetTypes } from "../actions/assetTypeQueries";
import { getAssets } from "../actions/assetQueries";
import AssetInterface from "@/src/interfaces/asset";
import { getRoles } from "../actions/roleQueries";
import RoleInterface from "@/src/interfaces/role";
import AssetTypeInterface from "@/src/interfaces/assetType";
import TableRow from "@/src/components/ui/TableRow";

async function Assets() {
  const assets = await getAssets();
  const roles = await getRoles();
  const assetTypes = await getAssetTypes();

  const roleOptions = roles.map((role: RoleInterface) => ({
    value: role.id,
    label: role.role_name,
  }));

  const assetTypeOptions = assetTypes.map((assetType: AssetTypeInterface) => ({
    value: assetType.id,
    label: assetType.asset_type_name,
  }));

  const headings = ["ID", "Asset Name", "Asset Type", "Asset Owner"];

  const fields: Array<Field> = [
    {
      name: "asset_name",
      label: "Asset Name",
      required: true,
      type: "text",
      htmlElementType: "input",
      defaultValue: "",
    },
    {
      name: "asset_type_id",
      label: "Asset Type",
      type: "text",
      htmlElementType: "select_single",
      childField: "asset_type.asset_type_name",
      options: assetTypeOptions,
    },
    {
      name: "role_id",
      label: "Asset Owner",
      type: "text",
      htmlElementType: "select_single",
      childField: "role.role_name",
      options: roleOptions,
    },
  ];
  const canAddAssets = () => {
    return assetTypes.length > 0 && roles.length > 0;
  };

  return (
    <>
      <h1 className="text-xl mb-4 flex items-center justify-between">
        Assets
        {canAddAssets() && (
          <AddButton
            recordName="Assets"
            fields={fields}
            createAction={createAsset}
          />
        )}
      </h1>
      {!canAddAssets() && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 border border-yellow-300 rounded-md text-sm my-2">
          <span>To add assets you must have roles and asset types</span>
        </div>
      )}
      <div className="w-full bg-gray rounded-lg shadow-md overflow-hidden">
        <TableHeading headings={headings} />
        {assets.length > 0 &&
          assets.map((asset: AssetInterface) => (
            <TableRow
              recordName="assets"
              record={asset}
              id={asset.id}
              key={asset.id}
              deleteAction={deleteAsset.bind(null, asset.id)}
              editAction={editAsset}
              fields={fields}
            />
          ))}
        <TableFooter
          colCount={fields.length}
          summary={assets.length === 0 ? "No assets found" : ""}
        />
      </div>
    </>
  );
}

export default Assets;
