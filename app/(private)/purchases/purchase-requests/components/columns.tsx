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
    header: "Titulo",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
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
    cell: ({ row }) => <div>
      {row.original.company.name}
    </div>,
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
    cell: ({ row }) => <div>
      {row.getValue("created_by")}
    </div>,
  },
]