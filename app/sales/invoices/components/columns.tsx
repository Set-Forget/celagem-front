"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { INVOICE_STATUSES } from "../adapters/invoices"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
    header: "Razón social",
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
    header: () => <div className="text-right">Importe</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const currency = row.original.currency

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        currencyDisplay: "code",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]