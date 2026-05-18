import AddButton from "@/src/components/features/AddButton";
import TableHeading from "@/src/components/ui/TableHeading";
import Field from "../../interfaces/field";
import FieldConfig from "../../interfaces/fieldConfig";
import TableRow from "@/src/components/ui/TableRow";
import TableFooter from "@/src/components/ui/TableFooter";
import PaginationNav from "@/src/components/ui/PaginationNav";
import { PaginationSearchParams } from "@/src/interfaces/paginationSearchParams";
import Heading from "@/src/interfaces/heading";
import { getPaginatedUsers } from "../actions/userQueries";
import { createUser, deleteUser, editUser } from "../actions/userActions";
import UserInterface from "@/src/interfaces/user";

async function Users({
  searchParams,
}: {
  searchParams: Promise<PaginationSearchParams>;
}) {
  const LIMIT = 20;

  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page ?? "1") || 1);
  const sortField = params.sortField ?? "email";
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc";

  const { data: users, total } = await getPaginatedUsers({
    page,
    limit: LIMIT,
    sortField,
    sortOrder,
  });
  const totalPages = Math.ceil(total / LIMIT);

  const headings: Heading[] = [
    { label: "ID" },
    { label: "Name", sortField: "name" },
    { label: "Email", sortField: "email" },
    { label: "Is Admin", sortField: "isAdmin" },
  ];

  const fields: Array<Field> = [
    {
      name: "name",
      label: "Name",
      required: true,
      type: "text",
      htmlElementType: "input",
    },
    {
      name: "email",
      label: "Email",
      required: true,
      type: "text",
      htmlElementType: "input",
    },
    {
      name: "password_hash",
      label: "Password",
      required: true,
      type: "password",
      htmlElementType: "input",
      hide: true,
    },
    {
      name: "isAdmin",
      label: "Is Admin",
      required: false,
      type: "checkbox",
      htmlElementType: "input",
    },
  ];

  const fieldConfig: FieldConfig = {
    password_hash: {
      requiredInMode: "add",
    },
  };

  return (
    <>
      <h1 className="text-xl mb-4 flex items-center justify-between">
        Users{" "}
        <AddButton
          recordName="User"
          fields={fields}
          fieldConfig={fieldConfig}
          createAction={createUser}
        />
      </h1>
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <TableHeading
          headings={headings}
          currentSortField={sortField}
          currentSortOrder={sortOrder}
          searchParams={params}
        />
        {users.map((user: UserInterface) => (
          <TableRow
            recordName="users"
            record={user}
            id={user.id}
            key={user.id}
            deleteAction={deleteUser.bind(null, user.id)}
            editAction={editUser}
            fields={fields}
            fieldConfig={fieldConfig}
          />
        ))}
        <TableFooter
          colCount={fields.length}
          summary={users.length === 0 ? "No users found" : ""}
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

export default Users;
