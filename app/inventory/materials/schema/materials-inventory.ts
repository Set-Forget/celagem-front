import { z } from 'zod';

export const materialsInventorySchema = z.object({
  id: z.number(),
  code: z.string(),
  cost_unit_price: z.number(),
  lot_number: z.string().optional(),
  qty: z.number(),
});

export type MaterialsInventory = z.infer<typeof materialsInventorySchema>;
