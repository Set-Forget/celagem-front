"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
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
    accessorKey: "request_date",
    header: "Fecha de requerimiento",
    cell: ({ row }) => <div>
      {format(new Date(row.getValue("request_date")), "PPP", { locale: es })}
    </div>,
  },
  {
    accessorKey: "requested_by",
    header: "Solicitado por",
    cell: ({ row }) => <div>
      {row.getValue("requested_by")}
    </div>,
  },
]