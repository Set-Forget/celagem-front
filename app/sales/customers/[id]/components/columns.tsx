"use client"

import { Contact } from "@/app/sales/customers/schemas/customers"
import {
  ColumnDef
} from "@tanstack/react-table"

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div>
        {row.getValue("name")} {row.original.name}
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