import RoleInterface from "@/src/interfaces/role";
import headers from "@/src/utils/constants";

export const getRoles = async () => {
  // @todo: Need to work out how to proxy this, this request comes fro the server
  const response = await fetch("http://api:3000/roles");
  if (!response.ok) {
    throw new Error("Failed to get roles");
  }
  const data = await response.json();
  return data;
};

export const getRole = async (id: number) => {
  try {
    const response = await fetch("/api/roles/" + id);
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
    headers: headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create role");
  }

  return response.json();
};

//todo: delete me
export const editRole = async (id: number, data: RoleInterface) => {
  const response = await fetch("/api/roles/" + id, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create role");
  }

  return response.json();
};

export default editRole;
