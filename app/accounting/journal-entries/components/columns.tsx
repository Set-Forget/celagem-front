"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { JournalEntry } from "../schemas/journal-entries"

export const columns: ColumnDef<JournalEntry>[] = [
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
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div className="font-medium">{row.getValue("title")}</div>
      </div>
    ),
  },
  {
    accessorKey: "account",
    header: "Cuenta",
    cell: ({ row }) => <div>{row.getValue("account")}</div>,
  },

  {
    accessorKey: "date",
    header: "Fecha de creación",
    cell: ({ row }) => {
      const formattedDate = new Date(row.getValue("date")).toLocaleDateString("es-AR")
      return <div>{formattedDate}</div>
    },
  },
  {
    accessorKey: "amount",
    header: () => <div>Importe</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const currency = "ARS"

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        currencyDisplay: "code",
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  /*   {
      id: "actions",
      enableHiding: false,
      cell: () => {
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
              <DropdownMenuItem>
                <Link href="/accounting/journal-entries/333">
                  Ver detalles
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    }, */
]