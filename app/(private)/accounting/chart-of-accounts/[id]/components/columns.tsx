"use client"

import { Button } from "@/components/ui/button"
import {
  ColumnDef
} from "@tanstack/react-table"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { AccountMoveLine } from "../../schemas/account"

export const columns: ColumnDef<AccountMoveLine>[] = [
  {
    accessorKey: "date",
    header: "Fecha de contabilización",
    cell: ({ row }) => row.getValue("date") && format(parseISO(row.getValue("date")), "PP", { locale: es }),
  },
  {
    accessorKey: "partner",
    header: "Entidad",
    cell: ({ row }) => <Button
      variant="link"
      className="p-0 h-auto text-foreground"
      asChild
    >
      <Link href={""}>
        {row.original.partner?.name}
      </Link>
    </Button>,
  },
  {
    accessorKey: "move_id",
    header: "Comprobante",
    cell: ({ row }) => {
      return <Button
        variant="link"
        className="p-0 h-auto text-foreground"
        asChild
      >
        <Link href={""}>
          {row.original.move_id?.name}
        </Link>
      </Button>
    }
  },
  {
    accessorKey: "debit",
    header: "Debe",
    cell: ({ row }) => {
      return <div>
        {row.original.currency.name}{" "}
        {row.getValue("debit")}
      </div>
    },
  },
  {
    accessorKey: "credit",
    header: "Haber",
    cell: ({ row }) => {
      return <div>
        {row.original.currency.name}{" "}
        {row.getValue("credit")}
      </div>
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      return <div>
        {row.original.currency.name}{" "}
        {row.getValue("balance")}
      </div>
    },
  },
]