"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Supplier } from "../../schema/suppliers"

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div>
        {row.getValue("name")} {row.original.contact_name}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>
    },
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