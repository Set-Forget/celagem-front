"use client"

import { JournalEntryItem } from "@/app/(private)/accounting/journal-entries/schemas/journal-entries"
import {
  ColumnDef
} from "@tanstack/react-table"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      return <div>{row.getValue("date")}</div>
    },
  },
  {
    accessorKey: "account",
    header: "Cuenta",
    cell: ({ row }) => (
      <div>
        {row.getValue("account")}
      </div>
    ),
  },
  {
    accessorKey: "debit",
    header: "Debe",
    cell: ({ row }) => {
      return <div className="font-medium">ARS {row.getValue("debit")}</div>
    },
  },
  {
    accessorKey: "credit",
    header: "Haber",
    cell: ({ row }) => {
      return <div className="font-medium">ARS {row.getValue("credit")}</div>
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      return <div className="font-medium">ARS {row.getValue("balance")}</div>
    },
  },
  {
    accessorKey: "cost_center",
    header: "Centro de costos",
    cell: ({ row }) => {
      return <div>{row.getValue("cost_center")}</div>
    },
  },
]