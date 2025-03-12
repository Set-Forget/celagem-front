import { z } from "zod";

export const inventoryListSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  list_price: z.number(),
  qty_available: z.number(),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
})

export type InventoryList = z.infer<typeof inventoryListSchema>