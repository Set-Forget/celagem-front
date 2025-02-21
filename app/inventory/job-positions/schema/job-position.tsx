import { z } from 'zod';

export const jobPositionSchema = z.object({
  id: z.number(),
  code: z.string(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit: z.enum(['Minutos', 'Eventos'])
});
export type JobPosition = z.infer<typeof jobPositionSchema>;
