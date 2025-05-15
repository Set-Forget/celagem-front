"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { CurrentAccountsList } from "../schemas/current-accounts"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<CurrentAccountsList>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      if (!row.original.date) return <div>&nbsp;</div>
      return <div className="truncate">
        {format(new Date(row.getValue("date")), "dd MMM yyyy", { locale: es })}
      </div>
    },
  },
  {
    accessorKey: "partner",
    header: "Entidad",
    cell: ({ row }) =>
      <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
        {row.original.partner}
      </div>,
  },
  {
    accessorKey: "account",
    header: "Cuenta",
    cell: ({ row }) => (
      <div className="flex gap-1">
        <div className="font-medium truncate">{row.getValue("account")}</div>
      </div>
    ),
  },
  {
    accessorKey: "ref",
    header: "Referencia",
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div className="font-medium truncate">{row.getValue("ref")}</div>
      </div>
    ),
  },
  {
    accessorKey: "debit",
    header: "Debe",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original.debit}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original.debit),
        0
      ) / 2
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
  {
    accessorKey: "credit",
    header: "Haber",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original.credit}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original.credit),
        0
      ) / 2
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
  {
    accessorKey: "balance",
    header: "Saldo",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original.balance}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original.balance),
        0
      ) / 2
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
]