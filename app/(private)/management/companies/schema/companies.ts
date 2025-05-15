import { z } from 'zod';

export const newCompanyGeneralSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).nonempty({ message: "El nombre es requerido" }).default(""),
  description: z.string({ required_error: "La descripción es requerida" }).nonempty({ message: "La descripción es requerida" }).default(""),
  // created_by: z.string(),
});

export const newCompanySchema = newCompanyGeneralSchema;

export const newCompanyUserSchema = z.object({
  user_id: z
    .string({ required_error: 'El usuario es requerido' })
    .min(1, { message: 'El usuario es requerido' }),
});

export const companyUserSchema = z.object({
  id: z.string(),
  email: z.string(),
});

export const companiesSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  users: z.array(companyUserSchema),
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

export const companiesListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(companiesSchema),
});

export const companyResponseSchema = z.object({
  // Create, Update, Retrieve
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: companiesSchema,
});

export const companyDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const companiesUsersOperationResponseSchema = z.object({
  // Add, Remove User from Company
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const companyCreateBodySchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const companyUpdateBodySchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const companyAddUserBodySchema = z.object({
  user_id: z.string(),
});

export type Companies = z.infer<typeof companiesSchema>;
export type CompaniesListResponse = z.infer<typeof companiesListResponseSchema>;
export type CompanyResponse = z.infer<typeof companyResponseSchema>;
export type CompanyOperationResponse = z.infer<
  typeof companyDeleteResponseSchema
>;
export type CompanyAddUserBody = z.infer<typeof companyAddUserBodySchema>;
export type CompanyCreateBody = z.infer<typeof companyCreateBodySchema>;
export type CompanyUpdateBody = z.infer<typeof companyUpdateBodySchema>;
export type CompanyAddUser = z.infer<typeof companyAddUserBodySchema>;

export type NewCompany = z.infer<typeof newCompanySchema>;
