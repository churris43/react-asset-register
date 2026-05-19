import RoleInterface from "./role";

interface UserInterface {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role_id?: number;
  isAdmin: boolean | null;
  role?: RoleInterface;
}

export default UserInterface;
