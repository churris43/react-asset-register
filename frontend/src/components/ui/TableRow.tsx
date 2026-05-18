import Field from "@/src/interfaces/field";
import FieldConfig from "@/src/interfaces/fieldConfig";
import RowActionButtons from "./RowActionButtons";
import AssetTypeInterface from "@/src/interfaces/assetType";
import RoleInterface from "@/src/interfaces/role";
import AssetInterface from "@/src/interfaces/asset";
import { getNestedValue } from "@/src/utils/json";
import UserInterface from "@/src/interfaces/user";

interface TableRowProps {
  id: number;
  recordName: string;
  deleteAction: () => Promise<{ success: boolean; error?: string }>;
  fields: Field[];
  fieldConfig?: FieldConfig;
  editAction?: (
    id: number,
    data: any,
  ) => Promise<{ success: boolean; error?: string }>;
  record: AssetTypeInterface | RoleInterface | AssetInterface | UserInterface;
}

function TableRow({
  id,
  recordName,
  deleteAction,
  fields,
  fieldConfig,
  editAction,
  record,
}: TableRowProps) {
  const visibleFields = fields.filter((field) => !field.hide);

  // An extra 1fr is added as the "Id" column is not included in the fields list
  const cols = ` 80px ${visibleFields.map(() => "1fr").join(" ")} 1fr auto`;

  return (
    <div
      key={record.id}
      className="grid border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition-colors bg-white text-gray-800 h-10"
      style={{ gridTemplateColumns: cols }}
    >
      <span className="px-3 py-4">{record.id} </span>
      {fields.map(
        (field: Field) =>
          !field.hide && (
            <span key={field.name} className="text-sm px-3 py-4">
              {field.type === "checkbox"
                ? getNestedValue(record, field.childField ?? field.name) === true
                  ? "Yes"
                  : ""
                : getNestedValue(record, field.childField ?? field.name)}
            </span>
          ),
      )}
      <RowActionButtons
        recordName={recordName}
        id={id}
        deleteAction={deleteAction}
        initialData={record}
        editAction={editAction}
        fields={fields}
        fieldConfig={fieldConfig}
      />
    </div>
  );
}

export default TableRow;
