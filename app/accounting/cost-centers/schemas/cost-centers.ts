import { z } from "zod";

export const costCenterSchema = z.object({
  name: z.string(),
  status: z.string(),
  id: z.string(),
})

export const newCostCenterSchema = costCenterSchema.omit({ id: true })

export type CostCenter = z.infer<typeof costCenterSchema>
export type NewCostCenter = z.infer<typeof newCostCenterSchema>