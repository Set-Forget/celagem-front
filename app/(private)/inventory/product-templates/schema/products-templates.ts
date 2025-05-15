import { z } from 'zod';

export const productUsageTypeEnum = z.enum([
  'material',
  'service',
  'exam',
  'job',
  'other',
]);
export const trackingEnum = z.enum(['none', 'lot', 'serial']);
export const purchaseLineWarnEnum = z.enum(['no-message', 'block', 'warning']);
export const saleLineWarnEnum = z.enum(['no-message', 'block', 'warning']);
export const exam_condition = z.enum(['interno', 'externo']);

export const newProductTemplateGeneralSchema = z.object({
  name: z.string(),
  type: z.string(),
  category: z.number(),
  unit_of_measure: z.number(),
  purchase_unit: z.number(),
  tracking: z.string(),
  purchase_line_warn: z.string(),
  sale_line_warn: z.string(),
  description: z.string().optional(),
  sale_price: z.number().optional(),
  cost_price: z.number().optional(),
  currency: z.number().optional(),
  purchase_ok: z.boolean().optional(),
  sale_ok: z.boolean().optional(),
  active: z.boolean().optional(),
  exam_condition: z.string().optional(),
  cups_code: z.string().optional(),
  exam_type: z.string().optional(),
  product_usage_type: z.string().optional(),
  brand: z.string().optional(),
  created_by: z.string().optional(),
});

export const newProductTemplateSchema = newProductTemplateGeneralSchema;

export const productTemplatesSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  sale_price: z.number(),
  cost_price: z.number(),
  purchase_ok: z.boolean(),
  sale_ok: z.boolean(),
  active: z.boolean(),
  tracking: z.string(),
  purchase_line_warn: z.string(),
  sale_line_warn: z.string(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }),
  unit_of_measure: z.object({
    id: z.number(),
    name: z.string(),
  }),
  purchase_unit: z.object({
    id: z.number(),
    name: z.string(),
  }),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  variants: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  exam_condition: z.boolean(),
  cups_code: z.boolean(),
  exam_type: z.boolean(),
  product_usage_type: z.string(),
  brand: z.boolean(),
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

export const productTemplateListSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  sale_price: z.number(),
  cost_price: z.number(),
  active: z.boolean(),
  uom: z.string(),
  category: z.string(),
  product_usage_type: z.string(),
});

export const productTemplatesListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(productTemplatesSchema),
});

export const productTemplateResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: productTemplatesSchema,
});

export const productTemplateDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const productTemplateCreateBodySchema = z.object({
  name: z.string(),
  type: z.string(),
  category: z.number(),
  unit_of_measure: z.number(),
  purchase_unit: z.number(),
  tracking: z.string(),
  purchase_line_warn: z.string(),
  sale_line_warn: z.string(),
  description: z.string().optional(),
  sale_price: z.number().optional(),
  cost_price: z.number().optional(),
  currency: z.number().optional(),
  purchase_ok: z.boolean().optional(),
  sale_ok: z.boolean().optional(),
  active: z.boolean().optional(),
  exam_condition: z.string().optional(),
  cups_code: z.string().optional(),
  exam_type: z.string().optional(),
  product_usage_type: z.string().optional(),
  brand: z.string().optional(),
  created_by: z.string().optional(),
});

export const productTemplateUpdateBodySchema = z.object({
  name: z.string(),
  type: z.string(),
  category: z.number(),
  unit_of_measure: z.number(),
  purchase_unit: z.number(),
  tracking: z.string(),
  purchase_line_warn: z.string(),
  sale_line_warn: z.string(),
  description: z.string().optional(),
  sale_price: z.number().optional(),
  cost_price: z.number().optional(),
  currency: z.number().optional(),
  purchase_ok: z.boolean().optional(),
  sale_ok: z.boolean().optional(),
  active: z.boolean().optional(),
  exam_condition: z.string().optional(),
  cups_code: z.string().optional(),
  exam_type: z.string().optional(),
  product_usage_type: z.string().optional(),
  brand: z.string().optional(),
  created_by: z.string().optional(),
});

export type ProductTemplates = z.infer<typeof productTemplatesSchema>;
export type ProductTemplatesListResponse = z.infer<
  typeof productTemplatesListResponseSchema
>;
export type ProductTemplateResponse = z.infer<
  typeof productTemplateResponseSchema
>;
export type ProductTemplateDeleteResponse = z.infer<
  typeof productTemplateDeleteResponseSchema
>;
export type ProductTemplateCreateBody = z.infer<
  typeof productTemplateCreateBodySchema
>;
export type ProductTemplateUpdateBody = z.infer<
  typeof productTemplateUpdateBodySchema
>;

export type NewProductTemplate = z.infer<typeof newProductTemplateSchema>;
