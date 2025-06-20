import { z } from 'zod';

export const classListSchema = z.object({
  id: z.string(),
  name: z.string(),
  company_id: z.string(),
  company_name: z.string(),
})

export const classListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(classListSchema),
})

export const classDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  company_id: z.string(),
  company_name: z.string(),
  created_at: z.string(),
  modified_at: z.string(),
})

export const classDetailResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: classDetailSchema,
})

export const newClassSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  company_id: z.string({ required_error: "La empresa es requerida" }),
})

export const newClassResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: classDetailSchema,
})

export type ClassList = z.infer<typeof classListSchema>;
export type ClassListResponse = z.infer<typeof classListResponseSchema>;

export type ClassDetail = z.infer<typeof classDetailSchema>;
export type ClassDetailResponse = z.infer<typeof classDetailResponseSchema>;

export type NewClass = z.infer<typeof newClassSchema>;
export type NewClassResponse = z.infer<typeof newClassResponseSchema>;