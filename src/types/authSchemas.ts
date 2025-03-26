import * as z from "zod";

export const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const baseSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm password must be at least 6 characters" }),
  first_name: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" }),
  last_name: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" }),
  birthdate: z
    .date({
      required_error: "Birthdate is required",
    })
    .refine((date) => date <= eighteenYearsAgo, {
      message: "You must be at least 18 years old to register",
    }),
});

export const loginSchema = z.object({
  identifier: z.string().min(5, "Username or Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = baseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

export const profileUpdateSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: "Username must be at least 5 characters" })
      .optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .optional(),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters" })
      .optional(),
    first_name: z
      .string()
      .min(3, { message: "First name must be at least 3 characters" })
      .optional(),
    last_name: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters" })
      .optional(),
    birthdate: z
      .date({
        required_error: "Birthdate is required",
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );
