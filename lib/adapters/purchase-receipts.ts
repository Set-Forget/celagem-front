import { PurchaseReceiptDetail, PurchaseReceiptList } from "@/app/(private)/(commercial)/purchases/purchase-receipts/schemas/purchase-receipts";

export function listPurchaseReceiptsAdapter(data: PurchaseReceiptList) {
  return {
    id: data?.id,
    sequence_id: data?.sequence_id,
    supplier: data?.supplier,
    scheduled_date: data?.scheduled_date,
    reception_date: data?.reception_date,
    status: data?.state,
    reception_location: data?.reception_location,
    hide: data?.hide,
    company: data?.company && {
      id: data?.company?.id,
      name: data?.company?.name,
    },
    created_by: data?.created_by && {
      id: data?.created_by?.id,
      name: data?.created_by?.name,
    },
    created_at: data?.created_at,
  }
}

export function getPurchaseReceiptAdapter(data: PurchaseReceiptDetail) {
  return {
    id: data?.id,
    sequence_id: data?.sequence_id,
    scheduled_date: data?.scheduled_date,
    reception_date: data?.reception_date,
    internal_notes: data?.note,
    move_type: data?.move_type,
    status: data?.state,
    hide: data?.hide,
    reception_location: data?.reception_location && {
      id: data?.reception_location?.id,
      name: data?.reception_location?.name,
    },
    purchase_order: data?.purchase_order && {
      id: data?.purchase_order?.id,
      sequence_id: data?.purchase_order?.sequence_id,
    },
    bills: data?.invoices && data?.invoices.map(bill => ({
      id: bill?.id,
      sequence_id: bill?.sequence_id,
    })),
    company: data?.company && {
      id: data?.company?.id,
      name: data?.company?.name,
    },
    created_by: data?.created_by && {
      id: data?.created_by?.id,
      name: data?.created_by?.name,
    },
    created_at: data?.created_at,
    supplier: data?.supplier && {
      id: data?.supplier?.id,
      name: data?.supplier?.name,
      phone: data?.supplier?.phone,
      email: data?.supplier?.email,
      address: data?.supplier?.address,
    },
    items: data?.items && data?.items.map(item => ({
      id: item?.id,
      product_id: item?.product_id,
      product_name: item?.display_name?.replace(/^\[\d+\]\s*/, ""),
      product_code: item?.product_code,
      expected_quantity: item?.expected_quantity,
      quantity: item?.quantity,
      lot: item?.lot,
      product_uom: item?.product_uom && {
        id: item?.product_uom?.id,
        name: item?.product_uom?.name,
      },
      purchase_order_line: item?.purchase_order_line && {
        id: item?.purchase_order_line?.id,
        sequence_id: item?.purchase_order_line?.name,
      },
    })),
  }
}

export type AdaptedPurchaseReceiptList = ReturnType<typeof listPurchaseReceiptsAdapter>;
export type AdaptedPurchaseReceiptDetail = ReturnType<typeof getPurchaseReceiptAdapter>;
