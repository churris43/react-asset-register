import Link from "next/link";

function Roles() {
  return (
    <>
      <h1 className="text-xl">Roles</h1>
      <ul>
        <li>
          <Link className="underline text-sm" href="roles/1">
            Role 1
          </Link>
        </li>
        <li>
          <Link className="underline text-sm" href="roles/2">
            Role 2
          </Link>
        </li>
        <li>
          <Link className="underline text-sm" href="roles/3">
            Role 3
          </Link>
        </li>
      </ul>
    </>
  );
}

export default Roles;
