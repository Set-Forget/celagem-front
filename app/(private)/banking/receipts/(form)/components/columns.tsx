"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { billTypes } from "@/app/(private)/(commercial)/purchases/bills/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { routes } from "@/lib/routes"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { NewCharge } from "../../schemas/receipts"
import { formatNumber } from "@/lib/utils"

export const columns: ColumnDef<NonNullable<NewCharge['invoices']>[number]>[] = [
  {
    accessorKey: "number",
    header: "Número",
    cell: ({ row }) => {
      const type = billTypes[row.original.type as keyof typeof billTypes]
      return <div className="gap-2 flex items-center">
        <Badge className="px-1" variant="outline">{type?.label}</Badge>
        <Button
          variant="link"
          className="h-auto p-0 text-foreground"
          asChild
        >
          <Link
            href={
              row.original.type === "debit_note" ?
                routes.salesDebitNote.detail(row.original.id) :
                routes.invoice.detail(row.original.id)
            }
            target="_blank"
          >
            {row.original.number}
          </Link>
        </Button>
      </div>
    }
  },
  {
    accessorKey: "customer",
    header: "Cliente",
    cell: ({ row }) => <Button
      variant="link"
      className="h-auto p-0 text-foreground"
      asChild
    >
      <Link
        href={routes.suppliers.detail(row.original.customer.id)}
        target="_blank"
      >
        {row.original.customer.name}
      </Link>
    </Button>
  },
  {
    accessorKey: "due_date",
    header: "Fecha de vencimiento",
    cell: ({ row }) => {
      if (row.original.type === 'credit_note') return
      return <div className="text-nowrap">
        {format(parseISO(row.getValue("due_date")), "PP", { locale: es })}
      </div>
    }
  },
  {
    accessorKey: "amount_residual",
    header: () => <div className="text-left pr-4">Saldo</div>,
    cell: ({ row }) => {
      if (row.original.type === 'credit_note') return
      return <div className="text-left font-medium pr-4 text-nowrap">
        {row.original.currency.name}{" "}
        {formatNumber(row.original.amount_residual)}
      </div>
    },
  },
]