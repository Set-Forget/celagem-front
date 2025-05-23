import { CreditNoteStatus } from "../../[scope]/credit-notes/schemas/credit-notes";
import { InvoiceStatus, InvoiceTypes } from "./schemas/invoices";

export const invoiceStatus = {
  "done": {
    label: "Completada",
    bg_color: "bg-green-100",
    text_color: "text-green-800",
    pure_bg_color: "bg-green-500",
    key: "done",
  },
  "overdue": {
    label: "Vencida",
    bg_color: "bg-red-100",
    text_color: "text-red-800",
    pure_bg_color: "bg-red-500",
    key: "overdue",
  },
  "posted": {
    label: "Pendiente",
    bg_color: "bg-blue-100",
    text_color: "text-blue-800",
    pure_bg_color: "bg-blue-500",
    key: "posted",
  },
  "to_approve": {
    label: "A aprobar",
    bg_color: "bg-amber-100",
    text_color: "text-amber-800",
    pure_bg_color: "bg-amber-500",
    key: "to_approve",
  },
  "draft": {
    label: "Borrador",
    bg_color: "bg-slate-100",
    text_color: "text-slate-800",
    pure_bg_color: "bg-slate-500",
    key: "draft",
  },
  "cancel": {
    label: "Cancelada",
    bg_color: "bg-stone-100",
    text_color: "text-stone-800",
    pure_bg_color: "bg-stone-500",
    key: "cancel",
  },
} as const;

export const invoiceTypes = {
  "invoice": {
    label: "FA",
  },
  "credit_note": {
    label: "NC",
  },
  "debit_note": {
    label: "ND",
  },
}

interface InvoiceLike {
  status: InvoiceStatus | CreditNoteStatus;
  amount_residual: number;
  due_date: string;
  type: InvoiceTypes
}

export function getInvoiceStatus(
  bill?: InvoiceLike,
  today: Date = new Date()
): InvoiceStatus | CreditNoteStatus {

  if (bill?.type === "credit_note" && bill?.status === "posted") return "done"

  if (bill?.status === "posted" && bill.amount_residual === 0) return "done"
  if (bill?.status === "posted" && new Date(bill.due_date) < today) return "overdue"

  return bill?.status || "draft"
}