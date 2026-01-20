import AddButton from "@/src/components/AddButton";
import { getRoles } from "@/src/external/api/roles/roles";
import RoleInterface from "@/src/interfaces/role";
import TableHeading from "@/src/components/TableHeading";
import RowActionButtons from "@/src/components/RowActionButtons";
import deleteRole from "../actions/roleActions";
import { getRole } from "../actions/roleActions";
import Field from "../../interfaces/field";

async function Roles() {
  const roles = await getRoles();

  const headings = ["ID", "Role", "Staff Name"];

  const fields: Array<Field> = [
    {
      name: "role_name",
      label: "Role",
      required: true,
      type: "text",
    },
    {
      name: "staff_name",
      label: "Staff Name",
      type: "text",
    },
  ];

  return (
    <>
      <h1 className="text-xl mb-4">
        Roles <AddButton record="Role" fields={fields} />
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
            <RowActionButtons
              record="roles"
              id={role.id}
              deleteAction={deleteRole.bind(null, role.id)}
              getAction={getRole.bind(null, role.id)}
              fields={fields}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default Roles;
