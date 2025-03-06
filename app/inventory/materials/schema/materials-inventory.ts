import { z } from 'zod';

export const materialsInventoryEntrySchema = z.object({
  id: z.number(),
  location: z.enum(['Sede Asistencial Bogotá']),
  code: z.string(),
  brand: z.string().optional(),
  name: z.string(),
  fraction: z.string(),
  detail: z.string().optional(),
  lot_number: z.string().optional(),
  qty: z.number().optional(),
});

export type MaterialsInventoryEntry = z.infer<typeof materialsInventoryEntrySchema>;
