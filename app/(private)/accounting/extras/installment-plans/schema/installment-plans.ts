import { z } from 'zod';


export const newTaxGeneralSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .nonempty({ message: 'El nombre es requerido' })
    .default(''),
  created_by: z.string(),
});

export const newTaxSchema = newTaxGeneralSchema;

export const taxesSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
  tax_group: taxesTypesSchema,
  active: z.boolean(),
  created_at: z.string().optional(),
  created_by: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
    })
    .optional(),
  modified_at: z.string().optional(),
  updated_by: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
    })
    .optional(),
});

export const taxesListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(taxesSchema),
});

export const taxResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: taxesSchema,
});

export const taxDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const taxCreateBodySchema = z.object({
  name: z.string(),
  created_by: z.string(),
});

export const taxUpdateBodySchema = z.object({
  name: z.string(),
});

export type Taxes = z.infer<typeof taxesSchema>;
export type TaxesListResponse = z.infer<typeof taxesListResponseSchema>;
export type TaxResponse = z.infer<typeof taxResponseSchema>;
export type TaxDeleteResponse = z.infer<typeof taxDeleteResponseSchema>;
export type TaxCreateBody = z.infer<typeof taxCreateBodySchema>;
export type TaxUpdateBody = z.infer<typeof taxUpdateBodySchema>;

export type NewTax = z.infer<typeof newTaxSchema>;
