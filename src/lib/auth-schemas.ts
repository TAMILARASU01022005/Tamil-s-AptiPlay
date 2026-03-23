import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(2)
    .max(50),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
});

export const loginSchema = registerSchema.pick({
  email: true,
  password: true,
});

export type RegisterValues = z.infer<typeof registerSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
