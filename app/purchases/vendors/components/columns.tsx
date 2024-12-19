"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Supplier } from "../schema/suppliers"

export const columns: ColumnDef<Supplier>[] = [
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
    accessorKey: "supplier_name",
    header: "Proveedor",
    cell: ({ row }) => <div className="font-medium">{row.getValue("supplier_name")}</div>,
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
        <></>
      )
    },
  },
]