import { z } from "zod";
import { supplierSchema } from "../../vendors/schema/suppliers";

export const purchaseRequestsItemsSchema = z.object({
  item_code: z.string(),
  item_name: z.string(),
  description: z.string(),
  quantity: z.number(),
  id: z.string(),
});

export const purchaseRequestsSchema = z.object({
  title: z.string(),
  status: z.enum(["cancelled", "pending", "ordered"]),
  requested_by: z.string(),
  required_by: z.string(),
  created_at: z.string(),
  items: z.array(purchaseRequestsItemsSchema).optional(),
  id: z.number(),
});

export const newPurchaseRequestSchema = z.object({
  headquarter: z.object({
    id: z.string(),
    name: z.string(),
  }),
  title: z.string({ required_error: "El título es requerido" }),
  required_by: z.string({ required_error: "La fecha requerida es requerida" }),
  items: z.array(purchaseRequestsItemsSchema).nonempty("Al menos un item es requerido"),
  suppliers: z.array(supplierSchema).nonempty("Al menos un proveedor es requerido"),
  notes: z.string().optional(),
});

export type PurchaseRequest = z.infer<typeof purchaseRequestsSchema>;
export type PurchaseRequestItems = z.infer<typeof purchaseRequestsItemsSchema>;