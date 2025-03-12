import { z } from 'zod';

export const materialsInventoryEntrySchema = z.object({
  id: z.number(),
  location: z.enum(['Sede Asistencial Bogotá']),
  code: z.string(),
  brand: z.string().optional(),
  name: z.string(),
  purchase_unit: z.string().optional(),
  purchase_unit_price: z.number().optional(),
  convertion_rate_purchase_to_cost_unit: z.number().optional(),
  cost_unit: z.string(),
  cost_unit_price: z.number(),
  fraction: z.string(),
  detail: z.string().optional(),
  lot_number: z.string().optional(),
  qty: z.number(),
});

export type MaterialsInventoryEntry = z.infer<typeof materialsInventoryEntrySchema>;
