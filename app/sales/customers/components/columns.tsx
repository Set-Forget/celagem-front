"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { CUSTOMER_TYPE } from "../adapters/customers"
import { Customer } from "../schemas/customers"
import Link from "next/link"

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "company_name",
    header: "Empresa",
    cell: ({ row }) => <div>{row.getValue("company_name")}</div>,
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      return <Badge
        variant="outline"
        className={cn("rounded-sm")}
      >
        {CUSTOMER_TYPE[row.getValue("type") as keyof typeof CUSTOMER_TYPE]}
      </Badge>
    },
  },
  {
    accessorKey: "cuit",
    header: "CUIT",
    cell: ({ row }) => <div>{row.getValue("cuit")}</div>,
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => <div>{row.getValue("address")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          asChild
        >
          <Link
            href={`/sales/customers/${row.original.cuit}`}
          >
            <ChevronRight />
            Ver detalles
          </Link>
        </Button>
      )
    },
  },
]