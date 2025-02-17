"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Procedure } from "../schema/procedure"

export const columns: ColumnDef<Procedure>[] = [
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
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div>{row.original.code}</div>
      </div>
    ),
    size: 100
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    size: 200
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => <div>{row.original.category}</div>,
    size: 150,
  },
  {
    accessorKey: "materials",
    header: "Materiales",
    cell: ({ row }) => <div>{row.original.materials.map(material => material.name).join(", ")}</div>,
    minSize: 300,
  },
]