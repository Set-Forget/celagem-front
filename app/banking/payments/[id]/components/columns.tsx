"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "Número",
    cell: ({ row }) => (
      <div>
        {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "provider",
    header: "Razón social",
    cell: ({ row }) => {
      return <div>{row.getValue("provider")}</div>
    },
  },
  {
    accessorKey: "balance",
    header: "Saldo",
    cell: ({ row }) => {
      return <div className="font-medium">ARS {row.getValue("balance")}</div>
    },
  },
  {
    accessorKey: "amount",
    header: "Subtotal abonado",
    cell: ({ row }) => {
      return <div className="font-medium">ARS {row.getValue("amount")}</div>
    },
  },
]