import { z } from "zod";

export const taxesListSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number(),
  tax_group: z.string(),
  active: z.boolean(),
  tax_kind: z.enum(['tax', 'withholding']),
})

export const taxesListResponseSchema = z.object({
  status: z.string(),
  data: z.array(taxesListSchema),
})

export type TaxesList = z.infer<typeof taxesListSchema>
export type TaxesListResponse = z.infer<typeof taxesListResponseSchema>