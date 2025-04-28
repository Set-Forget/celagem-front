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

// ! Esto hay que cambiarlo por el original.
export const materialDetailSchema = z.object({
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
  variants: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })),
  exam_condition: z.boolean(),
  cups_code: z.boolean(),
  exam_type: z.boolean(),
  product_usage_type: z.string(),
  brand: z.boolean(),
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