import { z } from 'zod';

export const jobPositionConsumedSchema = z.object({
  id: z.number(),
  qty: z.number(),
});

export const servicesConsumedSchema = z.object({
  id: z.number(),
  qty: z.number(),
});

export const medicalExamsConsumedSchema = z.object({
  id: z.number(),
  qty: z.number(),
});

export const materialsConsumedSchema = z.object({
  id: z.number(),
  qty: z.number(),
});

export const procedureReceiptSchema = z.object({
  id: z.number(),
  schema: z.enum(['APORTANTE DE SEMEN', 'GESTANTE', 'OVO-APORTANTE']),
  cups_code: z.string(),
  description: z.string(),
  job_description: z.array(jobPositionConsumedSchema),
  services: z.array(servicesConsumedSchema),
  medical_exams: z.array(medicalExamsConsumedSchema),
  materials: z.array(materialsConsumedSchema),
});

export type MedicalExamsConsumed = z.infer<typeof medicalExamsConsumedSchema>;

export type JobPositionConsumed = z.infer<typeof jobPositionConsumedSchema>;

export type ServicesConsumed = z.infer<typeof servicesConsumedSchema>;

export type ProcedureReceipt = z.infer<typeof procedureReceiptSchema>;
