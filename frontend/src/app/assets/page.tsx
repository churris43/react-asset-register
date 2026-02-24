import AddButton from "@/src/components/features/AddButton";

import TableHeading from "@/src/components/ui/TableHeading";
import RowActionButtons from "@/src/components/ui/RowActionButtons";
import Field from "../../interfaces/field";
import deleteAsset, {
  createAsset,
  editAsset,
  getAssets,
  getAsset,
} from "../actions/assetActions";
import AssetInterface from "@/src/interfaces/asset";
import { getRoles } from "../actions/roleActions";
import RoleInterface from "@/src/interfaces/role";
import { getAssetTypes } from "../actions/assetTypeActions";
import AssetTypeInterface from "@/src/interfaces/assetType";

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
      options: assetTypeOptions,
    },
    {
      name: "role_id",
      label: "Asset Owner",
      type: "text",
      htmlElementType: "select_single",
      options: roleOptions,
    },
  ];
  const cols = `80px ${headings.map(() => "1fr").join(" ")} auto`;

  return (
    <>
      <h1 className="text-xl mb-4">
        Assets
        <AddButton
          recordName="Assets"
          fields={fields}
          createAction={createAsset}
        />
      </h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden ">
        <TableHeading headings={headings} />
        {assets.map((asset: AssetInterface) => (
          <div
            key={asset.id}
            className="grid grid-cols-5 border-b last:border-b-0 hover:bg-blue-500 transition-colors bg-blue-400  h-10"
            style={{ gridTemplateColumns: cols }}
          >
            <div className="px-3 py-4">{asset.id} </div>
            <span className="text-sm ml-4 px-3 py-4">{asset.asset_name}</span>
            <span className="text-sm ml-4 px-3 py-4">
              {
                assetTypeOptions.find(
                  (assetType) => assetType.value === asset.asset_type_id,
                )?.label
              }
            </span>
            <span className="text-sm ml-5 px-3 py-4">
              {roleOptions.find((role) => role.value === asset.role_id)?.label}
            </span>

            <RowActionButtons
              recordName="assets"
              id={asset.id}
              deleteAction={deleteAsset.bind(null, asset.id)}
              getAction={getAsset.bind(null, asset.id)}
              editAction={editAsset}
              fields={fields}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default Assets;
