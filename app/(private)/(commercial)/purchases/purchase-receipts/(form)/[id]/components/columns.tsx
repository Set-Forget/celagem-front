"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { PurchaseReceiptItem } from "../../../schemas/purchase-receipts"

export const columns: ColumnDef<PurchaseReceiptItem>[] = [
  {
    accessorKey: "display_name",
    header: "Producto / Servicio",
    size: 300,
    cell: ({ row }) => (
      <div className="font-medium text-nowrap">
        {row.getValue("display_name")}
      </div>
    ),
  },
  {
    accessorKey: "product_uom",
    header: "Unidad de medida",
    cell: ({ row }) => {
      return <div>{row.original.product_uom.name}</div>
    },
  },
  {
    accessorKey: "quantity",
    header: "Cantidad recibida",
    cell: ({ row }) => {
      return <div>{row.getValue("quantity")}</div>
    },
  }
]