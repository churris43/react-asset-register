import AddButton from "@/src/components/features/AddButton";

import TableHeading from "@/src/components/ui/TableHeading";
import Field from "../../interfaces/field";
import deleteAssetType, {
  createAssetType,
  editAssetType,
} from "../actions/assetTypeActions";
import AssetTypeInterface from "@/src/interfaces/assetType";
import TableRow from "@/src/components/ui/TableRow";
import TableFooter from "@/src/components/ui/TableFooter";
import { getAssetTypes } from "../actions/assetTypeQueries";

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

  return (
    <>
      <h1 className="text-xl mb-4 flex items-center justify-between">
        Asset Types
        <AddButton
          recordName="Asset Types"
          fields={fields}
          createAction={createAssetType}
        />
      </h1>
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <TableHeading headings={headings} />
        {asset_types.map((asset_type: AssetTypeInterface) => (
          <TableRow
            recordName="roles"
            record={asset_type}
            id={asset_type.id}
            key={asset_type.id}
            deleteAction={deleteAssetType.bind(null, asset_type.id)}
            editAction={editAssetType}
            fields={fields}
          />
        ))}
        <TableFooter
          colCount={fields.length}
          summary={asset_types.length === 0 ? "No asset types found" : ""}
        />
      </div>
    </>
  );
}

export default Roles;
