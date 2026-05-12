import EditButton from "../features/EditButton";
import Field from "../../interfaces/field";
import { DeleteRecordButton } from "../features/DeleteButton";

interface RowActionButtonsProps {
  id: number;
  recordName: string;
  deleteAction: () => Promise<{ success: boolean; error?: string }>;
  fields: Field[];
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
  initialData,
  editAction,
}: RowActionButtonsProps) {
  return (
    <div className="justify-self-end px-2 py-4">
      <EditButton
        id={id}
        fields={fields}
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
