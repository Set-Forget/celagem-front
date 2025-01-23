import { z } from "zod";

export const purchaseReceiptSchema = z.object({
  id: z.string(),
  purchase_order: z.string(),
  supplier: z.string(),
  created_at: z.string(),
  received_at: z.string(),
});

export const purchaseReceiptItemsSchema = z.object({
  item_code: z.string(),
  item_name: z.string(),
  description: z.string(),
  received_quantity: z.number({ required_error: "La cantidad recibida es requerida" }),
  id: z.string(),
});

export const newPurchaseReceiptSchema = z.object({
  headquarter: z.object({
    id: z.string({ required_error: "La sede es requerida" }),
    name: z.string({ required_error: "La sede es requerida" }),
  }),
  purchase_order: z.string({ required_error: "La orden de compra es requerida" }),
  supplier: z.string({ required_error: "El proveedor es requerido" }),
  received_at: z.string({ required_error: "La fecha de recepción es requerida" }),
  received_quantity: z.number({ required_error: "La cantidad recibida es requerida" }),
  notes: z.string().optional(),
  items: z.array(purchaseReceiptItemsSchema).nonempty("Al menos un item es requerido"),
});

export type PurchaseReceipt = z.infer<typeof purchaseReceiptSchema>;
export type NewPurchaseReceipt = z.infer<typeof newPurchaseReceiptSchema>;
export type PurchaseReceiptItems = z.infer<typeof purchaseReceiptItemsSchema>;