import { PurchaseOrderDetail, PurchaseOrderList } from "@/app/(private)/(commercial)/purchases/purchase-orders/schemas/purchase-orders";

export function listPurchaseOrdersAdapter(data: PurchaseOrderList) {
  return {
    ...data,
    number: data.sequence_id,
    status: data.receipt_status === "full" ? "done" : data.status
  }
}

export function getPurchaseOrderAdapter(data: PurchaseOrderDetail) {
  return {
    ...data,
    number: data.sequence_id,
    status: data.receipt_status === "full" ? "done" : data.status
  }
}

export type AdaptedPurchaseOrderList = ReturnType<typeof listPurchaseOrdersAdapter>;
export type AdaptedPurchaseOrderDetail = ReturnType<typeof getPurchaseOrderAdapter>;
