import { calculateEighteenYearsAgo } from "@/lib/utils";
import * as z from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(5, "Username or Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    birthdate: z.date().refine(
      (date) => {
        const eighteenYearsAgo = calculateEighteenYearsAgo();
        return date <= eighteenYearsAgo;
      },
      { message: "You must be at least 18 years old" },
    ),
    accept_terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service to register",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.accept_terms === true, {
    message: "You must accept the Terms of Service to register",
    path: ["accept_terms"],
  });

export const profileUpdateSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: "Username must be at least 5 characters" })
      .optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .optional(),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Confirm password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Confirm password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Confirm password must contain at least one number",
      })
      .optional(),
    first_name: z
      .string()
      .min(1, { message: "First name is required" })
      .optional(),
    last_name: z
      .string()
      .min(1, { message: "Last name is required" })
      .optional(),
    birthdate: z
      .date()
      .refine(
        (date) => {
          const eighteenYearsAgo = calculateEighteenYearsAgo();
          return date <= eighteenYearsAgo;
        },
        { message: "You must be at least 18 years old" },
      )
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

export const passwordResetSchemaToken = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
