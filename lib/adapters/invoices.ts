import { InvoiceDetail, InvoiceList } from "@/app/(private)/(commercial)/sales/invoices/schemas/invoices";
import { getInvoiceStatus } from "@/app/(private)/(commercial)/sales/invoices/utils";

export function listInvoicesAdapter(data: InvoiceList) {
  return {
    ...data,
    status: getInvoiceStatus(data),
  }
}

export function getInvoiceAdapter(data: InvoiceDetail) {
  return {
    ...data,
    status: getInvoiceStatus(data),
  }
}

export type AdaptedInvoiceList = ReturnType<typeof listInvoicesAdapter>;
export type AdaptedInvoiceDetail = ReturnType<typeof getInvoiceAdapter>;
