"use client"

import {
  ColumnDef,
  Row
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { creditNoteStatus } from "../../../[scope]/credit-notes/utils"
import { InvoiceList } from "../schemas/invoices"
import { invoiceStatus, invoiceTypes } from "../utils"

const PercentagePaidCell = ({ row }: { row: Row<InvoiceList> }) => {
  const percentagePaid = row.original.percentage_paid

  const creditNote = row.original.type === 'credit_note'

  if (creditNote) return
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Progress className="w-[100px]" value={percentagePaid} />
        </TooltipTrigger>
        <TooltipContent>
          {percentagePaid.toFixed()}%
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
};

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
        <span className="font-medium text-nowrap">
          {row.original.number}
        </span>
      </div>
    }
  },
  {
    accessorKey: "customer",
    header: "Cliente",
    cell: ({ row }) => <div className="text-nowrap">{row.getValue("customer")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.type === "credit_note" ?
        creditNoteStatus[row.original.status as keyof typeof creditNoteStatus] :
        invoiceStatus[row.original.status]
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
        {format(parseISO(row.getValue("due_date")), "dd MMM yyyy", { locale: es })}
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
  /*   {
      accessorKey: "percentage_paid",
      header: "Porcentaje saldado",
      cell: ({ row }) => <PercentagePaidCell row={row} />,
    }, */
]