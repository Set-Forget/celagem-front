"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { PURCHASE_REQUEST_STATUS } from "../adapters/customers"
import { PurchaseRequest } from "../schemas/purchase-requests"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

export const columns: ColumnDef<PurchaseRequest>[] = [
  {
    accessorKey: "title",
    header: "Titulo",
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = PURCHASE_REQUEST_STATUS[row.getValue("status") as keyof typeof PURCHASE_REQUEST_STATUS]
      return <Badge
        variant="outline"
        className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm`)}
      >
        {status.label}
      </Badge>
    },
  },
  {
    accessorKey: "required_by",
    header: "Fecha de requerimiento",
    cell: ({ row }) => <div>
      {format(new Date(row.getValue("required_by")), "dd MMM yyyy")}
    </div>,
  },
  {
    accessorKey: "requested_by",
    header: "Solicitado por",
    cell: ({ row }) => <div>
      {row.getValue("requested_by")}
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
              <Link href={`/purchases/purchase-requests/${row.original.id}`}>
                Ver detalles
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]