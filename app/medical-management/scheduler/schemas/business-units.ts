import { z } from "zod";

export const listBusinessUnit = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  company_id: z.string(),
  created_at: z.string(),
  modified_at: z.string(),
})

export const listBusinessUnitResponse = z.object({
  status: z.string(),
  message: z.string(),
  code: z.number(),
  data: z.array(listBusinessUnit),
})

export type ListBusinessUnit = z.infer<typeof listBusinessUnit>;
export type ListBusinessUnitResponse = z.infer<typeof listBusinessUnitResponse>;