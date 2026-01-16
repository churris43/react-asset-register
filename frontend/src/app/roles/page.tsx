import Link from "next/link";
import DeleteButton from "@/src/components/DeleteButton";

interface Role {
  id: number;
  role_name: string;
  staff_name: string;
}

async function Roles() {
  // @todo: Need to work out how to proxy this
  const response = await fetch("http://api:3000/roles");
  if (!response.ok) throw new Error("Failed to fetch data");

  const roles = await response.json();

  return (
    <>
      <h1 className="text-xl mb-4">Roles</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden ">
        <div className="grid grid-cols-4 bg-slate-800 text-white font-semibold  h-10 grid-cols-[80px_1fr_1fr_1fr]">
          <div className="px-3 py-4">ID</div>
          <div className="px-3 py-4">Role</div>
          <div className="px-3 py-4">Staff Name</div>
          <div className="px-3 py-4">Action</div>
        </div>
        {roles.map((role: Role) => (
          <div
            key={role.id}
            className="grid grid-cols-4 border-b last:border-b-0 hover:bg-blue-500 transition-colors bg-blue-400  h-10 grid-cols-[80px_1fr_1fr_1fr]"
          >
            <div className="px-3 py-4">{role.id} </div>
            <Link
              className="underline text-sm ml-4 px-3 py-4"
              href={`roles/${role.id}`}
            >
              {role.role_name}
            </Link>
            <div className="px-3 py-4">{role.staff_name} </div>
            <DeleteButton record="roles" id={role.id} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Roles;
