import { z } from 'zod';

export const roleListSchema = z.object({
  id: z.string(),
  name: z.string(),
  company_id: z.string(),
  company_name: z.string(),
})

export const roleListResponseSchema = z.object({
  data: z.array(roleListSchema),
  status: z.string(),
  message: z.string(),
  code: z.number(),
})

export const roleDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(z.string()),
  company_id: z.string(),
  company_name: z.string(),
  created_at: z.string(),
  modified_at: z.string(),
})

export const roleDetailResponseSchema = z.object({
  data: roleDetailSchema,
  status: z.string(),
  message: z.string(),
  code: z.number(),
})

export const newRoleSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }).min(1, { message: 'El nombre es requerido' }),
  permissions: z.array(z.string()).min(1, { message: 'Debes seleccionar al menos un permiso' }),
  company_id: z.string({ required_error: 'La compañía es requerida' }).min(1, { message: 'La compañía es requerida' }),
})

export const newRoleResponseSchema = z.object({
  data: roleDetailSchema,
  status: z.string(),
  message: z.string(),
  code: z.number(),
})

export const listPermissionsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(), // TODO: add description
})

export const listPermissionsResponseSchema = z.object({
  data: z.array(listPermissionsSchema),
  status: z.string(),
  message: z.string(),
  code: z.number(),
})

export type RoleList = z.infer<typeof roleListSchema>;
export type RoleListResponse = z.infer<typeof roleListResponseSchema>;

export type RoleDetail = z.infer<typeof roleDetailSchema>;
export type RoleDetailResponse = z.infer<typeof roleDetailResponseSchema>;

export type NewRole = z.infer<typeof newRoleSchema>;
export type NewRoleResponse = z.infer<typeof newRoleResponseSchema>;

export type ListPermissions = z.infer<typeof listPermissionsSchema>;
export type ListPermissionsResponse = z.infer<typeof listPermissionsResponseSchema>;