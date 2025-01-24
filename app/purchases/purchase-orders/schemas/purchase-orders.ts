import { z } from "zod";

export const purchaseOrderItemSchema = z.object({
  item_code: z.string(),
  item_name: z.string(),
  description: z.string(),
  requested_quantity: z.number(),
  received_quantity: z.number(),
  id: z.string(),
  price: z.number(),
})

export const newPurchaseOrderItemSchema = z.object({
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

export const purchaseOrderListSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.object({ name: z.string(), id: z.string() }),
  status: z.enum(["to-approve", "approved", "pending", "done", "cancel"]),
  required_date: z.string(),
  amount_total: z.number(),
  order_lines: z.array(z.object({
    id: z.string(),
    product_qty: z.number(),
    qty_received: z.number(),
  })),
  currency: z.object({ name: z.string(), id: z.string() }),
})

export type PurchaseOrderList = z.infer<typeof purchaseOrderListSchema>;

export type PurchaseOrder = z.infer<typeof purchaseOrdersSchema>;
export type PurchaseOrderItem = z.infer<typeof purchaseOrderItemSchema>;
