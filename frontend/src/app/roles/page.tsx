import Link from "next/link";
import DeleteButton from "@/src/components/DeleteButton";
import AddRoleButton from "@/src/components/AddRoleButton";
import EditRoleButton from "@/src/components/EditRoleButton";
import { getRoles } from "@/src/external/api/roles/roles";
import RoleInterface from "@/src/interfaces/role";
import TableHeading from "@/src/components/TableHeading";
import RowActionButtons from "@/src/components/RowActionButtons";

async function Roles() {
  const roles = await getRoles();

  const headings = ["ID", "Role", "Staff Name"];

  return (
    <>
      <h1 className="text-xl mb-4">
        Roles <AddRoleButton record="Role" />
      </h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden ">
        <TableHeading headings={headings} />
        {roles.map((role: RoleInterface) => (
          <div
            key={role.id}
            className="grid grid-cols-4 border-b last:border-b-0 hover:bg-blue-500 transition-colors bg-blue-400  h-10 grid-cols-[80px_1fr_1fr_1fr]"
          >
            <div className="px-3 py-4">{role.id} </div>
            <span className="text-sm ml-4 px-3 py-4">{role.role_name}</span>
            <div className="px-3 py-4">{role.staff_name} </div>
            <RowActionButtons record="roles" id={role.id} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Roles;
