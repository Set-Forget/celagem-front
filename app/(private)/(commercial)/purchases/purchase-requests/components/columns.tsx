"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import StatusBadge from "@/components/status-badge"
import { AdaptedPurchaseRequestList } from "@/lib/adapters/purchase-requests"

export const columns: ColumnDef<AdaptedPurchaseRequestList>[] = [
  {
    accessorKey: "sequence_id",
    header: "Número",
    cell: ({ row }) => <span className="text-nowrap font-medium">{row.getValue("sequence_id")}</span>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      return <StatusBadge status={row.getValue("status")} />
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
      {row.original.request_date}
    </div>,
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
    cell: ({ row }) => <div>
      {row.original.created_at}
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