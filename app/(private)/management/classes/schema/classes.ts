import { z } from 'zod';

export const newClassGeneralSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .nonempty({ message: 'El nombre es requerido' })
    .default(''),
  created_by: z.string(),
});

export const newClassSchema = newClassGeneralSchema;

export const classesSchema = z.object({
  id: z.string(),
  name: z.string(),
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

export const classesListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(classesSchema),
});

export const classResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: classesSchema,
});

export const classDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const classCreateBodySchema = z.object({
  name: z.string(),
  created_by: z.string(),
});

export const classUpdateBodySchema = z.object({
  name: z.string(),
});

export type Classes = z.infer<typeof classesSchema>;
export type ClassesListResponse = z.infer<typeof classesListResponseSchema>;
export type ClassResponse = z.infer<typeof classResponseSchema>;
export type ClassDeleteResponse = z.infer<typeof classDeleteResponseSchema>;
export type ClassCreateBody = z.infer<typeof classCreateBodySchema>;
export type ClassUpdateBody = z.infer<typeof classUpdateBodySchema>;

export type NewClass = z.infer<typeof newClassSchema>;
