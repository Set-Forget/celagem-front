"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

export const columns: ColumnDef<any>[] = [
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
    accessorKey: "id_number",
    header: "Número de documento",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id_number")}</div>,
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div>{row.original.name + " " + row.original.lastname}</div>,
  },
  {
    accessorKey: "user_type",
    header: "Tipo de usuario",
    cell: ({ row }) => <div>{row.getValue("user_type")}</div>,
  },
  {
    accessorKey: "coverage_plan",
    header: "Plan de cobertura",
    cell: ({ row }) => <div>{row.getValue("coverage_plan")}</div>,
  },
  {
    accessorKey: "phone_number",
    header: "Teléfono",
    cell: ({ row }) => <div>{row.getValue("phone_number")}</div>,
  },
]