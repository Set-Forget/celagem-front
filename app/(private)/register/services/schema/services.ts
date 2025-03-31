import { z } from 'zod';

export const newServiceGeneralSchema = z.object({
  code: z.string({ required_error: 'El código es requerido' }).nonempty({
    message: 'El código no puede estar vacío',
  }).default(''),
  total_cost: z.number(),
  unit_cost: z.number({ required_error: 'El costo unitario es requerido' }).min(1, {
    message: 'El costo unitario debe ser mayor a 0',
  }),
  unit: z.enum(['Minutos']),
  created_by: z.string(),
});

export const newServiceSchema = newServiceGeneralSchema;

export const servicesSchema = z.object({
  id: z.string(),
  code: z.string(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit: z.enum(['Minutos']),
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

export const servicesListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(servicesSchema),
});

export const serviceResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: servicesSchema,
});

export const serviceDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const serviceCreateBodySchema = z.object({
  code: z.string(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit: z.enum(['Minutos']),
  created_by: z.string(),
});

export const serviceUpdateBodySchema = z.object({
  code: z.string(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit: z.enum(['Minutos']),
});

export type Services = z.infer<typeof servicesSchema>;
export type ServicesListResponse = z.infer<typeof servicesListResponseSchema>;
export type ServiceResponse = z.infer<typeof serviceResponseSchema>;
export type ServiceDeleteResponse = z.infer<typeof serviceDeleteResponseSchema>;
export type ServiceCreateBody = z.infer<typeof serviceCreateBodySchema>;
export type ServiceUpdateBody = z.infer<typeof serviceUpdateBodySchema>;

export type NewService = z.infer<typeof newServiceSchema>;