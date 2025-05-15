import { z } from 'zod';

export const materialsInventorySchema = z.object({
  id: z.number(),
  code: z.string(),
  cost_unit_price: z.number(),
  lot_number: z.string().optional(),
  qty: z.number(),
});

export type MaterialsInventory = z.infer<typeof materialsInventorySchema>;

// --- 

export const materialListSchema = z.object({
  id: z.number(),
  name: z.string(),
  default_code: z.string(),
  barcode: z.string(),
  template: z.object({
    id: z.number(),
    name: z.string(),
  }),
  standard_price: z.number(),
  uom: z.string(),
  active: z.boolean(),
})

export const materialDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  default_code: z.string(),
  barcode: z.string(),
  standard_price: z.number(),
  template: z.object({
    id: z.number(),
    name: z.string(),
  }),
  location: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  cost_unit: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  purchase_unit: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  brand: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  exam_type: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  exam_condition: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  cups_code: z.string(),
  product_usage_type: z.string(),
  convertion_rate_purchase_to_cost_unit: z.number(),
  purchase_unit_price: z.number(),
  cost_unit_price: z.number(),
  fraction: z.string(),
  attribute_values: z.array(z.object({
    attribute_id: z.number(),
    attribute: z.string(),
    value_id: z.number(),
    value: z.string(),
  })),
  active: z.boolean(),
})

export const materialDetailResponseSchema = z.object({
  status: z.string(),
  data: materialDetailSchema,
})

export const materialListResponseSchema = z.object({
  status: z.string(),
  data: z.array(materialListSchema),
})

export type MaterialList = z.infer<typeof materialListSchema>;
export type MaterialListResponse = z.infer<typeof materialListResponseSchema>;

export type MaterialDetail = z.infer<typeof materialDetailSchema>;
export type MaterialDetailResponse = z.infer<typeof materialDetailResponseSchema>;