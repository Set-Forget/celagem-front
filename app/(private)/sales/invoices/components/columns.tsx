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
import { invoiceStatus } from "../utils"

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
    cell: ({ row }) => <div className="font-medium">{row.original.number}</div>
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
      const status = invoiceStatus[
        row.getValue("status") === "posted" && new Date(row.original.due_date) < new Date()
          ? "overdue"
          : row.getValue("status") as keyof typeof invoiceStatus
      ];

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
    accessorKey: "date",
    header: "Fecha de emisión",
    cell: ({ row }) => {
      return <div>
        {format(new Date(row.getValue("date")), "dd MMM yyyy", { locale: es })}
      </div>
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