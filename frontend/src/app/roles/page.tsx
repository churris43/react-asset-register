import Link from "next/link";

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
  console.log(roles);

  return (
    <>
      <h1 className="text-xl mb-4">Roles</h1>
      <ul>
        {roles.map((role: Role) => (
          <li key={role.id}>
            <span>{role.id} </span>
            <Link className="underline text-sm ml-4" href={`roles/${role.id}`}>
              {role.role_name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Roles;
