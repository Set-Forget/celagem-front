import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const purchaseOrderState = z.enum(["draft", "to approve", "purchase", "done", "cancel"])
export const purchaseOrderReceiptStatus = z.enum(["full", "partial", "pending", "cancel"])

const newPurchaseOrderLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  product_qty: z.number({ required_error: "La cantidad es requerida" }),
  taxes_id: z.array(z.number()).optional(),
  price_unit: z.number({ required_error: "El precio unitario es requerido" })
})

export const newPurchaseOrderGeneralSchema = z.object({
  supplier: z.number({ required_error: "El proveedor es requerido" }),
  required_date: z.custom<CalendarDate>()
    .refine(v => v instanceof CalendarDate, { message: "La fecha de requerimiento es requerida" }),
  purchase_request: z.number().optional(),
  company: z.string().default(""),
  items: z.array(newPurchaseOrderLineSchema)
    .min(1, { message: "Al menos un item es requerido" })
    .default([]),
});

export const newPurchaseOrderFiscalSchema = z.object({
  currency: z.number({ required_error: "La moneda es requerida" }),
  payment_term: z.number({ required_error: "El término de pago es requerido" })
});

export const newPurchaseOrderNotesSchema = z.object({
  internal_notes: z.string().optional().default(""),
  tyc_notes: z.string().optional().default(""),
});

export const newPurchaseOrderSchema = newPurchaseOrderGeneralSchema
  .merge(newPurchaseOrderFiscalSchema)
  .merge(newPurchaseOrderNotesSchema)

export const purchaseOrderListSchema = z.object({
  id: z.number(),
  sequence_id: z.string(),
  supplier: z.object({
    id: z.number(),
    name: z.string(),
  }),
  receipt_status: purchaseOrderReceiptStatus,
  status: purchaseOrderState,
  price: z.number(),
  required_date: z.string(),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
  percentage_received: z.number(),
})

export const purchaseOrderLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_code: z.string().optional(),
  product_name: z.string(),
  product_qty: z.number(),
  qty_received: z.number(),
  qty_invoiced: z.number(),
  price_unit: z.number(),
  price_subtotal: z.number(),
  price_tax: z.number(),
  product_uom: z.object({
    id: z.number(),
    name: z.string(),
  }),
  taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
})

export const purchaseOrderDetailSchema = z.object({
  id: z.number(),
  sequence_id: z.string(),
  supplier: z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.string(),
  }),
  receipt_status: purchaseOrderReceiptStatus,
  status: purchaseOrderState,
  price: z.number(),
  required_date: z.string(),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  payment_term: z.object({
    id: z.number(),
    name: z.string(),
  }),
  rejection_reason: z.string().optional(),
  tyc_notes: z.string().optional(),
  internal_notes: z.string(),
  required_by: z.string(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
  purchase_request: z.object({
    id: z.number(),
    sequence_id: z.string(),
  }),
  invoices: z.array(z.object({ id: z.number(), sequence_id: z.string() })),
  receptions: z.array(z.object({ id: z.number(), sequence_id: z.string() })),
  items: z.array(purchaseOrderLineSchema),
})

export const purchaseOrderListResponseSchema = z.object({
  status: z.string(),
  data: z.array(purchaseOrderListSchema),
});

export const purchaseOrderDetailResponseSchema = z.object({
  status: z.string(),
  data: purchaseOrderDetailSchema,
});

export const newPurchaseOrderResponseSchema = z.object({
  status: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export type PurchaseOrderItem = z.infer<typeof purchaseOrderLineSchema>;

export type PurchaseOrderList = z.infer<typeof purchaseOrderListSchema>;
export type PurchaseOrderLine = z.infer<typeof purchaseOrderLineSchema>;
export type PurchaseOrderListResponse = z.infer<typeof purchaseOrderListResponseSchema>;

export type PurchaseOrderDetail = z.infer<typeof purchaseOrderDetailSchema>;
export type PurchaseOrderDetailResponse = z.infer<typeof purchaseOrderDetailResponseSchema>;

export type NewPurchaseOrder = z.infer<typeof newPurchaseOrderSchema>;
export type NewPurchaseOrderLine = z.infer<typeof newPurchaseOrderLineSchema>;

export type NewPurchaseOrderResponse = z.infer<typeof newPurchaseOrderResponseSchema>;
export type NewPurchaseOrderItem = z.infer<typeof newPurchaseOrderLineSchema>;

export type PurchaseOrderState = z.infer<typeof purchaseOrderState>;