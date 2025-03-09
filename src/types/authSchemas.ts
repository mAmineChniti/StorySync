import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: 'Username must be at least 5 characters' }),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    firstName: z
      .string()
      .min(3, { message: 'First name must be at least 3 characters' }),
    lastName: z
      .string()
      .min(3, { message: 'Last name must be at least 3 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
