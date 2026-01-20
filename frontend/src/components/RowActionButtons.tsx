import EditRoleButton from "./EditRoleButton";
import DeleteButton from "./DeleteButton";

interface RowActionButtonsProps {
  id: number;
  record: string;
  deleteAction: () => Promise<{ success: boolean; error?: string }>; // No ID needed
}

function RowActionButtons({ id, record, deleteAction }: RowActionButtonsProps) {
  return (
    <div className="justify-self-end px-2 py-4">
      <EditRoleButton id={id} />
      <DeleteButton record={record} id={id} deleteAction={deleteAction} />
    </div>
  );
}

export default RowActionButtons;
