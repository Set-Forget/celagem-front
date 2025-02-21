import { z } from 'zod';

export const medicalExamSchema = z.object({
  id: z.number(),
  code: z.string(),
  status: z.enum(['INTERNO', 'EXTERNO']),
  cup_code: z.string().optional(),
  description: z.string().optional(),
  type: z.string(),
  cost: z.number(),
  unit_cost: z.number()
});
export type MedicalExam = z.infer<typeof medicalExamSchema>;
