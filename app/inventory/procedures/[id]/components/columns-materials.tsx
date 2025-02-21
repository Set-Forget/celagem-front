"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Materials } from "@/app/inventory/materials/schema/materials"

export const columnsMaterials: ColumnDef<Materials>[] = [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <div>
        {row.getValue("code")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <></>
      )
    },
  },
]