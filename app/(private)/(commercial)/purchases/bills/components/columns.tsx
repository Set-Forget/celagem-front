"use client"

import {
  ColumnDef,
  Row
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AdaptedBillList } from "@/lib/adapters/bills"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { billStatus, billTypes } from "../utils"
import { creditNoteStatus } from "@/app/(private)/(commercial)/[scope]/credit-notes/utils"

export const columns: ColumnDef<AdaptedBillList>[] = [
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
      const type = billTypes[row.original.type as keyof typeof billTypes]
      return <div className="gap-2 flex items-center">
        <Badge className="px-1" variant="outline">{type?.label}</Badge>
        <span className="font-medium text-nowrap">
          {row.original.number}
        </span>
      </div>
    }
  },
  {
    accessorKey: "supplier",
    header: "Proveedor",
    cell: ({ row }) => <div className="text-nowrap">{row.getValue("supplier")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.type === "credit_note" ?
        creditNoteStatus[row.original.status as keyof typeof creditNoteStatus] :
        billStatus[row.original.status]
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
      if (row.original.type === 'credit_note') return
      return <div className="text-nowrap">
        {format(parseISO(row.getValue("due_date")), "PP", { locale: es })}
      </div>
    }
  },
  {
    accessorKey: "amount_total",
    header: () => <div className="text-right pr-4">Total</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium pr-4 text-nowrap">
        {row.original.currency.name}{" "}
        {row.original.amount_total}
      </div>
    },
  },
  {
    accessorKey: "amount_residual",
    header: () => <div className="text-right pr-4">Saldo</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium pr-4 text-nowrap">
        {row.original.currency.name}{" "}
        {row.original.amount_residual}
      </div>
    },
  },
]