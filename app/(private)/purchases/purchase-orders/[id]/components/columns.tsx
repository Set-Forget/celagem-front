"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { PurchaseOrderItem } from "../../schemas/purchase-orders"

export const columns: ColumnDef<PurchaseOrderItem & { currency: string }>[] = [
  {
    accessorKey: "product_name",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.getValue("product_name")}
      </span>
    ),
  },
  {
    accessorKey: "product_qty",
    header: "Cantidad solicitada",
    cell: ({ row }) => {
      return <span>{row.getValue("product_qty")}</span>
    },
  },
  {
    accessorKey: "qty_received",
    header: "Cantidad recibida",
    cell: ({ row }) => {
      return <span>{row.getValue("qty_received")}</span>
    },
  },
  {
    accessorKey: "price_unit",
    header: "Precio unitario",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.currency} {row.original.price_unit.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "taxes",
    header: "Impuestos",
    cell: ({ row }) => {
      return <span>{row.original.taxes[0].name}</span>
    }
  },
  {
    accessorKey: "price_subtotal",
    header: "Subtotal (sin imp.)",
    cell: ({ row }) => <span className="font-medium">{row.original.currency} {row.original.price_subtotal.toFixed(2)}</span>,
  },
]