"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { INVOICE_STATUSES } from "../adapters/invoices"

export type Invoice = {
  company_name: string;
  number: string;
  status: "paid" | "overdue" | "pending" | "in_process";
  type: "FA" | "OC" | "NC" | "ND";
  issue_date: string;
  due_date: string;
  amount: number;
  currency: "USD" | "ARS" | "EUR" | "CLP";
  description: string;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: "Número",
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div className="font-medium">{row.original.type}</div> {row.getValue("number")}
      </div>
    ),
  },
  {
    accessorKey: "company_name",
    header: "Proveedor",
    cell: ({ row }) => <div>{row.getValue("company_name")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = INVOICE_STATUSES[row.getValue("status") as keyof typeof INVOICE_STATUSES]
      return <Badge
        variant="outline"
        className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm`)}
      >
        {status.label}
      </Badge>
    },
  },
  {
    accessorKey: "issue_date",
    header: "Fecha de emisión",
    cell: ({ row }) => {
      const formattedDate = new Date(row.getValue("issue_date")).toLocaleDateString("es-AR")
      return <div>{formattedDate}</div>
    },
  },
  {
    accessorKey: "due_date",
    header: "Fecha de vencimiento",
    cell: ({ row }) => {
      const formattedDate = new Date(row.getValue("due_date")).toLocaleDateString("es-AR")
      return <div>{formattedDate}</div>
    }
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right pr-4">Importe</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const currency = row.original.currency

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        currencyDisplay: "code",
      }).format(amount)

      return <div className="text-right font-medium pr-4">{formatted}</div>
    },
  },
]