"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { RECEIPT_MODE_ADAPTER } from "../adapters/receipts"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "transaction_id",
    header: "ID de transacción",
    cell: ({ row }) => <div className="font-medium">{row.getValue("transaction_id")}</div>,
  },
  {
    accessorKey: "receipt_mode",
    header: "Modo de cobro",
    cell: ({ row }) => {
      return <div>{RECEIPT_MODE_ADAPTER[row.getValue("receipt_mode") as keyof typeof RECEIPT_MODE_ADAPTER]}</div>
    },
  },
  {
    accessorKey: "receipt_date",
    header: "Fecha de cobro",
    cell: ({ row }) => <div>
      {format(new Date(row.getValue("receipt_date")), "dd MMM yyyy")}
    </div>,
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => <div className="font-medium">ARS {row.getValue("amount")}</div>,
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
              <Link href={`/banking/receipts/${row.original.id}`}>
                Ver detalles
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]