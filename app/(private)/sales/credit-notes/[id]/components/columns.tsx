"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { CreditNoteItem } from "../../schemas/credit-notes"

export const columns: ColumnDef<CreditNoteItem & { currency: string }>[] = [
  {
    accessorKey: "product_name",
    header: "Nombre",
    cell: ({ row }) => {
      return <span className="font-medium">
        {row.getValue("product_name")}
      </span>
    },
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("quantity")}</div>
    },
  },
  {
    accessorKey: "price_unit",
    header: "Precio unitario",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.currency} {row.original.price_unit.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "taxes",
    header: "Impuestos",
    cell: ({ row }) => {
      // ! Debe mostrar mas de un impuesto, por ahora solo muestra el primero. 
      // ! La idea es mapear los que vienen y mostrarlos en badges como se hace en el componente MultiSelect.
      return <span>{row.original.taxes[0].name}</span>
    }
  },
  {
    accessorKey: "price_subtotal",
    header: "Subtotal (sin imp.)",
    cell: ({ row }) => <span className="font-medium">{row.original.currency} {row.original.price_subtotal.toFixed(2)}</span>,
  },
]