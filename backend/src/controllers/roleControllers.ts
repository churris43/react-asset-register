import { Request, Response } from "express";
import * as roleServices from "../services/roleServices";
import Role from "../types/Role";

export const getRolesById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const role = await roleServices.getRolesById(Number(req.params.id));
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch role" });
  }
};

export const deleteRole = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const role = await roleServices.deleteRole(Number(req.params.id));
    return res.status(200).json({ message: "Role deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete role" });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleServices.getRoles();

    res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch roles" });
  }
};

export const createRole = async (
  req: Request<{ role: Role }>,
  res: Response,
) => {
  try {
    const role = await roleServices.createRole(req.body);
    return res.status(200).json({ message: "Role created" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create role" });
  }
};

export const updateRole = async (
  req: Request<{ id: string; role: Role }>,
  res: Response,
) => {
  try {
    const role = await roleServices.updateRole(Number(req.params.id), req.body);
    return res.status(200).json({ message: "Role updated" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update role" });
  }
};

export default getRolesById;
