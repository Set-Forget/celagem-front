import { PurchaseRequestDetail, PurchaseRequestList } from "@/app/(private)/(commercial)/purchases/purchase-requests/schemas/purchase-requests";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function listPurchaseRequestsAdapter(data: PurchaseRequestList) {
  return {
    id: data?.id,
    sequence_id: data?.sequence_id,
    status: data?.state,
    request_date: data?.request_date && format(parseISO(data?.request_date), "PP", { locale: es }),
    company: data?.company && {
      id: data?.company?.id,
      name: data?.company?.name,
    },
    created_by: data?.created_by && {
      id: data?.created_by?.id,
      name: data?.created_by?.name,
    },
    created_at: data?.created_at && format(parseISO(data?.created_at), "PP HH:mm a", { locale: es }),
  }
}

export function getPurchaseRequestAdapter(data: PurchaseRequestDetail) {
  return {
    id: data?.id,
    sequence_id: data?.sequence_id,
    request_date: data?.request_date && format(parseISO(data.request_date), "PP", { locale: es }),
    status: data?.state,
    internal_notes: data?.internal_notes,
    tyc_notes: data?.tyc_notes,
    created_at: data?.created_at && format(parseISO(data.created_at), "PP HH:mm a", { locale: es }),
    purchase_order: data?.purchase_order && {
      id: data.purchase_order.id,
      sequence_id: data.purchase_order.sequence_id,
    },
    company: data?.company && {
      id: data?.company?.id,
      name: data?.company?.name,
    },
    created_by: data?.created_by && {
      id: data?.created_by?.id,
      name: data?.created_by?.name,
    },
    items: data.items?.map(item => ({
      id: item?.id,
      product_id: item?.product_id,
      product_name: item?.product_name,
      product_code: item?.product_code,
      quantity: item?.quantity,
    }))
  }
}

export type AdaptedPurchaseRequestList = ReturnType<typeof listPurchaseRequestsAdapter>;
export type AdaptedPurchaseRequestDetail = ReturnType<typeof getPurchaseRequestAdapter>;
