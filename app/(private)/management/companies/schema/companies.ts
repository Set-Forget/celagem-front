import { z } from 'zod';

export const listCompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
})

export const listCompanyResponseSchema = z.object({
  data: z.array(listCompanySchema),
  message: z.string(),
  status: z.string(),
  code: z.number(),
})

export const companyDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string(),
  modified_at: z.string(),
})

export const companyDetailResponseSchema = z.object({
  data: companyDetailSchema,
  message: z.string(),
  status: z.string(),
  code: z.number(),
})

export const newCompanySchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  description: z.string().optional(),
})

export const newCompanyResponseSchema = z.object({
  data: companyDetailSchema,
  message: z.string(),
  status: z.string(),
  code: z.number(),
})

export type CompanyList = z.infer<typeof listCompanySchema>
export type CompanyListResponse = z.infer<typeof listCompanyResponseSchema>

export type CompanyDetail = z.infer<typeof companyDetailSchema>
export type CompanyDetailResponse = z.infer<typeof companyDetailResponseSchema>

export type NewCompany = z.infer<typeof newCompanySchema>
export type NewCompanyResponse = z.infer<typeof newCompanyResponseSchema>