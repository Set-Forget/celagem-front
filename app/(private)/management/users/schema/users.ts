import { z } from 'zod';

export const usersSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  is_email_confirmed: z.boolean(),
  created_at: z.date(),
  modified_at: z.date(),
});

export const userListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(usersSchema),
});

export const userResponseSchema = z.object({
  // Create, Retrieve, Edit
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: usersSchema,
  details: z.string(),
});

export const userOperationSchema = z.object({ // Delete, Edit user Role
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

export const userEditBodySchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
});

export const userEditRoleBodySchema = z.object({
  role_id: z.string(),
});

export type Users = z.infer<typeof usersSchema>;
export type UserListResponse = z.infer<typeof userListResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserOperationResponse = z.infer<typeof userOperationSchema>;
export type UserCreateBody = z.infer<typeof userCreateBodySchema>;
export type UserEditBody = z.infer<typeof userEditBodySchema>;
export type UserEditRoleBody = z.infer<typeof userEditRoleBodySchema>;
