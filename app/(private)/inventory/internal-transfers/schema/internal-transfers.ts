import { z } from 'zod';

export const internalTransferItemCreateBodySchema = z.object({
  product_id: z.number(),
  name: z.string(),
  product_uom: z.number(),
  quantity: z.number(),
  source_location: z.number(),
  destination_location: z.number(),
});

export const newInternalTransferGeneralSchema = z.object({
  internal_date: z.string(),
  scheduled_date: z.string(),
  move_type: z.string(),
  notes: z.string(),
  source_location: z.number(),
  destination_location: z.number(),
  items: z.array(internalTransferItemCreateBodySchema),
  created_by: z.string(),
});


export const newInternalTransferSchema = newInternalTransferGeneralSchema

export const internalTransferItem = z.object({
  product_id: z.number(),
  display_name: z.string(),
  product_uom_qty: z.number(),
  quantity: z.number(),
  product_uom: z.object({
    id: z.number(),
    name: z.string(),
  }),
  source_location: z.object({
    id: z.number(),
    name: z.string(),
  }),
  destination_location: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

  
export const internalTransfersSchema = z.object({
  id: z.number(),
  number: z.string(),
  internal_date: z.string(),
  scheduled_date: z.string(),
  note: z.string(),
  source_location: z.object({
    id: z.number(),
    name: z.string(),
  }),
  destination_location: z.object({
    id: z.number(),
    name: z.string(),
  }),
  items: z.array(internalTransferItem),
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

export const internalTransfersListSchema = z.object({
  id: z.number(),
  number: z.string(),
  scheduled_date: z.string(),
  reception_date: z.string(),
  reception_location: z.string(),
  source_location: z.string(),
  destination_location: z.string(),
});

export const internalTransfersListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(internalTransfersSchema),
});

export const internalTransferResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: internalTransfersSchema,
});

export const internalTransferDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});



export const internalTransferCreateBodySchema = z.object({
  internal_date: z.string(),
  scheduled_date: z.string(),
  move_type: z.string(),
  notes: z.string(),
  source_location: z.number(),
  destination_location: z.number(),
  items: z.array(internalTransferItemCreateBodySchema),
  created_by: z.string(),
});

export const internalTransferUpdateBodySchema = z.object({
  internal_date: z.string(),
  scheduled_date: z.string(),
  move_type: z.string(),
  notes: z.string(),
  source_location: z.number(),
  destination_location: z.number(),
  items: z.array(internalTransferItemCreateBodySchema),
  created_by: z.string(),
});

export type InternalTransfers = z.infer<typeof internalTransfersSchema>;
export type InternalTransfersListResponse = z.infer<typeof internalTransfersListResponseSchema>;
export type InternalTransferResponse = z.infer<typeof internalTransferResponseSchema>;
export type InternalTransferDeleteResponse = z.infer<
  typeof internalTransferDeleteResponseSchema
>;
export type InternalTransferCreateBody = z.infer<typeof internalTransferCreateBodySchema>;
export type InternalTransferUpdateBody = z.infer<typeof internalTransferUpdateBodySchema>;

export type InternalTransferItem = z.infer<typeof internalTransferItem>;

export type NewInternalTransfer = z.infer<typeof newInternalTransferSchema>;
