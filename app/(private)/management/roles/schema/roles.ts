import { z } from 'zod';

export const rolesSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const rolesListSchema = z.object({ // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(rolesSchema),
})

export const roleResponseSchema = z.object({ // Create, Update, Retrieve
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: rolesSchema,
})

export const roleOperationResponseSchema = z.object({ // Delete, Add Permission, Delete Permission
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
})

export const roleCreateBodySchema = z.object({
  name: z.string(),
  company_id: z.string(),
});

export const roleEditBodySchema = z.object({
  name: z.string(),
});

export const roleAddPermissionBodySchema = z.object({
  permission_id: z.string(),
});

export type Roles = z.infer<typeof rolesSchema>;
export type RolesListResponse = z.infer<typeof rolesListSchema>;
export type RoleResponse = z.infer<typeof roleResponseSchema>;
export type RoleOperationResponse = z.infer<typeof roleOperationResponseSchema>;
export type RoleCreateBody = z.infer<typeof roleCreateBodySchema>;
export type RoleEditBody = z.infer<typeof roleEditBodySchema>;
export type RoleAddPermissionBody = z.infer<typeof roleAddPermissionBodySchema>;
