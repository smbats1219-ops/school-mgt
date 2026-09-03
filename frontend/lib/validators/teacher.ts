import { z } from "zod";

export const createTeacherSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
});

export const updateTeacherSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
});

export type CreateTeacherSchemaType = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherSchemaType = z.infer<typeof updateTeacherSchema>;
