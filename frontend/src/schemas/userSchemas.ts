import z from "zod";

export const passwordAddSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be maximum 128 characters");

export const passwordEditSchema = z
  .string()
  .refine((val) => val === "" || (val.length >= 8 && val.length <= 128), {
    message: "Password must be between 8 and 128 characters long if provided",
  });
