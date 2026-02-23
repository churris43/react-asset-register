import EditRoleButton from "../features/EditButton";
import Field from "../../interfaces/field";
import { DeleteRecordButton } from "../features/DeleteRecordButton";

interface RowActionButtonsProps {
  id: number;
  record: string;
  deleteAction: () => Promise<{ success: boolean; error?: string }>;
  fields: Field[];
  getAction: () => Promise<{ success: boolean; error?: string }>;
  editAction?: (
    id: number,
    data: any,
  ) => Promise<{ success: boolean; error?: string }>;
}

function RowActionButtons({
  id,
  record,
  deleteAction,
  fields,
  getAction,
  editAction,
}: RowActionButtonsProps) {
  return (
    <div className="justify-self-end px-2 py-4">
      <EditRoleButton
        id={id}
        fields={fields}
        getAction={getAction}
        editAction={editAction}
      />
      <DeleteRecordButton record={record} id={id} deleteAction={deleteAction} />
    </div>
  );
}

export default RowActionButtons;
