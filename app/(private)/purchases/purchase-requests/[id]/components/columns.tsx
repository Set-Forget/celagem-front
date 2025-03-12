"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { PurchaseRequest, PurchaseRequestItems } from "../../schemas/purchase-requests"

export const columns: ColumnDef<PurchaseRequestItems>[] = [
  {
    accessorKey: "item_code",
    header: "Código",
    cell: ({ row }) => (
      <div>
        {row.getValue("item_code")}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      return <div>{row.getValue("quantity")}</div>
    },
  },
  {
    accessorKey: "item_name",
    header: "Nombre",
    cell: ({ row }) => {
      return <div>{row.getValue("item_name")}</div>
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