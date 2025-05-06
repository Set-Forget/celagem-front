"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { PatientList } from "../schema/patients"
import { documentTypes } from "../utils"

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
    cell: ({ row }) => <div className="font-medium">{row.original.first_name + " " + row.original.first_last_name}</div>,
  },
  {
    accessorKey: "class",
    header: "Clase",
    cell: ({ row }) => <div className="font-medium">{row.original.class.name}</div>,
  },
  {
    accessorKey: "document_type",
    header: "Documento",
    cell: ({ row }) => <div>
      <span className="font-medium">{documentTypes.find((d) => d.value === row.getValue("document_type"))?.short || ""}{" "}</span>
      {row.original.document_number}
    </div>,
  },
  {
    accessorKey: "phone_number",
    header: "Teléfono",
    cell: ({ row }) => <div>{row.getValue("phone_number")}</div>,
  },
]