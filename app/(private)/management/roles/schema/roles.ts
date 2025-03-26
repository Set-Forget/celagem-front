import { z } from 'zod';

export const newRoleGeneralSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .nonempty({ message: 'El nombre es requerido' })
    .default(''),
  company_id: z.string(),
  created_by: z.string(),
});

export const newRoleSchema = newRoleGeneralSchema;

export const rolesSchema = z.object({
  id: z.string(),
  name: z.string(),
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

export const rolesListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(rolesSchema),
});

export const roleResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: rolesSchema,
});

export const roleOperationResponseSchema = z.object({
  // Delete, Add Permission, Delete Permission
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const roleCreateBodySchema = z.object({
  name: z.string(),
  company_id: z.string(),
});

export const roleUpdateBodySchema = z.object({
  name: z.string(),
});

export const roleAddPermissionBodySchema = z.object({
  permission_id: z.string(),
});

export type Roles = z.infer<typeof rolesSchema>;
export type RolesListResponse = z.infer<typeof rolesListResponseSchema>;
export type RoleResponse = z.infer<typeof roleResponseSchema>;
export type RoleOperationResponse = z.infer<typeof roleOperationResponseSchema>;
export type RoleCreateBody = z.infer<typeof roleCreateBodySchema>;
export type RoleUpdateBody = z.infer<typeof roleUpdateBodySchema>;
export type RoleAddPermissionBody = z.infer<typeof roleAddPermissionBodySchema>;
