import * as z from "zod";

import { calculateEighteenYearsAgo } from "@/lib/utils";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(5, { message: "Username or Email must be at least 5 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be at most 64 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: "Username must be at least 5 characters" })
      .max(20, { message: "Username must be at most 20 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password must be at most 64 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" })
      .max(64, { message: "Confirm password must be at most 64 characters" }),
    first_name: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" })
      .max(50, { message: "First name must be at most 50 characters" }),
    last_name: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" })
      .max(50, { message: "Last name must be at most 50 characters" }),
    birthdate: z.date().refine(
      (date) => {
        const eighteenYearsAgo = calculateEighteenYearsAgo();
        return date <= eighteenYearsAgo;
      },
      { message: "You must be at least 18 years old" },
    ),
    accept_terms: z.boolean().refine((value) => value === true, {
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
      .max(20, { message: "Username must be at most 20 characters" })
      .optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password must be at most 64 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      })
      .optional(),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" })
      .max(64, { message: "Confirm password must be at most 64 characters" })
      .optional(),
    first_name: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" })
      .max(50, { message: "First name must be at most 50 characters" })
      .optional(),
    last_name: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" })
      .max(50, { message: "Last name must be at most 50 characters" })
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
    profile_picture: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    { message: "Passwords do not match", path: ["confirmPassword"] },
  );

export const passwordResetSchemaToken = z
  .object({
    token: z.string().regex(UUID_REGEX, { message: "Invalid token format" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password must be at most 64 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" })
      .max(64, { message: "Confirm password must be at most 64 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
