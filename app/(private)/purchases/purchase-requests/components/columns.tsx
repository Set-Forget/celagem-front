"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { PURCHASE_REQUEST_STATUS } from "../adapters/customers"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Titulo",
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = PURCHASE_REQUEST_STATUS[row.getValue("status") as keyof typeof PURCHASE_REQUEST_STATUS]
      return <Badge
        variant="outline"
        className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm`)}
      >
        {status.label}
      </Badge>
    },
  },
  {
    accessorKey: "required_by",
    header: "Fecha de requerimiento",
    cell: ({ row }) => <div>
      {format(new Date(row.getValue("required_by")), "dd MMM yyyy")}
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