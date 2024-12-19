"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { PurchaseReceipt } from "../schemas/purchase-receipts"
import { generatePurchaseReceiptPDF } from "../templates/purchase-receipt"

export const columns: ColumnDef<PurchaseReceipt>[] = [
  {
    accessorKey: "purchase_order",
    header: "Orden de compra",
    cell: ({ row }) => <div className="font-medium">{row.getValue("purchase_order")}</div>,
  },
  {
    accessorKey: "supplier",
    header: "Proveedor",
    cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
  },
  {
    accessorKey: "received_at",
    header: "Fecha de recepción",
    cell: ({ row }) => <div>
      {format(new Date(row.getValue("received_at")), "dd MMM yyyy")}
    </div>,
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
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/purchases/purchase-receipts/${row.original.id}`}>
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => generatePurchaseReceiptPDF()}>
              Descargar PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]