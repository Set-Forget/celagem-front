import { PurchaseOrderDetail, PurchaseOrderList } from "@/app/(private)/(commercial)/purchases/purchase-orders/schemas/purchase-orders";
import { formatNumber } from "../utils";

const statusAdapter = (data: PurchaseOrderList | PurchaseOrderDetail) => {
  if (data.receipt_status === "full") return "done" as const;
  if (data.status === "to approve") return "to_approve" as const;
  if (data.status === "purchase") return "purchase" as const;
  if (data.status === "cancel" && data.rejection_reason) return "rejected" as const;
  return data.status;
}

export function listPurchaseOrdersAdapter(data: PurchaseOrderList) {
  return {
    id: data?.id,
    sequence_id: data?.sequence_id,
    status: statusAdapter(data),
    price: formatNumber(data?.price),
    percentage_received: data?.percentage_received,
    required_date: data?.required_date,
    created_at: data?.created_at,
    created_by: data?.created_by && {
      id: data?.created_by?.id,
      name: data?.created_by?.name,
    },
    company: data?.company && {
      id: data?.company?.id,
      name: data?.company?.name,
    },
    currency: data?.currency && {
      id: data?.currency?.id,
      name: data?.currency?.name,
    },
    supplier: data?.supplier && {
      id: data?.supplier?.id,
      name: data?.supplier?.name,
    },
  }
}

export function getPurchaseOrderAdapter(data: PurchaseOrderDetail) {
  return {
    id: data?.id,
    sequence_id: data?.sequence_id,
    status: statusAdapter(data),
    price: formatNumber(data?.price),
    required_date: data?.required_date,
    created_at: data?.created_at,
    rejection_reason: data?.rejection_reason,
    tyc_notes: data?.tyc_notes,
    internal_notes: data?.internal_notes,
    required_by: data?.required_by,
    currency: data?.currency && {
      id: data?.currency?.id,
      name: data?.currency?.name,
    },
    company: data?.company && {
      id: data?.company?.id,
      name: data?.company?.name,
    },
    payment_term: data?.payment_term && {
      id: data?.payment_term?.id,
      name: data?.payment_term?.name,
    },
    created_by: data?.created_by && {
      id: data?.created_by?.id,
      name: data?.created_by?.name,
    },
    purchase_request: data?.purchase_request && {
      id: data?.purchase_request?.id,
      sequence_id: data?.purchase_request?.sequence_id,
    },
    bills: data?.invoices && data?.invoices.map(bill => ({
      id: bill?.id,
      sequence_id: bill?.sequence_id,
    })),
    receptions: data?.receptions && data?.receptions.map(reception => ({
      id: reception?.id,
      sequence_id: reception?.sequence_id,
      hide: reception?.hide,
    })),
    supplier: data?.supplier && {
      id: data?.supplier.id,
      name: data?.supplier.name,
      phone: data?.supplier.phone,
      email: data?.supplier.email,
      address: data?.supplier.address,
    },
    items: data?.items && data?.items.map(line => ({
      id: line?.id,
      product_id: line?.product_id,
      product_code: line?.product_code,
      product_name: line?.product_name,
      product_qty: line?.product_qty,
      qty_received: line?.qty_received,
      qty_invoiced: line?.qty_invoiced,
      price_unit: line?.price_unit,
      price_subtotal: line?.price_subtotal,
      price_tax: line?.price_tax,
      product_uom: line?.product_uom && {
        id: line?.product_uom?.id,
        name: line?.product_uom?.name,
      },
      taxes: line?.taxes && line?.taxes.map(tax => ({
        id: tax?.id,
        name: tax?.name,
        amount: tax.amount
      })),
    })),
  }
}

export type AdaptedPurchaseOrderList = ReturnType<typeof listPurchaseOrdersAdapter>;
export type AdaptedPurchaseOrderDetail = ReturnType<typeof getPurchaseOrderAdapter>;
