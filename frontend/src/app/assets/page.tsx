import AddButton from "@/src/components/AddButton";

import TableHeading from "@/src/components/TableHeading";
import RowActionButtons from "@/src/components/RowActionButtons";
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

async function Assets() {
  const assets = await getAssets();
  const roles = await getRoles();

  const roleOptions = roles.map((role: RoleInterface) => ({
    value: role.id,
    label: role.role_name,
  }));

  const headings = ["ID", "Asset Name", "Asset Owner"];

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
      name: "role_id",
      label: "Asset Owner",
      type: "text",
      htmlElementType: "select_single",
      options: roleOptions,
    },
  ];

  return (
    <>
      <h1 className="text-xl mb-4">
        Assets
        <AddButton record="Assets" fields={fields} createAction={createAsset} />
      </h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden ">
        <TableHeading headings={headings} />
        {assets.map((asset: AssetInterface) => (
          <div
            key={asset.id}
            className="grid grid-cols-4 border-b last:border-b-0 hover:bg-blue-500 transition-colors bg-blue-400  h-10 grid-cols-[80px_1fr_1fr_1fr]"
          >
            <div className="px-3 py-4">{asset.id} </div>
            <span className="text-sm ml-4 px-3 py-4">{asset.asset_name}</span>
            <span className="text-sm ml-4 px-3 py-4">
              {roleOptions.find((role) => role.value === asset.role_id)?.label}
            </span>
            <RowActionButtons
              record="roles"
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
