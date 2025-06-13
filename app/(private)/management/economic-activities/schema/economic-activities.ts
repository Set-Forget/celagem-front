import { z } from "zod";

export const economicActivityListSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
})

export const economicActivityDetailSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
})

export const newEconomicActivitySchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  code: z.string({ required_error: "El código es requerido" }).min(1, { message: "El código es requerido" }),
})

export const newEconomicActivityResponseSchema = z.object({
  status: z.string(),
  data: economicActivityDetailSchema,
})

export const economicActivityDetailResponseSchema = z.object({
  status: z.string(),
  data: economicActivityDetailSchema,
})

export const economicActivityListResponseSchema = z.object({
  status: z.string(),
  data: z.array(economicActivityListSchema),
})

export type EconomicActivityList = z.infer<typeof economicActivityListSchema>;
export type EconomicActivityListResponse = z.infer<typeof economicActivityListResponseSchema>;

export type EconomicActivityDetail = z.infer<typeof economicActivityDetailSchema>;
export type EconomicActivityDetailResponse = z.infer<typeof economicActivityDetailResponseSchema>;

export type NewEconomicActivity = z.infer<typeof newEconomicActivitySchema>;
export type NewEconomicActivityResponse = z.infer<typeof newEconomicActivityResponseSchema>;