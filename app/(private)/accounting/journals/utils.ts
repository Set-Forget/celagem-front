
export const journalStatus = {
  true: {
    label: "Activo",
    bg_color: "bg-blue-100",
    text_color: "text-blue-800",
    pure_bg_color: "bg-blue-500",
  },
  false: {
    label: "Inactivo",
    bg_color: "bg-slate-100",
    text_color: "text-slate-800",
    pure_bg_color: "bg-slate-500",
  },
}

export const journalTypes = [
  {
    value: "sale",
    label: "Venta",
  },
  {
    value: "purchase",
    label: "Compra"
  },
  {
    value: "cash",
    label: "Efectivo"
  },
  {
    value: "bank",
    label: "Banco"
  },
  {
    value: "credit",
    label: "Crédito"
  },
  {
    value: "general",
    label: "General"
  }
]

export const journalReferenceTypes = [
  {
    value: "none",
    label: "Ninguno",
  },
  {
    value: "partner",
    label: "Socio",
  },
  {
    value: "invoice",
    label: "Factura",
  }
]