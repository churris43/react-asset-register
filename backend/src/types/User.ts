import { userGetPayload } from "../generated/prisma/models";

interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  isAdmin: boolean | null;
  role_id?: number;
  created_at?: Date;
}

export type UserWithRelations = userGetPayload<{
  include: { role: true };
}>;

export type UserWithRelationsPublic = Omit<UserWithRelations, "password_hash">;

export default User;
