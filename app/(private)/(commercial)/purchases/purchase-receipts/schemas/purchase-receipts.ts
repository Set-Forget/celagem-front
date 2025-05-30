import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const purchaseReceiptStatusSchema = z.enum(["draft", "waiting", "confirmed", "assigned", "done", "cancel"])

export const purchaseReceiptItemSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  display_name: z.string(),
  expected_quantity: z.number(),
  quantity: z.number(),
  product_uom: z.object({
    id: z.number(),
    name: z.string(),
  }),
  purchase_order_line: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  lot: z.object({
    id: z.number(),
    name: z.string(),
    expiration_date: z.string().nullable(),
    tracking_type: z.string(), // ? Ni idea que es esto.
  }).nullable(),
});

export const newPurchaseReceiptItemSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  name: z.string({ required_error: "El nombre es requerido" }).optional(),
  product_uom: z.number({ required_error: "La unidad de medida es requerida" }),
  expected_quantity: z.number().optional(),
  quantity: z.number({ required_error: "La cantidad es requerida" }),
  purchase_line_id: z.number().optional(),
});

export const purchaseReceiptListSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.string(),
  scheduled_date: z.string(),
  reception_date: z.string(),
  reception_location: z.string(),
  source_location: z.string(),
  state: purchaseReceiptStatusSchema,
});

export const newPurchaseReceiptSchema = z.object({
  supplier: z.number({ required_error: "El proveedor es requerido" }),
  reception_date: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha de recepción es requerida" }),
  reception_location: z.number({ required_error: "La ubicación de recepción es requerida" }),
  source_location: z.number().optional(),
  move_type: z.enum(["direct"], { required_error: "El tipo de movimiento es requerido" }),
  notes: z.string().optional(),
  scheduled_date: z.string().optional(),
  items: z.array(newPurchaseReceiptItemSchema).min(1, { message: "Al menos un item es requerido" }),

  // ? Esto no debe ser envíado al back, es solo para referencia en el front.
  purchase_order: z.number().optional(),
});

export const purchaseReceiptDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone: z.string(),
  }),
  scheduled_date: z.string(),
  reception_date: z.string(),
  note: z.string(),
  move_type: z.enum(["direct"]),
  state: purchaseReceiptStatusSchema,
  reception_location: z.object({
    id: z.number(),
    name: z.string(),
  }),
  source_location: z.object({
    id: z.number(),
    name: z.string(),
  }),
  purchase_order: z.object({
    id: z.number(),
    number: z.string(),
  }).nullable(),
  backorder: z.boolean(),
  backorders: z.array(z.object({
    id: z.number(),
    number: z.string(),
  })),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
  items: z.array(purchaseReceiptItemSchema),
});

export const newPurchaseReceiptResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const purchaseReceiptListResponseSchema = z.object({
  status: z.string(),
  data: z.array(purchaseReceiptListSchema),
});

export const purchaseReceiptDetailResponseSchema = z.object({
  status: z.string(),
  data: purchaseReceiptDetailSchema,
});

export type PurchaseReceiptItem = z.infer<typeof purchaseReceiptItemSchema>;

export type NewPurchaseReceipt = z.infer<typeof newPurchaseReceiptSchema>;
export type NewPurchaseReceiptResponse = z.infer<typeof newPurchaseReceiptResponseSchema>;

export type PurchaseReceiptList = z.infer<typeof purchaseReceiptListSchema>;
export type PurchaseReceiptListResponse = z.infer<typeof purchaseReceiptListResponseSchema>;

export type PurchaseReceiptDetail = z.infer<typeof purchaseReceiptDetailSchema>;
export type PurchaseReceiptDetailResponse = z.infer<typeof purchaseReceiptDetailResponseSchema>;

export type PurchaseReceiptStatus = z.infer<typeof purchaseReceiptStatusSchema>;