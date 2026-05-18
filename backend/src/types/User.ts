interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  isAdmin: boolean | null;
  created_at: Date;
}

type UserPublic = Omit<User, "password_hash">;

export default User;
export { UserPublic };
