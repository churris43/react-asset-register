import Link from "next/link";

function Roles() {
  return (
    <>
      <h1>Roles</h1>
      <ul>
        <Link href="roles/1">Role 1</Link>
        <Link href="roles/2">Role 2</Link>
        <Link href="roles/3">Role 3</Link>
      </ul>
    </>
  );
}

export default Roles;
