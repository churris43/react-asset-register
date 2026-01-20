import EditRoleButton from "./EditRoleButton";
import DeleteButton from "./DeleteButton";
import Field from "../interfaces/field";

interface RowActionButtonsProps {
  id: number;
  record: string;
  deleteAction: () => Promise<{ success: boolean; error?: string }>; // No ID needed
  fields: Field[];
}

function RowActionButtons({
  id,
  record,
  deleteAction,
  fields,
}: RowActionButtonsProps) {
  return (
    <div className="justify-self-end px-2 py-4">
      <EditRoleButton id={id} fields={fields} />
      <DeleteButton record={record} id={id} deleteAction={deleteAction} />
    </div>
  );
}

export default RowActionButtons;
