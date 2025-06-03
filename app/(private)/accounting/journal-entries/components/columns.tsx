"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { JournalEntryList } from "../schemas/journal-entries"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { journalEntryStatus } from "../utils"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<JournalEntryList>[] = [
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
    accessorKey: "sequence_id",
    header: "Número",
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div className="font-medium">{row.getValue("sequence_id")}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = journalEntryStatus[row.getValue("status") as keyof typeof journalEntryStatus];
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
    header: "Fecha de creación",
    cell: ({ row }) => {
      return <div>{format(parseISO(row.getValue("date")), "dd MMM yyyy", { locale: es })}</div>
    },
  },
  {
    accessorKey: "amount_total",
    header: () => <div>Importe</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount_total"))
      const currency = row.original.currency.name

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        currencyDisplay: "code",
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
]