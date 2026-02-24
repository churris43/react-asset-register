import Field from "@/src/interfaces/field";
import RowActionButtons from "./RowActionButtons";
import AssetTypeInterface from "@/src/interfaces/assetType";
import RoleInterface from "@/src/interfaces/role";

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
  record: AssetTypeInterface | RoleInterface;
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
      className="grid grid-cols-3 border-b last:border-b-0 hover:bg-blue-500 transition-colors bg-blue-400  h-10"
      style={{ gridTemplateColumns: cols }}
    >
      <span className="px-3 py-4">{record.id} </span>
      {fields.map((field: Field) => (
        <span key={field.name} className="text-sm ml-4 px-3 py-4">
          {record[field.name as keyof typeof record]}
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
