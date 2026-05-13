import AddButton from "@/src/components/features/AddButton";
import RoleInterface from "@/src/interfaces/role";
import TableHeading from "@/src/components/ui/TableHeading";
import deleteRole, { createRole, editRole } from "../actions/roleActions";
import Field from "../../interfaces/field";
import TableRow from "@/src/components/ui/TableRow";
import TableFooter from "@/src/components/ui/TableFooter";
import { getPaginatedRoles } from "../actions/roleQueries";
import PaginationNav from "@/src/components/ui/PaginationNav";
import { PaginationSearchParams } from "@/src/interfaces/paginationSearchParams";

async function Roles({
  searchParams,
}: {
  searchParams: Promise<PaginationSearchParams>;
}) {
  const LIMIT = 20;

  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page ?? "1") || 1);
  const sortField = params.sortField ?? "role_name";
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc";

  const { data: roles, total } = await getPaginatedRoles({
    page,
    limit: LIMIT,
    sortField,
    sortOrder,
  });
  const totalPages = Math.ceil(total / LIMIT);

  const headings = ["ID", "Role", "Staff Name"];

  const fields: Array<Field> = [
    {
      name: "role_name",
      label: "Role",
      required: true,
      type: "text",
      htmlElementType: "input",
    },
    {
      name: "staff_name",
      label: "Staff Name",
      type: "text",
      htmlElementType: "input",
    },
  ];

  return (
    <>
      <h1 className="text-xl mb-4 flex items-center justify-between">
        Roles{" "}
        <AddButton
          recordName="Role"
          fields={fields}
          createAction={createRole}
        />
      </h1>
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <TableHeading headings={headings} />
        {roles.map((role: RoleInterface) => (
          <TableRow
            recordName="roles"
            record={role}
            id={role.id}
            key={role.id}
            deleteAction={deleteRole.bind(null, role.id)}
            editAction={editRole}
            fields={fields}
          />
        ))}
        <TableFooter
          colCount={fields.length}
          summary={roles.length === 0 ? "No roles found" : ""}
        />
      </div>
      <PaginationNav
        currentPage={page}
        totalPages={totalPages}
        searchParams={params as Record<string, string | undefined>}
      />
    </>
  );
}

export default Roles;
