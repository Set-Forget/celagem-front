import { z } from "zod";

export const taxesListSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number(),
  tax_group: z.string(),
  active: z.boolean(),
  tax_kind: z.enum(['tax', 'withholding']),
  is_fuente: z.boolean(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
})

export const taxesListResponseSchema = z.object({
  status: z.string(),
  data: z.array(taxesListSchema),
})

export const taxDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number(),
  tax_kind: z.enum(['tax', 'withholding']),
  is_fuente: z.boolean(),
  type_tax_use: z.enum(['sale', 'purchase', 'both']),
  active: z.boolean(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
})

export const taxDetailResponseSchema = z.object({
  status: z.string(),
  data: taxDetailSchema,
})

export const newTaxSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  amount: z.number({ required_error: "El monto es requerido" }).min(0, { message: "El monto debe ser mayor a 0" }),
  type_tax_use: z.enum(['sale', 'purchase', 'both'], { required_error: "El tipo de uso del impuesto es requerido" }),
  tax_kind: z.enum(['tax', 'withholding'], { required_error: "El tipo de impuesto es requerido" }),
  company: z.number({ required_error: "La compañía es requerida" }).optional(),
  sequence: z.number().optional(),
  tax_group: z.number().optional(),
  amount_type: z.enum(['percent']).optional(),
})

export const newTaxResponseSchema = z.object({
  status: z.string(),
  data: taxDetailSchema
})

export type TaxesList = z.infer<typeof taxesListSchema>
export type TaxesListResponse = z.infer<typeof taxesListResponseSchema>

export type TaxDetail = z.infer<typeof taxDetailSchema>
export type TaxDetailResponse = z.infer<typeof taxDetailResponseSchema>

export type NewTax = z.infer<typeof newTaxSchema>
export type NewTaxResponse = z.infer<typeof newTaxResponseSchema>