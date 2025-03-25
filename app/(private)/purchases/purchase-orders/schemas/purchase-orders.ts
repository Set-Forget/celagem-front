import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

const newPurchaseOrderLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  product_qty: z.number({ required_error: "La cantidad es requerida" }),
  taxes_id: z.array(z.number()).optional(),

  unit_price: z.string({ required_error: "El precio unitario es requerido" }), // ! No existe en el backend.
})

export const newPurchaseOrderSchema = z.object({
  supplier: z.number({ required_error: "El proveedor es requerido" }),
  required_date: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha de requerimiento es requerida" }),
  currency: z.string({ required_error: "La moneda es requerida" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  payment_term: z.string({ required_error: "El término de pago es requerido" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  notes: z.string().optional(), // ! Debería ser internal_notes.
  purchase_request: z.number({ required_error: "La solicitud de compra es requerida" }),
  items: z.array(newPurchaseOrderLineSchema).min(1, { message: "Al menos un item es requerido" }),

  // ! Falta headquarter_id. (Quizás no haga falta que el usuario lo seleccione)
  tyc_notes: z.string().optional(), // ! Falta el campo en el backend.
})

export const purchaseOrderListSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.string(),
  status: z.enum(["draft", "sent", "to approve", "purchase", "done", "cancel"]),
  required_date: z.string(),
  price: z.number(),
  currency: z.string(),
  percentage_received: z.number(),
})

export const purchaseOrderLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_code: z.string().optional(),
  product_name: z.string(),
  product_qty: z.number(),
  qty_received: z.number(),
  price_unit: z.number(),
  price_subtotal: z.number(),
  price_tax: z.number(),
  taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
})

export const purchaseOrderDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.string(),
  }),
  status: z.enum(["draft", "sent", "to approve", "purchase", "done", "cancel"]),
  price: z.number(),
  required_date: z.string(),
  currency: z.string(),
  notes: z.string(), // ! Debería ser internal_notes.
  purchase_order_date: z.string(),
  required_by: z.string(),
  purchase_request: z.string(), // ! Debería ser { id: z.number(), number: z.string() }
  invoices: z.array(z.object({ id: z.number(), number: z.string() })), // ! No sé con que forma vienen, pero que es un array seguro.
  receptions: z.array(z.object({ id: z.number(), number: z.string() })), // ! No sé con que forma vienen, pero que es un array seguro.
  items: z.array(purchaseOrderLineSchema),

  tyc_notes: z.string().optional(), // ! Falta el campo en el backend.
  // ! Falta headquarter_id. 
  // ! Falta request_date.
  // ! Falta payment_term, debe ser {id, name}.
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
export type PurchaseOrderListResponse = z.infer<typeof purchaseOrderListResponseSchema>;

export type PurchaseOrderDetail = z.infer<typeof purchaseOrderDetailSchema>;
export type PurchaseOrderDetailResponse = z.infer<typeof purchaseOrderDetailResponseSchema>;

export type NewPurchaseOrder = z.infer<typeof newPurchaseOrderSchema>;

export type NewPurchaseOrderResponse = z.infer<typeof newPurchaseOrderResponseSchema>;
export type NewPurchaseOrderItem = z.infer<typeof newPurchaseOrderLineSchema>;