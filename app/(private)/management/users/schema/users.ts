import { z } from 'zod';

export const newUserGeneralSchema = z.object({
  first_name: z.string({ required_error: "El nombre es requerido" }).nonempty({ message: "El nombre es requerido" }).default(""),
  last_name: z.string({ required_error: "El apellido es requerido" }).nonempty({ message: "El apellido es requerido" }).default(""),
  email: z.string({ required_error: "El correo electrónico es requerido" }).nonempty({ message: "El correo electrónico es requerido" }).default(""),
  role_id: z.string({ required_error: "El rol es requerido" }).nonempty({ message: "El rol es requerido" }).default(""),
  company_id: z.string({ required_error: "La sede es requerida" }).nonempty({ message: "La sede es requerida" }).default(""),
  created_by: z.string(),
});

export const newUserSchema = newUserGeneralSchema;

export const usersSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  role_id: z.string(),
  company_id: z.string(),
  is_email_confirmed: z.boolean(),
  created_at: z.string(),
  created_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  modified_at: z.string(),
  updated_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
});

export const userListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(usersSchema),
});

export const userResponseSchema = z.object({
  // Create, Get, Edit
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: usersSchema,
  details: z.string(),
});

export const userDeleteSchema = z.object({
  // Delete, Edit user Role
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.string(),
  details: z.string(),
});

export const userCreateBodySchema = z.object({
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  password: z.string(),
  company_id: z.string(),
});

export const userUpdateBodySchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
});

export const userUpdateRoleBodySchema = z.object({
  role_id: z.string(),
});

export type Users = z.infer<typeof usersSchema>;
export type UserListResponse = z.infer<typeof userListResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserOperationResponse = z.infer<typeof userDeleteSchema>;
export type UserCreateBody = z.infer<typeof userCreateBodySchema>;
export type UserUpdateBody = z.infer<typeof userUpdateBodySchema>;
export type UserUpdateRoleBody = z.infer<typeof userUpdateRoleBodySchema>;
