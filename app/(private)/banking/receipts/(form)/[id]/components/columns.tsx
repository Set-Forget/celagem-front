"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { invoiceTypes } from "@/app/(private)/(commercial)/sales/invoices/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdaptedInvoiceDetail } from "@/lib/adapters/invoices"
import { routes } from "@/lib/routes"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

export const columns: ColumnDef<AdaptedInvoiceDetail>[] = [
  {
    accessorKey: "number",
    header: "Número",
    cell: ({ row }) => {
      const type = invoiceTypes[row.original.type as keyof typeof invoiceTypes]
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
    header: "Proveedor",
    cell: ({ row }) => <Button
      variant="link"
      className="h-auto p-0 text-foreground"
      asChild
    >
      <Link
        href={routes.customers.detail(row.original.customer.id)}
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
      return <div className="text-nowrap">
        {format(parseISO(row.getValue("due_date")), "PP", { locale: es })}
      </div>
    }
  }
]