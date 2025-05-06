"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { JournalEntryItem } from "../../schemas/journal-entries"

export const columns: ColumnDef<JournalEntryItem>[] = [
  {
    accessorKey: "account_name",
    header: "Cuenta contable",
    cell: ({ row }) => {
      return <div>{row.getValue("account_name")}</div>
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
  {
    accessorKey: "tax_amount",
    header: "Total impuestos",
    cell: ({ row }) => {
      return <div>ARS {row.getValue("tax_amount")}</div>
    }
  },
]