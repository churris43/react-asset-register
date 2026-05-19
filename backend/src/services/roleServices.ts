import Role from "../types/Role";
import { roleModel } from "../generated/prisma/models/role";

import { prisma } from "../lib/prisma";

export const getRoles = async (): Promise<roleModel[]> => {
  return prisma.role.findMany({
    orderBy: {
      role_name: "asc",
    },
  });
};

export const getPaginatedRoles = async (
  page: number,
  limit: number,
  sortField: string,
  sortOrder: "asc" | "desc",
): Promise<{ data: roleModel[]; total: number }> => {
  const [data, total] = await Promise.all([
    prisma.role.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortField]: sortOrder },
    }),
    prisma.role.count(),
  ]);

  return { data, total };
};

export const getRolesById = async (id: number): Promise<roleModel | null> => {
  return prisma.role.findUnique({
    where: {
      id: id,
    },
  });
};

export const deleteRole = async (id: number): Promise<roleModel> => {
  return prisma.role.delete({
    where: {
      id: id,
    },
  });
};

export const createRole = async (
  role: Omit<Role, "id">,
): Promise<roleModel> => {
  return prisma.role.create({
    data: {
      role_name: role.role_name,
    },
  });
};

export const updateRole = async (
  id: number,
  role: Omit<Role, "id">,
): Promise<roleModel | null> => {
  return prisma.role.update({
    where: {
      id: id,
    },
    data: {
      role_name: role.role_name,
    },
  });
};

export default getRolesById;
