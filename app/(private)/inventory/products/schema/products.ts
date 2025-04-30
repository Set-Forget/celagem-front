import { z } from 'zod';

export const newProductGeneralSchema = z.object({
  template_id: z.number(),
  attributes: z.array(
    z.object({
      attribute_id: z.number(),
      value_ids: z.array(z.number()),
    })
  ),
});

export const newProductSchema = newProductGeneralSchema;

export const productAttributeValueItem = z.object({
  attribute_id: z.number(),
  attribute: z.string(),
  value_id: z.number(),
  value: z.string(),
});

export const productsSchema = z.object({
  id: z.number(),
  name: z.string(),
  default_code: z.string(),
  barcode: z.boolean(),
  standard_price: z.number(),
  template: z.object({
    id: z.number(),
    name: z.string(),
  }),
  location: z.object({
    id: z.number(),
    name: z.string(),
  }),
  cost_unit: z.object({
    id: z.number(),
    name: z.string(),
  }),
  purchase_unit: z.object({
    id: z.number(),
    name: z.string(),
  }),
  brand: z.string(),
  exam_type: z.string(),
  exam_condition: z.string(),
  cups_code: z.string(),
  product_usage_type: z.string(),
  convertion_rate_purchase_to_cost_unit: z.number(),
  purchase_unit_price: z.number(),
  cost_unit_price: z.number(),
  fraction: z.string(),
  attribute_values: z.array(productAttributeValueItem),
  active: z.boolean(),
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

export const productTemplateSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const productListSchema = z.object({
  id: z.number(),
  name: z.string(),
  default_code: z.string(),
  barcode: z.boolean(),
  template: productTemplateSchema,
  standard_price: z.number(),
  uom: z.string(),
  active: z.boolean(),
});

export const productsListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(productListSchema),
});

export const productResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: productsSchema,
});

export const productDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const productCreateBodySchema = z.object({
  template_id: z.number(),
  attributes: z.array(
    z.object({
      attribute_id: z.number(),
      value_ids: z.array(z.number()),
    })
  ),
});

export const productUpdateBodySchema = z.object({
  template_id: z.number(),
  attributes: z.array(
    z.object({
      attribute_id: z.number(),
      value_ids: z.array(z.number()),
    })
  ),
});

export type Products = z.infer<typeof productsSchema>;
export type ProductTemplate = z.infer<typeof productTemplateSchema>;
export type ProductList = z.infer<typeof productListSchema>;

export type ProductsListResponse = z.infer<typeof productsListResponseSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ProductDeleteResponse = z.infer<typeof productDeleteResponseSchema>;
export type ProductCreateBody = z.infer<typeof productCreateBodySchema>;
export type ProductUpdateBody = z.infer<typeof productUpdateBodySchema>;

export type NewProduct = z.infer<typeof newProductSchema>;
