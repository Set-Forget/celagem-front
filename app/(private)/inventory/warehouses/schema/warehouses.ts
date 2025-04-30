import { z } from 'zod';

export const receptionStepsEnum = z.enum([
  'one_step',
  'two_steps',
  'three_steps',
]);
export const deliveryStepsEnum = z.enum([
  'ship_only',
  'pick_ship',
  'pick_pack_ship',
]);
export const manufactureStepsEnum = z.enum(['mrp_one_step', 'pbm', 'pbm_sam']);

export const newWarehouseGeneralSchema = z.object({
  name: z.string(),
  code: z.string(),
  company: z.number(),
  reception_steps: receptionStepsEnum,
  delivery_steps: deliveryStepsEnum,
  manufacture_steps: manufactureStepsEnum,
  view_location: z.number().optional(),
  lot_stock_location: z.number().optional(),
});

export const newWarehouseSchema = newWarehouseGeneralSchema;

export const warehouseSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  active: z.boolean(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  view_location: z.object({
    id: z.number(),
    name: z.string(),
  }),
  lot_stock_location: z.object({
    id: z.number(),
    name: z.string(),
  }),
  reception_steps: receptionStepsEnum,
  delivery_steps: deliveryStepsEnum,
  manufacture_steps: manufactureStepsEnum,
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

export const warehousesListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(warehouseSchema),
});

export const warehouseResponseSchema = z.object({
  // Create, Update
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: warehouseSchema,
});

export const warehouseGetResponseSchema = z.object({
  // Get by id
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    active: z.boolean(),
    company: z.object({
      id: z.number(),
      name: z.string(),
    }),
    view_location: z.object({
      id: z.number(),
      name: z.string(),
    }),
    lot_stock_location: z.object({
      id: z.number(),
      name: z.string(),
    }),
    reception_steps: receptionStepsEnum,
    delivery_steps: deliveryStepsEnum,
    manufacture_steps: manufactureStepsEnum,
  }),
  details: z.string(),
});

export const warehouseOperationResponseSchema = z.object({
  // Delete, Add User, Delete User, Add Patient, Delete Patient
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const warehouseDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const warehouseCreateBodySchema = z.object({
  name: z.string(),
  code: z.string(),
  company: z.number(),
  reception_steps: receptionStepsEnum,
  delivery_steps: deliveryStepsEnum,
  manufacture_steps: manufactureStepsEnum,
  view_location: z.number().optional(),
  lot_stock_location: z.number().optional(),
});

export const warehouseUpdateBodySchema = z.object({
  name: z.string(),
  code: z.string(),
  company: z.number(),
  reception_steps: receptionStepsEnum,
  delivery_steps: deliveryStepsEnum,
  manufacture_steps: manufactureStepsEnum,
  view_location: z.number().optional(),
  lot_stock_location: z.number().optional(),
});

export type Warehouses = z.infer<typeof warehouseSchema>;

export type WarehousesListResponse = z.infer<
  typeof warehousesListResponseSchema
>;
export type WarehouseResponse = z.infer<typeof warehouseResponseSchema>;
export type WarehouseGetResponse = z.infer<typeof warehouseGetResponseSchema>;
export type WarehouseOperationResponse = z.infer<
  typeof warehouseOperationResponseSchema
>;
export type WarehouseDeleteResponse = z.infer<
  typeof warehouseDeleteResponseSchema
>;
export type WarehouseCreateBody = z.infer<typeof warehouseCreateBodySchema>;
export type WarehouseUpdateBody = z.infer<typeof warehouseUpdateBodySchema>;

export type ReceptionSteps = z.infer<typeof receptionStepsEnum>;
export type DeliverySteps = z.infer<typeof deliveryStepsEnum>;
export type ManufactureSteps = z.infer<typeof manufactureStepsEnum>;