interface UserInterface {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  isAdmin: boolean | null;
}

export default UserInterface;
