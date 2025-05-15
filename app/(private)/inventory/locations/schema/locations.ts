import { z } from 'zod';

export const newLocationGeneralSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .nonempty({ message: 'El nombre es requerido' })
    .default(''),
  usage: z.string(),
  parent: z.number(),
  company: z.number(),
  warehouse: z.number(),
  posx: z.number(),
  posy: z.number(),
  posz: z.number(),
  comment: z.string(),
  created_by: z.string(),
});

export const newLocationSchema = newLocationGeneralSchema

export const locationChildrenItemSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const locationProductItemSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const locationsSchema = z.object({
  id: z.number(),
  name: z.string(),
  complete_name: z.string(),
  usage: z.string(),
  active: z.boolean(),
  company: z.number(),
  parent: z.number(),
  warehouse: z.number(),
  posx: z.number(),
  posy: z.number(),
  posz: z.number(),
  comment: z.string(),
  children: z.array(locationChildrenItemSchema),
  has_products: z.boolean(),
  products: z.array(locationProductItemSchema),
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

export const locationsListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(locationsSchema),
});

export const locationResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: locationsSchema,
});

export const locationDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const locationCreateBodySchema = z.object({
  name: z.string(),
  usage: z.string(),
  parent: z.number(),
  company: z.number(),
  warehouse: z.number(),
  posx: z.number(),
  posy: z.number(),
  posz: z.number(),
  comment: z.string(),
  created_by: z.string(),
});

export const locationUpdateBodySchema = z.object({
  name: z.string(),
  usage: z.string(),
  parent: z.number(),
  company: z.number(),
  warehouse: z.number(),
  posx: z.number(),
  posy: z.number(),
  posz: z.number(),
  comment: z.string(),
});

export type Locations = z.infer<typeof locationsSchema>;
export type LocationsListResponse = z.infer<typeof locationsListResponseSchema>;
export type LocationResponse = z.infer<typeof locationResponseSchema>;
export type LocationDeleteResponse = z.infer<
  typeof locationDeleteResponseSchema
>;
export type LocationCreateBody = z.infer<typeof locationCreateBodySchema>;
export type LocationUpdateBody = z.infer<typeof locationUpdateBodySchema>;

export type NewLocation = z.infer<typeof newLocationSchema>;
