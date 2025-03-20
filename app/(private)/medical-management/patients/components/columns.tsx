"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { PatientList } from "../schema/patients"

export const columns: ColumnDef<PatientList>[] = [
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
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div>{row.original.first_name + " " + row.original.first_last_name}</div>,
  },
  {
    accessorKey: "document_type",
    header: "Tipo de documento",
    cell: ({ row }) => <div>{row.getValue("document_type")}</div>,
  },
  {
    accessorKey: "document_number",
    header: "Número de documento",
    cell: ({ row }) => <div className="font-medium">{row.getValue("document_number")}</div>,
  },
  {
    accessorKey: "phone_number",
    header: "Teléfono",
    cell: ({ row }) => <div>{row.getValue("phone_number")}</div>,
  },
]