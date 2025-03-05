"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { BillItem } from "../../schemas/bills"

export const columns: ColumnDef<BillItem>[] = [
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
      return <span>{row.original.taxes[0].name}</span>
    }
  },
  {
    accessorKey: "price_subtotal",
    header: "Subtotal (sin imp.)",
    cell: ({ row }) => <span className="font-medium">{row.original.currency} {row.original.price_subtotal.toFixed(2)}</span>,
  },
]