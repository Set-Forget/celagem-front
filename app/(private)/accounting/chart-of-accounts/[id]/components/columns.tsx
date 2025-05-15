"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { AccountMoveLine } from "../../schemas/account"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<AccountMoveLine>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => row.getValue("date") && format(new Date(row.getValue("date")), "PP", { locale: es }),
  },
  {
    accessorKey: "partner",
    header: "Entidad",
    cell: ({ row }) => row.original.partner?.name
  },
  {
    accessorKey: "move_id",
    header: "Comprobante",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.move_id.name}</div>
    }
  },
  {
    accessorKey: "debit",
    header: "Debe",
    cell: ({ row }) => {
      return <div>{row.getValue("debit")}</div>
    },
  },
  {
    accessorKey: "credit",
    header: "Haber",
    cell: ({ row }) => {
      return <div>{row.getValue("credit")}</div>
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      return <div>{row.getValue("balance")}</div>
    },
  },
]