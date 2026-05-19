import EditButton from "../features/EditButton";
import Field from "../../interfaces/field";
import FieldConfig from "../../interfaces/fieldConfig";
import { DeleteRecordButton } from "../features/DeleteButton";
import { SchemaDomain } from "@/src/schemas/schemasRegistry";

interface RowActionButtonsProps {
  id: number;
  recordName: string;
  deleteAction: () => Promise<{ success: boolean; error?: string }>;
  fields: Field[];
  fieldConfig?: FieldConfig;
  domain?: SchemaDomain;
  initialData: Record<string, any>;
  editAction?: (
    id: number,
    data: any,
  ) => Promise<{ success: boolean; error?: string }>;
}

function RowActionButtons({
  id,
  recordName,
  deleteAction,
  fields,
  fieldConfig,
  domain,
  initialData,
  editAction,
}: RowActionButtonsProps) {
  return (
    <div className="justify-self-end px-2 py-4">
      <EditButton
        id={id}
        fields={fields}
        fieldConfig={fieldConfig}
        domain={domain}
        initialData={initialData}
        editAction={editAction}
      />
      <DeleteRecordButton
        recordName={recordName}
        deleteAction={deleteAction}
      />
    </div>
  );
}

export default RowActionButtons;
