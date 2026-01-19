import EditRoleButton from "./EditRoleButton";
import DeleteButton from "./DeleteButton";

interface RowActionButtonsProps {
  id: number;
  record: string;
}

function RowActionButtons({ id, record }: RowActionButtonsProps) {
  return (
    <div className="justify-self-end px-2 py-4">
      <EditRoleButton id={id} />
      <DeleteButton record={record} id={id} />
    </div>
  );
}

export default RowActionButtons;
