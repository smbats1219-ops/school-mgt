import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().optional().or(z.literal("")),
});

export const createRoleSchema = z.object({
  role_key: z
    .string()
    .min(1, "Role key is required")
    .regex(
      /^[a-z][a-z0-9_]*$/,
      "Role key must be lowercase, e.g. admin or inventory_manager",
    ),
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional().or(z.literal("")),
  isSystemRole: z.boolean().optional(),
});

export const assignRoleSchema = z.object({
  roleId: z.string().min(1, "Role is required"),
});

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
export type CreateRoleSchemaType = z.infer<typeof createRoleSchema>;
export type AssignRoleSchemaType = z.infer<typeof assignRoleSchema>;