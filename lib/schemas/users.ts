import { z } from "zod";

export const userListSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  is_email_confirmed: z.boolean(),
  created_at: z.string(),
  modified_at: z.string(),
})

export const userListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(userListSchema),
})

export const classListSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  modified_at: z.string(),
})

export const companiesListSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
})

export const companiesListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(companiesListSchema),
})

export const classListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(classListSchema),
})

export type ClassList = z.infer<typeof classListSchema>;
export type ClassListResponse = z.infer<typeof classListResponseSchema>;

export type UserList = z.infer<typeof userListSchema>;
export type UserListResponse = z.infer<typeof userListResponseSchema>;

export type CompaniesList = z.infer<typeof companiesListSchema>;
export type CompaniesListResponse = z.infer<typeof companiesListResponseSchema>;