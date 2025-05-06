import { z } from 'zod';

export const materialsInventorySchema = z.object({
  id: z.number(),
  code: z.string(),
  cost_unit_price: z.number(),
  lot_number: z.string().optional(),
  qty: z.number(),
});

export type MaterialsInventory = z.infer<typeof materialsInventorySchema>;

// --- 

export const materialListSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  sale_price: z.number(),
  cost: z.number(),
  active: z.boolean(),
  uom: z.string(),
  category: z.string(),
  // ! Falta code.
})

export const materialListResponseSchema = z.object({
  status: z.string(),
  data: z.array(materialListSchema),
})

export type MaterialList = z.infer<typeof materialListSchema>;
export type MaterialListResponse = z.infer<typeof materialListResponseSchema>;