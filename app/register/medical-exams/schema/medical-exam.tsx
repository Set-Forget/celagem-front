import { z } from 'zod';

export const medicalExamSchema = z.object({
  id: z.number(),
  code: z.string(),
  status: z.enum(['INTERNO', 'EXTERNO']),
  cups_code: z.string().optional(),
  description: z.string().optional(),
  type: z.string(),
  cost: z.number(),
  unit_cost: z.number(),
  qty: z.number().optional(),
});
export type MedicalExam = z.infer<typeof medicalExamSchema>;
