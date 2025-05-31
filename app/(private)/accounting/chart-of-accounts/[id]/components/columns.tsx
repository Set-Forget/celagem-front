"use client"

import { Button } from "@/components/ui/button"
import {
  ColumnDef
} from "@tanstack/react-table"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { AccountMoveLine } from "../../schemas/account"
import { routes } from "@/lib/routes"

const typeToRoute: Record<string, (id: number) => string> = {
  in_invoice: routes.bill.detail,
  out_invoice: routes.invoice.detail,
  in_credit_note: routes.purchaseCreditNote.detail,
  out_credit_note: routes.salesCreditNote.detail,
  in_debit_note: routes.purchaseDebitNote.detail,
  out_debit_note: routes.salesDebitNote.detail,
}

const typeToPartner: Record<string, (id: number) => string> = {
  in_invoice: routes.suppliers.detail,
  out_invoice: routes.customers.detail,
  in_credit_note: routes.suppliers.detail,
  out_credit_note: routes.customers.detail,
  in_debit_note: routes.suppliers.detail,
  out_debit_note: routes.customers.detail,
}

export const columns: ColumnDef<AccountMoveLine>[] = [
  {
    accessorKey: "date",
    header: "Fecha de contabilización",
    cell: ({ row }) => row.getValue("date") && format(parseISO(row.getValue("date")), "PP", { locale: es }),
  },
  {
    accessorKey: "name",
    header: "Referencia",
    cell: ({ row }) => {
      return <div className="text-nowrap max-w-[200px] truncate">
        {row.original.name}
      </div>
    },
  },
  {
    accessorKey: "partner",
    header: "Entidad",
    cell: ({ row }) => <Button
      variant="link"
      className="p-0 h-auto text-foreground"
      asChild
    >
      <Link
        href={typeToPartner[row.original.type]?.(row.original.partner?.id) || ""}
        target="_blank"
      >
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
        <Link href={typeToRoute[row.original.type]?.(row.original.move_id?.id) || ""}
          target="_blank"
        >
          {row.original.move_id?.name}
        </Link>
      </Button>
    }
  },
  {
    accessorKey: "debit",
    header: "Debe",
    cell: ({ row }) => {
      return <div className="text-nowrap">
        USD{" "}
        {row.getValue("debit")}
      </div>
    },
  },
  {
    accessorKey: "credit",
    header: "Haber",
    cell: ({ row }) => {
      return <div className="text-nowrap">
        USD{" "}
        {row.getValue("credit")}
      </div>
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      return <div className="text-nowrap">
        USD{" "}
        {row.getValue("balance")}
      </div>
    },
  },
]