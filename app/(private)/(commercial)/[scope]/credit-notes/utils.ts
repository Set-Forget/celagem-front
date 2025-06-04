import { CreditNoteStatus } from "./schemas/credit-notes"

export const creditNoteStatus = {
  "paid": {
    label: "Completada",
    bg_color: "bg-green-100",
    text_color: "text-green-800",
    pure_bg_color: "bg-green-500",
  },
  "overdue": {
    label: "Vencida",
    bg_color: "bg-red-100",
    text_color: "text-red-800",
    pure_bg_color: "bg-red-500",
  },
  "posted": {
    label: "Pendiente",
    bg_color: "bg-blue-100",
    text_color: "text-blue-800",
    pure_bg_color: "bg-blue-500",
  },
  "draft": {
    label: "Borrador",
    bg_color: "bg-slate-100",
    text_color: "text-slate-800",
    pure_bg_color: "bg-slate-500",
  },
  "cancel": {
    label: "Cancelada",
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
}

interface CreditNoteLike {
  status: CreditNoteStatus
  amount_residual: number
  due_date: string
}

export function getCreditNoteStatus(
  creditNote?: CreditNoteLike,
): CreditNoteStatus {
  if (!creditNote) {
    return "draft"
  }

  if (creditNote.status === "cancel") {
    return "cancel"
  }

  if (creditNote.status === "posted" && creditNote.amount_residual === 0) {
    return "done"
  }

  if (creditNote.status === "posted") {
    return "posted"
  }

  return "draft"
}