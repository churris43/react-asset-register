import { userModel } from "../generated/prisma/models/user";

import { prisma } from "../lib/prisma";
import User, { UserWithRelationsPublic } from "../types/User";
import bcrypt from "bcrypt";
import { buildOrderBy, NestedOrderBy } from "../utils/buildOrderBy";

const SALT_ROUNDS = 12;

const NESTED_SORT_FIELDS: Record<string, NestedOrderBy> = {
  role_name: (order) => ({ role: { role_name: order } }),
};

export const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const createUser = async (
  user: Omit<User, "id">,
): Promise<userModel> => {
  const existing = await prisma.user.findUnique({
    where: { email: user.email },
  });
  // Never store plain text passwords — bcrypt hashes and salts in one step
  const password_hash = await bcrypt.hash(user.password_hash, SALT_ROUNDS);

  if (existing) throw new Error("EMAIL_TAKEN");

  const data = {
    name: user.name,
    email: user.email,
    password_hash: password_hash,
    isAdmin: user.isAdmin,
    role_id: user.role_id ? Number(user.role_id) : null,
  };

  return prisma.user.create({
    data: data,
  });
};

export const getPaginatedUsers = async (
  page: number,
  limit: number,
  sortField: string,
  sortOrder: "asc" | "desc",
): Promise<{ data: UserWithRelationsPublic[]; total: number }> => {
  const [data, total] = await Promise.all([
    // todo: evaluate if password needs to be passed here, idealy not
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: buildOrderBy(sortField, sortOrder, NESTED_SORT_FIELDS),
      omit: {
        password_hash: true,
      },
      include: { role: true },
    }),
    prisma.user.count(),
  ]);

  return { data, total };
};

export const deleteUser = async (id: number): Promise<userModel> => {
  return prisma.user.delete({
    where: {
      id: id,
    },
  });
};

export const updateUser = async (
  id: number,
  user: Omit<User, "id"> & { password_hash?: string },
): Promise<userModel | null> => {
  const SALT_ROUNDS = 12; // Higher value = more secure but slower — 12 is the recommended production default
  const data: any = {
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    role_id: user.role_id ? Number(user.role_id) : null,
  };

  // Password is optional on updates — only hash and update if provided
  // This allows users to edit their profile without changing their password
  if (user.password_hash?.trim()) {
    data.password_hash = await bcrypt.hash(user.password_hash, SALT_ROUNDS);
  }

  return prisma.user.update({
    where: {
      id: id,
    },
    data,
  });
};
