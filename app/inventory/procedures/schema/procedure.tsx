import { z } from "zod";
import { inventoryListSchema } from "../../schema/inventory";

export const materialsSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  qty_required: z.number(),
})

export type Materials = z.infer<typeof materialsSchema>

export const procedureSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  active: z.boolean(),
  type: z.enum(['simple', 'compound']),
  category: z.string(),
  materials: z.array(materialsSchema),
});
export type Procedure = z.infer<typeof procedureSchema>

