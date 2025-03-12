import { z } from 'zod';

export const materialsSchema = z.object({
  id: z.number(),
  location: z.enum(['Sede Asistencial Bogotá']),
  code: z.string(),
  name: z.string(),
  fraction: z.string(),
  average_price: z.number(),
  qty: z.number().optional(),
  brand: z.string().optional(),
  purchase_unit: z.string().optional(),
  purchase_unit_price: z.number().optional(),
  convertion_rate_purchase_to_cost_unit: z.number().optional(),
  cost_unit: z.string(),
  cost_unit_price: z.number().optional(),
});

export type Materials = z.infer<typeof materialsSchema>;
