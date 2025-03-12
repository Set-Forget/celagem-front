"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

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
    accessorKey: "visit_number",
    header: "Número de visita",
    cell: ({ row }) => <div className="font-medium">{row.getValue("visit_number")}</div>,
  },
  {
    accessorKey: "date",
    header: "Fecha de atención",
    cell: ({ row }) => <div>{format(new Date(row.getValue("date")), "dd MMM yyyy hh:mm aa")}</div>,
  },
  {
    accessorKey: "created_by",
    header: "Creada por",
    cell: ({ row }) => <div>{row.getValue("created_by")}</div>,
  },
  {
    accessorKey: "speciality",
    header: "Especialidad",
    cell: ({ row }) => <div>{row.getValue("speciality")}</div>,
  },
  {
    accessorKey: "attention_type",
    header: "Tipo de atención",
    cell: ({ row }) => <div>{row.getValue("attention_type")}</div>,
  },
  {
    accessorKey: "headquarter",
    header: "Sede",
    cell: ({ row }) => <div>{row.getValue("headquarter")}</div>,
  },
]