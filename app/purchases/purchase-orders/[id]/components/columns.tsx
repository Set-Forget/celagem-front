"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { PurchaseOrderItem } from "../../schemas/purchase-orders"

export const columns: ColumnDef<PurchaseOrderItem>[] = [
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
    accessorKey: "requested_quantity",
    header: "Cantidad solicitada",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("requested_quantity")}</div>
    },
  },
  {
    accessorKey: "received_quantity",
    header: "Cantidad recibida",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("received_quantity")}</div>
    },
  },
  {
    accessorKey: "price",
    header: "Subtotal",
    cell: ({ row }) => <div className="font-medium">ARS {row.getValue("price")}</div>,
  },
]