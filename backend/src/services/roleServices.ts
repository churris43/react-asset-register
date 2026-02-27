import { connection } from "../index";
import Role from "../types/Role";
import { roleModel } from "../generated/prisma/models/role";

import { prisma } from "../lib/prisma";

export const getRoles = async (): Promise<roleModel[]> => {
  return prisma.role.findMany();
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

export const createRole = async (role: Role): Promise<roleModel> => {
  return prisma.role.create({
    data: {
      role_name: role.role_name,
      staff_name: role.staff_name,
    },
  });
};

export const updateRole = async (
  id: number,
  role: Role,
): Promise<roleModel | null> => {
  return prisma.role.update({
    where: {
      id: id,
    },
    data: {
      role_name: role.role_name,
      staff_name: role.staff_name,
    },
  });
};

export default getRolesById;
