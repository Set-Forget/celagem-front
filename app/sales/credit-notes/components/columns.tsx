"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

export type CreditNote = {
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

export const columns: ColumnDef<CreditNote>[] = [
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
    accessorKey: "issue_date",
    header: "Fecha de emisión",
    cell: ({ row }) => {
      const formattedDate = new Date(row.getValue("issue_date")).toLocaleDateString("es-AR")
      return <div>{formattedDate}</div>
    },
  },
  {
    accessorKey: "amount",
    header: () => <div>Importe</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const currency = row.original.currency

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        currencyDisplay: "code",
      }).format(amount)

      return <div className="font-medium">-{formatted}</div>
    },
  },
]