import Field from "@/src/interfaces/field";
import RowActionButtons from "./RowActionButtons";
import AssetTypeInterface from "@/src/interfaces/assetType";
import RoleInterface from "@/src/interfaces/role";
import AssetInterface from "@/src/interfaces/asset";
import { getNestedValue } from "@/src/utils/json";

interface TableRowProps {
  id: number;
  recordName: string;
  deleteAction: () => Promise<{ success: boolean; error?: string }>;
  fields: Field[];
  getAction: () => Promise<{ success: boolean; error?: string }>;
  editAction?: (
    id: number,
    data: any,
  ) => Promise<{ success: boolean; error?: string }>;
  record: AssetTypeInterface | RoleInterface | AssetInterface;
}

function TableRow({
  id,
  recordName,
  deleteAction,
  fields,
  getAction,
  editAction,
  record,
}: TableRowProps) {
  // An extra 1fr is added as the "Id" column is not included in the fields list
  const cols = ` 80px ${fields.map(() => "1fr").join(" ")} 1fr auto`;

  return (
    <div
      key={record.id}
      className="grid grid-cols-3 border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition-colors bg-white text-gray-800 h-10"
      style={{ gridTemplateColumns: cols }}
    >
      <span className="px-3 py-4">{record.id} </span>
      {fields.map((field: Field) => (
        <span key={field.name} className="text-sm ml-4 px-3 py-4">
          {getNestedValue(record, field.childField ?? field.name)}
        </span>
      ))}
      <RowActionButtons
        recordName={recordName}
        id={id}
        deleteAction={deleteAction}
        getAction={getAction}
        editAction={editAction}
        fields={fields}
      />
    </div>
  );
}

export default TableRow;
