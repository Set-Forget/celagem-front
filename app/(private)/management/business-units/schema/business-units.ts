import { z } from "zod";

export const businessUnitListSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  company_id: z.string(),
  company_name: z.string(),
  created_at: z.string(),
  modified_at: z.string(),
})

export const businessUnitDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  company_id: z.string(),
  company_name: z.string(),
  users: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
  patients: z.array(z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  })),
  created_at: z.string(),
  modified_at: z.string(),
})

export const newBusinessUnitSchema = z.object({
  name: z.string(),
  description: z.string(),
  company_id: z.string(),
})

export const newBusinessUnitResponse = z.object({
  status: z.string(),
  message: z.string(),
  code: z.number(),
  data: businessUnitDetailSchema,
})

export const businessUnitDetailResponse = z.object({
  status: z.string(),
  message: z.string(),
  code: z.number(),
  data: businessUnitDetailSchema,
})

export const businessUnitListResponse = z.object({
  status: z.string(),
  message: z.string(),
  code: z.number(),
  data: z.array(businessUnitListSchema),
})

export type BusinessUnitList = z.infer<typeof businessUnitListSchema>;
export type BusinessUnitListResponse = z.infer<typeof businessUnitListResponse>;

export type BusinessUnitDetail = z.infer<typeof businessUnitDetailSchema>;
export type BusinessUnitDetailResponse = z.infer<typeof businessUnitDetailResponse>;

export type NewBusinessUnit = z.infer<typeof newBusinessUnitSchema>;
export type NewBusinessUnitResponse = z.infer<typeof newBusinessUnitResponse>;