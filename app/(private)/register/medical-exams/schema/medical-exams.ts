import { z } from 'zod';

export const newMedicalExamGeneralSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .nonempty({ message: 'El nombre es requerido' })
    .default(''),
  code: z.string(),
  status: z.enum(['INTERNO', 'EXTERNO']),
  cups_code: z.string().optional(),
  description: z.string().optional(),
  type: z.string(),
  cost: z.number(),
  unit_cost: z.number(),
  created_by: z.string(),
});

export const newMedicalExamSchema = newMedicalExamGeneralSchema;

export const medicalExamSchema = z.object({
  id: z.number(),
  code: z.string(),
  status: z.enum(['INTERNO', 'EXTERNO']),
  cups_code: z.string().optional(),
  description: z.string().optional(),
  type: z.string(),
  cost: z.number(),
  unit_cost: z.number(),
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

export const medicalExamsListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(medicalExamSchema),
});

export const medicalExamResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: medicalExamSchema,
});

export const medicalExamDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const medicalExamCreateBodySchema = z.object({
  code: z.string(),
  status: z.enum(['INTERNO', 'EXTERNO']),
  cups_code: z.string().optional(),
  description: z.string().optional(),
  type: z.string(),
  cost: z.number(),
  unit_cost: z.number(),
  created_by: z.string(),
});

export const medicalExamUpdateBodySchema = z.object({
  code: z.string(),
  status: z.enum(['INTERNO', 'EXTERNO']),
  cups_code: z.string().optional(),
  description: z.string().optional(),
  type: z.string(),
  cost: z.number(),
  unit_cost: z.number(),
});

export type MedicalExams = z.infer<typeof medicalExamSchema>;
export type MedicalExamsListResponse = z.infer<typeof medicalExamsListResponseSchema>;
export type MedicalExamResponse = z.infer<typeof medicalExamResponseSchema>;
export type MedicalExamDeleteResponse = z.infer<typeof medicalExamDeleteResponseSchema>;
export type MedicalExamCreateBody = z.infer<typeof medicalExamCreateBodySchema>;
export type MedicalExamUpdateBody = z.infer<typeof medicalExamUpdateBodySchema>;

export type NewMedicalExam = z.infer<typeof newMedicalExamSchema>;
