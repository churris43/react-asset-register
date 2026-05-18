interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export default User;
