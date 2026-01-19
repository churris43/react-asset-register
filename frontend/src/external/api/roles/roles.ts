import RoleInterface from "@/src/interfaces/role";

export const getRoles = async () => {
  // @todo: Need to work out how to proxy this
  const response = await fetch("http://api:3000/roles");
  if (!response.ok) {
    throw new Error("Failed to get roles");
  }
  const data = await response.json();
  return data;
};

export const getRole = async (roleId: number) => {
  try {
    const response = await fetch("/api/roles/" + roleId);
    if (!response.ok) {
      throw new Error("Failed to get role");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createRole = async (data: RoleInterface) => {
  const response = await fetch("/api/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create role");
  }

  return response.json();
};

export const editRole = async (roleId: number, data: RoleInterface) => {
  const response = await fetch("/api/roles/" + roleId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create role");
  }

  return response.json();
};

export const deleteRole = async (id: number) => {
  const res = await fetch("/api/roles/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
};

export default deleteRole;
