import { PurchaseRequestDetail, PurchaseRequestList } from "@/app/(private)/(commercial)/purchases/purchase-requests/schemas/purchase-requests";

export function listPurchaseRequestsAdapter(data: PurchaseRequestList) {
  return {
    ...data,
    name: data.sequence_id,
  }
}

export function getPurchaseRequestAdapter(data: PurchaseRequestDetail) {
  return {
    ...data,
    name: data.sequence_id,
  }
}

export type AdaptedPurchaseRequestList = ReturnType<typeof listPurchaseRequestsAdapter>;
export type AdaptedPurchaseRequestDetail = ReturnType<typeof getPurchaseRequestAdapter>;
