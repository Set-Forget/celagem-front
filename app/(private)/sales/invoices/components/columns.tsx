"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { InvoiceList } from "../schemas/invoices"
import { invoiceStatus, invoiceTypes } from "../utils"
import { creditNoteStatus } from "../../credit-notes/utils"
import { debitNoteStatus } from "../../debit-notes/utils"

export const columns: ColumnDef<InvoiceList>[] = [
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
    size: 0
  },
  {
    accessorKey: "number",
    header: "Número",
    cell: ({ row }) => {
      const type = invoiceTypes[row.original.type as keyof typeof invoiceTypes]
      return <div className="gap-2 flex items-center">
        <Badge className="px-1" variant="outline">{type?.label}</Badge>
        <span className="font-medium">
          {row.original.number}
        </span>
      </div>
    }
  },
  {
    accessorKey: "customer",
    header: "Cliente",
    cell: ({ row }) => <div>{row.getValue("customer")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      let status

      if (row.original.type === 'invoice') {
        status = invoiceStatus[row.getValue("status") === "posted" && new Date(row.original.due_date) < new Date() ? "overdue" : row.getValue("status") as keyof typeof invoiceStatus];
      }
      if (row.original.type === 'credit_note') {
        status = creditNoteStatus[row.getValue("status") as keyof typeof creditNoteStatus];
      }
      if (row.original.type === 'debit_note') {
        status = debitNoteStatus[row.getValue("status") === "posted" && new Date(row.original.due_date) < new Date() ? "overdue" : row.getValue("status") as keyof typeof debitNoteStatus];
      }

      return (
        <Badge
          variant="custom"
          className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
        >
          {status?.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "due_date",
    header: "Fecha de vencimiento",
    cell: ({ row }) => {
      return <div>
        {format(new Date(row.getValue("due_date")), "dd MMM yyyy", { locale: es })}
      </div>
    }
  },
  {
    accessorKey: "amount_total",
    header: () => <div className="text-right pr-4">Total</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium pr-4">
        {row.original.currency}{" "}
        {row.original.amount_total}
      </div>
    },
  },
]