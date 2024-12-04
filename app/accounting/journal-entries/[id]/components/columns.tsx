"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { JournalEntryItem } from "../../schemas/journal-entries"

export const columns: ColumnDef<JournalEntryItem>[] = [
  {
    accessorKey: "name",
    header: "Título",
    cell: ({ row }) => (
      <div>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "account",
    header: "Cuenta",
    cell: ({ row }) => {
      return <div>{row.getValue("account")}</div>
    },
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
]