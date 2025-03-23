import * as z from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(5, "Username or Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: "Username must be at least 5 characters" }),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    first_name: z.string()
      .min(3, { message: "First name must be at least 3 characters" }),
    last_name: z.string()
      .min(3, { message: "Last name must be at least 3 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
