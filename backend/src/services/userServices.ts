import { userModel } from "../generated/prisma/models/user";

import { prisma } from "../lib/prisma";
import User, { UserPublic } from "../types/User";
import bcrypt from "bcrypt";

export const getPaginatedUsers = async (
  page: number,
  limit: number,
  sortField: string,
  sortOrder: "asc" | "desc",
): Promise<{ data: UserPublic[]; total: number }> => {
  const [data, total] = await Promise.all([
    // todo: evaluate if password needs to be passed here, idealy not
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortField]: sortOrder },
      omit: {
        password_hash: true,
      },
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
