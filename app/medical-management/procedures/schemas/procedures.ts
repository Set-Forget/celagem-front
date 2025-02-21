import { z } from "zod";

export const procedureReceiptSchema = z.object({
  id: z.number(),
  cups_code: z.string(),
  name: z.string(),
  description: z.string(),
  job_description: z.array(z.string()),
  services: z.array(z.string()),
  medical_exams: z.array(z.string()),
  materials: z.array(z.string()),
});

export type ProcedureReceipt = z.infer<typeof procedureReceiptSchema>;