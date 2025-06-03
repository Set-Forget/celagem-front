import { PurchaseReceiptDetail, PurchaseReceiptList } from "@/app/(private)/(commercial)/purchases/purchase-receipts/schemas/purchase-receipts";

export function listPurchaseReceiptsAdapter(data: PurchaseReceiptList) {
  return {
    ...data,
    number: data.sequence_id,
  }
}

export function getPurchaseReceiptAdapter(data: PurchaseReceiptDetail) {
  return {
    ...data,
    number: data.sequence_id,
  }
}

export type AdaptedPurchaseReceiptList = ReturnType<typeof listPurchaseReceiptsAdapter>;
export type AdaptedPurchaseReceiptDetail = ReturnType<typeof getPurchaseReceiptAdapter>;
