import { z } from 'zod';

export const servicesSchema = z.object({
  id: z.number(),
  code: z.string(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit: z.enum(['Minutos'])
});

export type Services = z.infer<typeof servicesSchema>;
