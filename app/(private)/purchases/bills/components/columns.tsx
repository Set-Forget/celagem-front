"use client"

import {
  ColumnDef,
  Row
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { BillList } from "../schemas/bills"
import { billStatus, billTypes } from "../utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { creditNoteStatus } from "@/app/(private)/credit-notes/utils"
import { debitNoteStatus } from "@/app/(private)/debit-notes/utils"

const PercentagePaidCell = ({ row }: { row: Row<BillList> }) => {
  const percentagePaid = row.original.percentage_paid

  const creditNote = row.original.type === 'credit_note'

  if (creditNote) return
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Progress className="w-[200px]" value={percentagePaid} />
        </TooltipTrigger>
        <TooltipContent>
          {percentagePaid.toFixed()}%
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
};

export const columns: ColumnDef<BillList>[] = [
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
      let status

      if (row.original.type === 'invoice') {
        status = billStatus[row.getValue("status") === "posted" && new Date(row.original.due_date) < new Date() ? "overdue" : row.getValue("status") as keyof typeof billStatus];
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
    accessorKey: "percentage_paid",
    header: "Porcentaje saldado",
    cell: ({ row }) => <PercentagePaidCell row={row} />,
  },
  {
    accessorKey: "due_date",
    header: "Fecha de vencimiento",
    cell: ({ row }) => {
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
  }
]