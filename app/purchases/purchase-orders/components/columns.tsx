"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  ColumnDef,
  Row
} from "@tanstack/react-table"
import { format } from "date-fns"
import { PURCHASE_ORDER_STATUS } from "../adapters/customers"
import { PurchaseOrderList } from "../schemas/purchase-orders"

const PercentageReceivedCell = ({ row }: { row: Row<PurchaseOrderList> }) => {
  const percentageReceived = row.original.order_lines.reduce((acc, line) => {
    return acc + (line.qty_received / line.product_qty)
  }, 0) / row.original.order_lines.length * 100

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Progress value={percentageReceived} />
        </TooltipTrigger>
        <TooltipContent>
          {percentageReceived.toFixed()}%
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
};

export const columns: ColumnDef<PurchaseOrderList>[] = [
  {
    accessorKey: "number",
    header: "Número",
    cell: ({ row }) => <div className="font-medium">{row.original.number}</div>,
  },
  {
    accessorKey: "supplier.name",
    header: "Proveedor",
    cell: ({ row }) => <div>{row.original.supplier.name}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = PURCHASE_ORDER_STATUS[row.getValue("status") as keyof typeof PURCHASE_ORDER_STATUS]
      return <Badge
        variant="outline"
        className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm !shadow-lg ${status.shadow_color}`)}
      >
        {status.label}
      </Badge>
    },
  },
  {
    accessorKey: "percentage_received",
    header: "Porcentaje recibido",
    cell: ({ row }) => <PercentageReceivedCell row={row} />,
  },
  {
    accessorKey: "amount_total",
    header: "Total",
    cell: ({ row }) => <div className="font-medium">
      {row.original.currency.name}{" "}
      {row.original.amount_total}
    </div>,
  },
  {
    accessorKey: "required_date",
    header: "Fecha de requerimiento",
    cell: ({ row }) => <div>
      {format(new Date(row.original.required_date), "dd MMM yyyy")}
    </div>,
  },
]