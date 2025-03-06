import { z } from 'zod';

export const jobPositionConsumedSchema = z.object({
  id: z.number(),
  qty: z.number(),
});

export const serviceConsumedSchema = z.object({
  id: z.number(),
  qty: z.number(),
});

export const medicalExamConsumedSchema = z.object({
  id: z.number(),
  qty: z.number(),
});

export const materialConsumedSchema = z.object({
  id: z.number(),
  qty: z.number(),
});

export const procedureSchema = z.enum([
  'APORTANTE DE SEMEN',
  'GESTANTE',
  'OVO-APORTANTE',
]);

export const procedureReceiptSchema = z.object({
  id: z.number(),
  schema: procedureSchema,
  cups_code: z.string(),
  description: z.string(),
  job_description: z.array(jobPositionConsumedSchema),
  services: z.array(serviceConsumedSchema),
  medical_exams: z.array(medicalExamConsumedSchema),
  materials: z.array(materialConsumedSchema),
});

export type MedicalExamsConsumed = z.infer<typeof medicalExamConsumedSchema>;

export type JobPositionConsumed = z.infer<typeof jobPositionConsumedSchema>;

export type ServicesConsumed = z.infer<typeof serviceConsumedSchema>;

export type ProcedureReceipt = z.infer<typeof procedureReceiptSchema>;

export type ProcedureSchema = z.infer<typeof procedureSchema>;
