import AddButton from "@/src/components/AddButton";

import TableHeading from "@/src/components/ui/TableHeading";
import RowActionButtons from "@/src/components/RowActionButtons";
import Field from "../../interfaces/field";
import deleteAssetType, {
  createAssetType,
  editAssetType,
  getAssetTypes,
  getAssetType,
} from "../actions/assetTypeActions";
import AssetTypeInterface from "@/src/interfaces/assetType";

async function Roles() {
  const asset_types = await getAssetTypes();

  const headings = ["ID", "Asset Type"];

  const fields: Array<Field> = [
    {
      name: "asset_type_name",
      label: "Asset Type",
      required: true,
      type: "text",
      htmlElementType: "input",
    },
  ];

  const cols = `80px ${headings.map(() => "1fr").join(" ")} auto`;

  return (
    <>
      <h1 className="text-xl mb-4">
        Asset Types
        <AddButton
          record="Asset Types"
          fields={fields}
          createAction={createAssetType}
        />
      </h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden ">
        <TableHeading headings={headings} />
        {asset_types.map((asset_type: AssetTypeInterface) => (
          <div
            key={asset_type.id}
            className="grid grid-cols-3 border-b last:border-b-0 hover:bg-blue-500 transition-colors bg-blue-400  h-10"
            style={{ gridTemplateColumns: cols }}
          >
            <div className="px-3 py-4">{asset_type.id} </div>
            <span className="text-sm ml-4 px-3 py-4">
              {asset_type.asset_type_name}
            </span>
            <RowActionButtons
              record="roles"
              id={asset_type.id}
              deleteAction={deleteAssetType.bind(null, asset_type.id)}
              getAction={getAssetType.bind(null, asset_type.id)}
              editAction={editAssetType}
              fields={fields}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default Roles;
