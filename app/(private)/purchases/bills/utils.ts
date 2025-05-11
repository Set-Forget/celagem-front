
export const billStatus = {
  draft: {
    label: "Borrador",
    bg_color: "bg-slate-100",
    text_color: "text-slate-800",
    pure_bg_color: "bg-slate-500",
  },
  overdue: {
    label: "Vencida",
    bg_color: "bg-red-100",
    text_color: "text-red-800",
    pure_bg_color: "bg-red-500",
  },
  to_approve: {
    label: "A aprobar",
    bg_color: "bg-amber-100",
    text_color: "text-amber-800",
    pure_bg_color: "bg-amber-500",
  },
  posted: {
    label: "Pendiente",
    bg_color: "bg-blue-100",
    text_color: "text-blue-800",
    pure_bg_color: "bg-blue-500",
  },
  cancel: {
    label: "Cancelada",
    bg_color: "bg-stone-100",
    text_color: "text-stone-800",
    pure_bg_color: "bg-stone-500",
  },
  done: {
    label: "Paga",
    bg_color: "bg-green-100",
    text_color: "text-green-800",
    pure_bg_color: "bg-green-500",
  },
}

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