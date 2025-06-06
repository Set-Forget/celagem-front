"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format, parseISO } from "date-fns"
import { PurchaseReceiptList } from "../schemas/purchase-receipts"
import { es } from "date-fns/locale"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { purchaseReceiptStatus } from "../utils"

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
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const status = purchaseReceiptStatus[row.getValue("state") as keyof typeof purchaseReceiptStatus]
      return <Badge
        variant="custom"
        className={cn(`${status?.bg_color} ${status?.text_color} border-none`)}
      >
        {status?.label}
      </Badge>
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