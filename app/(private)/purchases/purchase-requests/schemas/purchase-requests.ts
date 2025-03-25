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

/* export const newPurchaseRequestSchema = z.object({
  headquarter: z.object({
    id: z.string(),
    name: z.string(),
  }),
  title: z.string({ required_error: "El título es requerido" }),
  required_by: z.string({ required_error: "La fecha requerida es requerida" }),
  items: z.array(purchaseRequestsItemsSchema).nonempty("Al menos un item es requerido"),
  suppliers: z.array(supplierSchema).nonempty("Al menos un proveedor es requerido"),
  notes: z.string().optional(),
}); */

export type PurchaseRequest = z.infer<typeof purchaseRequestsSchema>;
export type PurchaseRequestItems = z.infer<typeof purchaseRequestsItemsSchema>;

// ---

export const purchaseRequestListSchema = z.object({
  id: z.number(),
  name: z.string(),
  state: z.enum(["draft", "approved", "ordered", "cancelled"]),
  request_date: z.string(),

  // ! Falta requested_by.
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

export const newPurchaseRequestSchema = z.object({
  name: z.string({ required_error: "El título es requerido" }).nonempty("El título es requerido"),
  request_date: z.string({ required_error: "La fecha de requerimiento es requerida" }).nonempty("La fecha de requerimiento es requerida"),
  items: z.array(newPurchaseRequestLineSchema).nonempty("Al menos un item es requerido"),

  notes: z.string().optional(), // ! No existe
  //headquarter_id: z.string(), // ! No existe
})

export const purchaseRequestDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  state: z.enum(["draft", "approved", "ordered", "cancelled"]),
  request_date: z.string(),
  items: z.array(purchaseRequestLineSchema),

  // ! Falta notes
  // ! Falta headquarter
  // ! Falta created_at
  // ! Falta requested_by
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
export type NewPurchaseRequestItem = z.infer<typeof newPurchaseRequestLineSchema>;
export type NewPurchaseRequestResponse = z.infer<typeof newPurchaseRequestResponseSchema>;

export type PurchaseRequestDetail = z.infer<typeof purchaseRequestDetailSchema>;
export type PurchaseRequestItem = z.infer<typeof purchaseRequestLineSchema>;
export type PurchaseRequestDetailResponse = z.infer<typeof purchaseRequestDetailResponseSchema>;