"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { billTypes } from "@/app/(private)/purchases/bills/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdaptedBillDetail } from "@/lib/adapters/bills"
import { routes } from "@/lib/routes"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

export const columns: ColumnDef<AdaptedBillDetail & { payed_amount: number }>[] = [
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
            href={routes.bill.detail(row.original.id)}
            target="_blank"
          >
            {row.original.number}
          </Link>
        </Button>
      </div>
    }
  },
  {
    accessorKey: "supplier",
    header: "Proveedor",
    cell: ({ row }) => <Button
      variant="link"
      className="h-auto p-0 text-foreground"
      asChild
    >
      <Link
        href={routes.suppliers.detail(row.original.supplier.id)}
        target="_blank"
      >
        {row.original.supplier.name}
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
    accessorKey: "payed_amount",
    header: () => <div className="text-left pr-4">Pago</div>,
    cell: ({ row }) => {
      if (row.original.type === 'credit_note') return
      return <div className="text-left font-medium pr-4 text-nowrap">
        {row.original.currency.name}{" "}
        {row.original.payed_amount}
      </div>
    },
  },
]