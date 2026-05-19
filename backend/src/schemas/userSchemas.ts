import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password_hash: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

export const updateUserSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password_hash: z
    .string()
    .refine((val) => val === "" || (val.length >= 8 && val.length <= 128), {
      message: "Password must be 8–128 characters if provided",
    }),
});
