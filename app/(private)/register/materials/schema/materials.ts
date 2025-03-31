import { z } from 'zod';

export const newMaterialGeneralSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .nonempty({ message: 'El nombre es requerido' })
    .default(''),
  location: z.enum(['Sede Asistencial Bogotá']),
  code: z.string(),
  fraction: z.string(),
  average_price: z.number(),
  brand: z.string().optional(),
  created_by: z.string(),
});

export const newMaterialCostSchema = z.object({
  cost_unit: z.string(),
  cost_unit_price: z.number().optional(),
});

export const newMaterialPurchaseSchema = z.object({
  purchase_unit: z.string().optional(),
  purchase_unit_price: z.number().optional(),
  convertion_rate_purchase_to_cost_unit: z.number().optional(),
});

export const newMaterialSchema = newMaterialGeneralSchema
  .merge(newMaterialCostSchema)
  .merge(newMaterialPurchaseSchema);

export const materialsSchema = z.object({
  id: z.string(),
  location: z.enum(['Sede Asistencial Bogotá']),
  code: z.string(),
  name: z.string(),
  fraction: z.string(),
  average_price: z.number(),
  brand: z.string().optional(),
  purchase_unit: z.string().optional(),
  purchase_unit_price: z.number().optional(),
  convertion_rate_purchase_to_cost_unit: z.number().optional(),
  cost_unit: z.string(),
  cost_unit_price: z.number().optional(),
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

export const materialsListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(materialsSchema),
});

export const materialResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: materialsSchema,
});

export const materialDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const materialCreateBodySchema = z.object({
  location: z.enum(['Sede Asistencial Bogotá']),
  code: z.string(),
  fraction: z.string(),
  average_price: z.number(),
  brand: z.string().optional(),
  purchase_unit: z.string().optional(),
  purchase_unit_price: z.number().optional(),
  convertion_rate_purchase_to_cost_unit: z.number().optional(),
  cost_unit: z.string(),
  cost_unit_price: z.number().optional(),
  created_by: z.string(),
});

export const materialUpdateBodySchema = z.object({
  location: z.enum(['Sede Asistencial Bogotá']),
  code: z.string(),
  fraction: z.string(),
  average_price: z.number(),
  brand: z.string().optional(),
  purchase_unit: z.string().optional(),
  purchase_unit_price: z.number().optional(),
  convertion_rate_purchase_to_cost_unit: z.number().optional(),
  cost_unit: z.string(),
  cost_unit_price: z.number().optional(),
});

export type Materials = z.infer<typeof materialsSchema>;
export type MaterialsListResponse = z.infer<typeof materialsListResponseSchema>;
export type MaterialResponse = z.infer<typeof materialResponseSchema>;
export type MaterialDeleteResponse = z.infer<
  typeof materialDeleteResponseSchema
>;
export type MaterialCreateBody = z.infer<typeof materialCreateBodySchema>;
export type MaterialUpdateBody = z.infer<typeof materialUpdateBodySchema>;

export type NewMaterial = z.infer<typeof newMaterialSchema>;
