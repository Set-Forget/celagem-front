"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { PurchaseReceiptList } from "../schemas/purchase-receipts"
import { es } from "date-fns/locale"
import { ArrowRight } from "lucide-react"

export const columns: ColumnDef<PurchaseReceiptList>[] = [
  {
    accessorKey: "number",
    header: "Número",
    cell: ({ row }) => <div className="font-medium">{row.getValue("number")}</div>,
  },
  {
    accessorKey: "supplier",
    header: "Proveedor",
    cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
  },
  {
    accessorKey: "reception_date",
    header: "Fecha de recepción",
    cell: ({ row }) => <div>
      {format(new Date(row.getValue("reception_date")), "PP", { locale: es })}
    </div>,
  },
  {
    accessorKey: 'reception_location',
    header: 'Movimiento',
    cell: ({ row }) => (
      <div className="text-sm flex items-center gap-1">
        {row.original.source_location}{' '}
        <ArrowRight size={14} />{' '}
        {row.original.reception_location}
      </div>
    ),
  }
]