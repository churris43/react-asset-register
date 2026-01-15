async function RoleDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <h1>Details for role: {id}</h1>;
}

export default RoleDetails;
