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
import { PurchaseOrder } from "../schemas/purchase-orders"

const PercentageReceivedCell = ({ row }: { row: Row<PurchaseOrder> }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Progress value={row.getValue("percentage_received")} />
        </TooltipTrigger>
        <TooltipContent>
          {row.getValue("percentage_received")}%
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
};

export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "supplier_name",
    header: "Proveedor",
    cell: ({ row }) => <div>{row.getValue("supplier_name")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = PURCHASE_ORDER_STATUS[row.getValue("status") as keyof typeof PURCHASE_ORDER_STATUS]
      return <Badge
        variant="outline"
        className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm`)}
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
    accessorKey: "price",
    header: "Precio total",
    cell: ({ row }) => <div className="font-medium">
      ARS {row.getValue("price")}
    </div>,
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
    cell: ({ row }) => <div>
      {format(new Date(row.getValue("created_at")), "dd MMM yyyy")}
    </div>,
  },
  /* {
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
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/purchases/purchase-orders/${row.original.id}`}>
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              generatePurchaseOrderPDF()
            }}>
              Descargar PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }, */
]