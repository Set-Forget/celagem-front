"use client"

import StatusBadge from "@/components/status-badge"
import { AdaptedPurchaseReceiptList } from "@/lib/adapters/purchase-receipts"
import { ColumnDef } from "@tanstack/react-table"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<AdaptedPurchaseReceiptList>[] = [
  {
    accessorKey: "sequence_id",
    header: "Número",
    cell: ({ row }) => <div className="font-medium">{row.getValue("sequence_id")}</div>,
  },
  {
    accessorKey: "supplier",
    header: "Proveedor",
    cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      return <StatusBadge status={row.getValue("status")} />
    },
  },
  {
    accessorKey: "reception_date",
    header: "Fecha de recepción",
    cell: ({ row }) => <div>
      {format(parseISO(row.getValue("reception_date")), "PP", { locale: es })}
    </div>,
  },
  {
    accessorKey: 'reception_location',
    header: 'Ubicación de recepción',
    cell: ({ row }) => (
      <div className="text-sm flex items-center gap-1">
        {row.original.reception_location}
      </div>
    ),
  }
]