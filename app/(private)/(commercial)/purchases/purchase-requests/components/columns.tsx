"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { purchaseRequestStatus } from "../utils"
import { PurchaseRequestList } from "../schemas/purchase-requests"
import { es } from "date-fns/locale"

export const columns: ColumnDef<PurchaseRequestList>[] = [
  {
    accessorKey: "name",
    header: "Número",
    cell: ({ row }) => <span className="text-nowrap font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const status = purchaseRequestStatus[row.getValue("state") as keyof typeof purchaseRequestStatus]
      return <Badge
        variant="custom"
        className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
      >
        {status?.label}
      </Badge>
    },
  },
  {
    accessorKey: "company",
    header: "Sede",
    cell: ({ row }) => <span className="text-nowrap">
      {row.original.company.name}
    </span>,
  },
  {
    accessorKey: "request_date",
    header: "Fecha de requerimiento",
    cell: ({ row }) => <div>
      {format(parseISO(row.getValue("request_date")), "PP", { locale: es })}
    </div>,
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
    cell: ({ row }) => <div>
      {format(parseISO(row.getValue("created_at")), "PP", { locale: es })}
    </div>,
  },
  {
    accessorKey: "created_by",
    header: "Solicitado por",
    cell: ({ row }) => <div className="text-nowrap">
      {row.original.created_by.name}
    </div>,
  },
]