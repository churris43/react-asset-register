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
import { getPaginatedAssetTypes } from "../actions/assetTypeQueries";
import PaginationNav from "@/src/components/ui/PaginationNav";
import { PaginationSearchParams } from "@/src/interfaces/paginationSearchParams";
import Heading from "@/src/interfaces/heading";

async function AssetTypes({
  searchParams,
}: {
  searchParams: Promise<PaginationSearchParams>;
}) {
  const LIMIT = 20;

  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page ?? "1") || 1);
  const sortField = params.sortField ?? "asset_type_name";
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc";

  const { data: asset_types, total } = await getPaginatedAssetTypes({
    page,
    limit: LIMIT,
    sortField,
    sortOrder,
  });
  const totalPages = Math.ceil(total / LIMIT);

  const headings: Heading[] = [
    { label: "ID" },
    { label: "Asset Type", sortField: "asset_type_name" },
  ];

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
        <TableHeading
          headings={headings}
          currentSortField={sortField}
          currentSortOrder={sortOrder}
          searchParams={params}
        />
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
      <PaginationNav
        currentPage={page}
        totalPages={totalPages}
        searchParams={params as Record<string, string | undefined>}
      />
    </>
  );
}

export default AssetTypes;
