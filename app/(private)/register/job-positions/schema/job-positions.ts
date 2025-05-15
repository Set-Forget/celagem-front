import { z } from 'zod';

export const newJobPositionGeneralSchema = z.object({
  code: z.string(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit: z.enum(['Minutos', 'Eventos']),
  created_by: z.string(),
});

export const newJobPositionSchema = newJobPositionGeneralSchema;

export const jobPositionSchema = z.object({
  id: z.number(),
  code: z.string(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit: z.enum(['Minutos', 'Eventos']),
});

export const jobPositionListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(jobPositionSchema),
});

export const jobPositionResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: jobPositionSchema,
});

export const jobPositionDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const jobPositionCreateBodySchema = z.object({
  code: z.string(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit: z.enum(['Minutos', 'Eventos']),
  created_by: z.string(),
});


export const jobPositionUpdateBodySchema = z.object({
  code: z.string(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit: z.enum(['Minutos', 'Eventos']),
});

export type JobPositions = z.infer<typeof jobPositionSchema>;  
export type JobPositionsListResponse = z.infer<typeof jobPositionListResponseSchema>;
export type JobPositionResponse = z.infer<typeof jobPositionResponseSchema>;  
export type JobPositionDeleteResponse = z.infer<typeof jobPositionDeleteResponseSchema>;
export type JobPositionCreateBody = z.infer<typeof jobPositionCreateBodySchema>;
export type JobPositionUpdateBody = z.infer<typeof jobPositionUpdateBodySchema>;

export type NewJobPosition = z.infer<typeof newJobPositionSchema>;
