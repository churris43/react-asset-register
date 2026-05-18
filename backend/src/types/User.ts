interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

type UserPublic = Omit<User, "password_hash">;

export default User;
export { UserPublic };
