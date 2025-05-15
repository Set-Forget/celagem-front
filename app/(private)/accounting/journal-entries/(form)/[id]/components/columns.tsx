"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { JournalEntryItem } from "../../../schemas/journal-entries"

export const columns: ColumnDef<JournalEntryItem>[] = [
  {
    accessorKey: "account_name",
    header: "Cuenta contable",
    cell: ({ row }) => {
      return <div>{row.getValue("account_name")}</div>
    },
  },
  {
    accessorKey: "name",
    header: "Ref. / Descripción",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "debit",
    header: "Debe",
    cell: ({ row }) => {
      return <div>ARS {row.getValue("debit")}</div>
    },
  },
  {
    accessorKey: "credit",
    header: "Haber",
    cell: ({ row }) => {
      return <div>ARS {row.getValue("credit")}</div>
    },
  },
]