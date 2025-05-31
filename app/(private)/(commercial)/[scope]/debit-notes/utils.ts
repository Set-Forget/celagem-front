import { DebitNoteStatus } from "./schemas/debit-notes"

export const debitNoteStatus = {
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

interface DebitNoteLike {
  status: DebitNoteStatus
  amount_residual: number
  due_date: string
}

export function getDebitNoteStatus(
  debitNote?: DebitNoteLike,
  today: Date = new Date()
): DebitNoteStatus {
  if (!debitNote) {
    return "draft"
  }

  if (debitNote.status === "cancel") {
    return "cancel"
  }

  if (debitNote.status === "posted" && debitNote.amount_residual === 0) {
    return "done"
  }

  if (debitNote.status === "posted" && new Date(debitNote.due_date) < today) {
    return "overdue"
  }

  if (debitNote.status === "posted") {
    return "posted"
  }

  return "draft"
}
