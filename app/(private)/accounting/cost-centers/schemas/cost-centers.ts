import { z } from "zod";

export const costCentersListSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string().optional(),
  active: z.boolean(),
  company: z.string().optional(),
  plan: z.string(),
  partner: z.string(),
  balance: z.number(),
  currency: z.string().optional(),
})

export const costCenterListResponseSchema = z.object({
  status: z.string(),
  data: z.array(costCentersListSchema),
})

export const costCentersDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string().optional(),
  active: z.boolean(),
  company: z.string().optional(),
  plan: z.object({
    id: z.string(),
    name: z.string(),
  }),
  partner: z.string(),
  balance: z.number(),
  debit: z.number(),
  credit: z.number(),
  currency: z.string().optional(),
  lines: z.array(z.object({}))
})

export const newCostCenterSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  code: z.string().optional(),
  plan_id: z.number({ required_error: "El plan es requerido" }),
})

export const newCostCenterResponseSchema = z.object({
  status: z.string(),
  data: z.object({
    name: z.string(),
    id: z.number(),
  }),
})

export const costCenterDetailResponseSchema = z.object({
  status: z.string(),
  data: costCentersDetailSchema,
})

export type CostCenterList = z.infer<typeof costCentersListSchema>;
export type CostCenterListResponse = z.infer<typeof costCenterListResponseSchema>;

export type CostCenterDetail = z.infer<typeof costCentersDetailSchema>;
export type CostCenterDetailResponse = z.infer<typeof costCenterDetailResponseSchema>;

export type NewCostCenter = z.infer<typeof newCostCenterSchema>;
export type NewCostCenterResponse = z.infer<typeof newCostCenterResponseSchema>;