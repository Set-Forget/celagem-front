import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const purchaseReceiptItemSchema = z.object({
  product_id: z.number(),
  display_name: z.string(),
  product_uom_qty: z.number(),
  quantity: z.number(),
  product_uom: z.string(), // ? Unidad de medida
  purchase_order_line: z.string(),
  // ! Falta lot_id
  // ! Falta serial
  // ! Falta due_date
});

export const newPurchaseReceiptItemSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  product_uom: z.number({ required_error: "La unidad de medida es requerida" }),
  name: z.string({ required_error: "El nombre es requerido" }), // ! Esto no debería ser requerido
  quantity: z.number({ required_error: "La cantidad es requerida" }),
  purchase_line_id: z.number({ required_error: "La línea de compra es requerida" }),
});

export const purchaseReceiptListSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.string(),
  received_at: z.string(),
  reception_location: z.string(),
  source_location: z.string(),
});

export const newPurchaseReceiptSchema = z.object({
  supplier: z.number({ required_error: "El proveedor es requerido" }),
  reception_date: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha de recepción es requerida" }),
  reception_location: z.string({ required_error: "La ubicación de recepción es requerida" }),
  source_location: z.string().optional(),
  move_type: z.enum(["direct"], { required_error: "El tipo de movimiento es requerido" }),
  notes: z.string().optional(),
  items: z.array(newPurchaseReceiptItemSchema),
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
  received_at: z.string(),
  note: z.string(),
  reception_location: z.string(),
  source_location: z.string(),
  scheduled_date: z.string(),
  purchase_orders: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })),
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