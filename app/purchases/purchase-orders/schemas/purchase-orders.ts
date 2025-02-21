import { z } from "zod";

const newPurchaseOrderItemSchema = z.object({
  item_code: z.string({ required_error: "El código del item es requerido" }),
  item_name: z.string({ required_error: "El nombre del item es requerido" }),
  description: z.string({ required_error: "La descripción del item es requerida" }),
  quantity: z.number({ required_error: "La cantidad es requerida" }),
  id: z.string({ required_error: "El id es requerido" }),
  price: z.string({ required_error: "El precio es requerido" }),
  tax: z.string()
})

export const newPurchaseOrderSchema = z.object({
  headquarter: z.object({
    id: z.string({ required_error: "La sede es requerida" }),
    name: z.string({ required_error: "La sede es requerida" }),
  }),
  supplier_name: z.string({ required_error: "El proveedor es requerido" }),
  contacts_name: z.array(z.string()).nonempty("Al menos un contacto es requerido"),
  payment_terms: z.string({ required_error: "Los términos de pago son requeridos" }),
  currency: z.string({ required_error: "La moneda es requerida" }),
  title: z.string({ required_error: "El título es requerido" }),
  items: z.array(newPurchaseOrderItemSchema).nonempty("Al menos un item es requerido"),
  required_by: z.string({ required_error: "La fecha requerida es requerida" }),
  purchase_order_date: z.string({ required_error: "La fecha de la orden es requerida" }),
  notes: z.string().optional(),
  address: z.string().optional(),
  terms_and_conditions: z.string().optional(),
})

export const purchaseOrdersSchema = z.object({
  id: z.string(),
  supplier_name: z.string(),
  status: z.enum(["cancelled", "pending", "ordered"]),
  created_at: z.string(),
  price: z.number(),
  number: z.number(),
  percentage_received: z.number(),
  title: z.string(),
});

//---

export const purchaseOrderListSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.string(),
  status: z.enum(["to-approve", "approved", "pending", "done", "cancel"]),
  required_date: z.string(),
  price: z.number(),
  currency: z.string(),
  percentage_received: z.number(),
})

export const purchaseOrderLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
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
  required_date: z.string(),
  purchase_order_date: z.string(),
  required_by: z.string(),
  related_invoices: z.array(z.object({ id: z.number(), number: z.string() })).optional(),
  related_receptions: z.array(z.object({ id: z.number(), number: z.string() })).optional(),
  status: z.enum(["to-approve", "approved", "pending", "done", "cancel"]),
  items: z.array(purchaseOrderLineSchema),
  currency: z.string(),
  supplier: z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
  }),
})

export const purchaseOrderListResponseSchema = z.object({
  status: z.string(),
  data: z.array(purchaseOrderListSchema),
});

export const purchaseOrderDetailResponseSchema = z.object({
  status: z.string(),
  data: purchaseOrderDetailSchema,
});

export type PurchaseOrderItem = z.infer<typeof purchaseOrderLineSchema>;

export type PurchaseOrderList = z.infer<typeof purchaseOrderListSchema>;
export type PurchaseOrderListResponse = z.infer<typeof purchaseOrderListResponseSchema>;

export type PurchaseOrderDetail = z.infer<typeof purchaseOrderDetailSchema>;
export type PurchaseOrderDetailResponse = z.infer<typeof purchaseOrderDetailResponseSchema>;