"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Contact } from "../../schemas/customers"

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div>
        {row.getValue("name")} {row.original.last_name}
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
    cell: ({ row }) => {
      return (
        <></>
      )
    },
  },
]