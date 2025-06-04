import { CreditNoteStatus } from "../../[scope]/credit-notes/schemas/credit-notes";
import { BillStatus, BillTypes } from "./schemas/bills";

export const billStatus = {
  draft: {
    label: "Borrador",
    key: "draft",
    bg_color: "bg-slate-100",
    text_color: "text-slate-800",
    pure_bg_color: "bg-slate-500",
  },
  overdue: {
    label: "Vencida",
    key: "overdue",
    bg_color: "bg-red-100",
    text_color: "text-red-800",
    pure_bg_color: "bg-red-500",
  },
  to_approve: {
    label: "A aprobar",
    key: "to_approve",
    bg_color: "bg-amber-100",
    text_color: "text-amber-800",
    pure_bg_color: "bg-amber-500",
  },
  posted: {
    label: "Pendiente",
    key: "posted",
    bg_color: "bg-blue-100",
    text_color: "text-blue-800",
    pure_bg_color: "bg-blue-500",
  },
  cancel: {
    label: "Cancelada",
    key: "cancel",
    bg_color: "bg-stone-100",
    text_color: "text-stone-800",
    pure_bg_color: "bg-stone-500",
  },
  done: {
    label: "Completada",
    key: "done",
    bg_color: "bg-green-100",
    text_color: "text-green-800",
    pure_bg_color: "bg-green-500",
  },
} as const;

export const billTypes = {
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

type ApprovalState = "draft" | "to_approve" | "approved" | "cancel"

interface BillLike {
  status: BillStatus | CreditNoteStatus
  approval_state?: ApprovalState
  amount_residual: number
  due_date: string
  type: BillTypes
}

export function getBillStatus(
  bill?: BillLike,
  today: Date = new Date()
): BillStatus | CreditNoteStatus {
  if (!bill) {
    return "draft"
  }

  if (bill.status === "draft" && bill.approval_state === "to_approve") {
    return "to_approve"
  }

  if (bill.status === "posted" && bill.amount_residual === 0) {
    return "done"
  }

  if (bill.status === "posted" && new Date(bill.due_date) < today) {
    return "overdue"
  }

  return "draft"
}
