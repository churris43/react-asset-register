import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // time window in milliseconds — 5 minutes
  max: 10, // max requests allowed per IP within the window
  message: { message: "Too many attempts, please try again later" },
});
