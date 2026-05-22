import { Request, Response } from "express";
import * as userServices from "../services/userServices";
import { parsePaginationParams } from "../utils/parsePaginationParams";

const ALLOWED_SORT_FIELDS = ["email", "name", "isAdmin", "role_name"] as const;

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userServices.createUser(req.body);
    return res.status(200).json({ message: "User created" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create user" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit, sortField, sortOrder } = parsePaginationParams(
      req.query,
      ALLOWED_SORT_FIELDS,
      "email",
    );

    const users = await userServices.getPaginatedUsers(
      page,
      limit,
      sortField,
      sortOrder,
    );
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch users" });
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const user = await userServices.deleteUser(Number(req.params.id));
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete user" });
  }
};

export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const user = await userServices.updateUser(Number(req.params.id), req.body);
    return res.status(200).json({ message: "User updated" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update user" });
  }
};
