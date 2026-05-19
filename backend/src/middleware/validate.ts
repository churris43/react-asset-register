import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

// Middleware factory that validates request body against a Zod schema.
// Returns 422 with fieldErrors if validation fails, allowing the frontend to display field-specific errors.
export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      // Replace req.body with parsed/coerced data and pass to next handler
      req.body = result.data;
      return next();
    }
    // Build a map of field name → first error message for each field
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      // Only capture the first error per field; skip if already set
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    // Return 422 Unprocessable Entity with field-level errors (not 400 Bad Request)
    // This signals to the frontend that validation failed and allows it to display errors in the form
    return res.status(422).json({ fieldErrors });
  };
