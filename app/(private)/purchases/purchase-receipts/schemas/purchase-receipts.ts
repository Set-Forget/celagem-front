import { z } from "zod";

export const purchaseReceiptItemsSchema = z.object({
  product_id: z.string(),
  display_name: z.string(),
  product_uom_qty: z.number(),
});

export const purchaseReceiptListSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.string(),
  received_date: z.string(),
});

export const purchaseReceiptDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.string(),
  received_at: z.string(),
  note: z.string(),
  reception_location: z.string(),
  scheduled_date: z.string(),
  items: z.array(purchaseReceiptItemsSchema),
});

export const purchaseReceiptListResponseSchema = z.object({
  status: z.string(),
  data: z.array(purchaseReceiptListSchema),
});

export const purchaseReceiptDetailResponseSchema = z.object({
  status: z.string(),
  data: purchaseReceiptDetailSchema,
});

export type PurchaseReceiptItems = z.infer<typeof purchaseReceiptItemsSchema>;

export type PurchaseReceiptList = z.infer<typeof purchaseReceiptListSchema>;
export type PurchaseReceiptListResponse = z.infer<typeof purchaseReceiptListResponseSchema>;

export type PurchaseReceiptDetail = z.infer<typeof purchaseReceiptDetailSchema>;
export type PurchaseReceiptDetailResponse = z.infer<typeof purchaseReceiptDetailResponseSchema>;