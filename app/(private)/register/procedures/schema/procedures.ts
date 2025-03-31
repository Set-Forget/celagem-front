import { z } from 'zod';

export const jobPositionConsumedSchema = z.object({
  id: z.string(),
  qty: z.number(),
});

export const serviceConsumedSchema = z.object({
  id: z.string(),
  qty: z.number(),
});

export const medicalExamConsumedSchema = z.object({
  id: z.string(),
  qty: z.number(),
});

export const materialConsumedSchema = z.object({
  id: z.string(),
  qty: z.number(),
});

export const procedureSchema = z.enum([
  'APORTANTE DE SEMEN',
  'GESTANTE',
  'OVO-APORTANTE',
]);

export const newProcedureGeneralSchema = z.object({
  schema: procedureSchema,
  cups_code: z.string().optional(),
  description: z.string().optional(),
  created_by: z.string(),
});

export const newProcedureJobPositionsSchema = z.object({
  job_positions: z.array(jobPositionConsumedSchema),
});

export const newProcedureServicesSchema = z.object({
  services: z.array(serviceConsumedSchema),
});

export const newProcedureMedicalExamsSchema = z.object({
  medical_exams: z.array(medicalExamConsumedSchema),
});

export const newProcedureMaterialsSchema = z.object({
  materials: z.array(materialConsumedSchema),
});

export const newProcedureSchema = newProcedureGeneralSchema
  .merge(newProcedureJobPositionsSchema)
  .merge(newProcedureServicesSchema)
  .merge(newProcedureMedicalExamsSchema)
  .merge(newProcedureMaterialsSchema);

export const proceduresSchema = z.object({
  id: z.string(),
  schema: procedureSchema,
  cups_code: z.string(),
  description: z.string(),
  job_positions: z.array(jobPositionConsumedSchema),
  services: z.array(serviceConsumedSchema),
  medical_exams: z.array(medicalExamConsumedSchema),
  materials: z.array(materialConsumedSchema),
  created_at: z.string(),
  created_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  modified_at: z.string(),
  updated_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
});

export const proceduresListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(proceduresSchema),
});

export const procedureResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: proceduresSchema,
});

export const procedureDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const procedureCreateBodySchema = z.object({
  schema: procedureSchema,
  cups_code: z.string().optional(),
  description: z.string().optional(),
  job_positions: z.array(jobPositionConsumedSchema),
  services: z.array(serviceConsumedSchema),
  medical_exams: z.array(medicalExamConsumedSchema),
  materials: z.array(materialConsumedSchema),
  created_by: z.string(),
});

export const procedureUpdateBodySchema = z.object({
  schema: procedureSchema,
  cups_code: z.string().optional(),
  description: z.string().optional(),
  job_positions: z.array(jobPositionConsumedSchema),
  services: z.array(serviceConsumedSchema),
  medical_exams: z.array(medicalExamConsumedSchema),
  materials: z.array(materialConsumedSchema),
});

export type Procedures = z.infer<typeof proceduresSchema>;
export type ProceduresListResponse = z.infer<typeof proceduresListResponseSchema>;
export type ProcedureResponse = z.infer<typeof procedureResponseSchema>;
export type ProcedureDeleteResponse = z.infer<typeof procedureDeleteResponseSchema>;  
export type ProcedureCreateBody = z.infer<typeof procedureCreateBodySchema>;
export type ProcedureUpdateBody = z.infer<typeof procedureUpdateBodySchema>;

export type NewProcedure = z.infer<typeof newProcedureSchema>;
