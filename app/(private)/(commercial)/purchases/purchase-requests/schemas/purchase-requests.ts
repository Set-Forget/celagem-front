import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const purchaseRequestState = z.enum(["draft", "approved", "ordered", "cancelled"]);

export const purchaseRequestListSchema = z.object({
  id: z.number(),
  sequence_id: z.string(),
  state: purchaseRequestState,
  request_date: z.string(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string()
});

export const newPurchaseRequestLineSchema = z.object({
  product_id: z.number(),
  quantity: z.number(),
});

export const purchaseRequestLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
});

export const newPurchaseRequestNotesSchema = z.object({
  internal_notes: z.string().optional(),
  tyc_notes: z.string().optional(),
});

export const newPurchaseRequestGeneralSchema = z.object({
  request_date: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha de requerimiento es requerida" }),
  company: z.string({ required_error: "La empresa es requerida" }).nonempty("La empresa es requerida"),
  items: z.array(newPurchaseRequestLineSchema).nonempty("Al menos un item es requerido"),
})

export const newPurchaseRequestSchema = newPurchaseRequestGeneralSchema
  .merge(newPurchaseRequestNotesSchema)

export const purchaseRequestDetailSchema = z.object({
  id: z.number(),
  sequence_id: z.string(),
  request_date: z.string(),
  state: purchaseRequestState,
  internal_notes: z.string(),
  tyc_notes: z.string(),
  purchase_order: z.object({
    id: z.number(),
    sequence_id: z.string(),
  }).nullable(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
  items: z.array(purchaseRequestLineSchema),
})

export const purchaseRequestDetailResponseSchema = z.object({
  status: z.string(),
  data: purchaseRequestDetailSchema,
});

export const newPurchaseRequestResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const purchaseRequestListResponseSchema = z.object({
  status: z.string(),
  data: z.array(purchaseRequestListSchema),
});

export type PurchaseRequestList = z.infer<typeof purchaseRequestListSchema>;
export type PurchaseRequestListResponse = z.infer<typeof purchaseRequestListResponseSchema>;

export type NewPurchaseRequest = z.infer<typeof newPurchaseRequestSchema>;
export type NewPurchaseRequestLine = z.infer<typeof newPurchaseRequestLineSchema>;
export type NewPurchaseRequestResponse = z.infer<typeof newPurchaseRequestResponseSchema>;

export type PurchaseRequestDetail = z.infer<typeof purchaseRequestDetailSchema>;
export type PurchaseRequestItem = z.infer<typeof purchaseRequestLineSchema>;
export type PurchaseRequestDetailResponse = z.infer<typeof purchaseRequestDetailResponseSchema>;

export type PurchaseRequestState = z.infer<typeof purchaseRequestState>;