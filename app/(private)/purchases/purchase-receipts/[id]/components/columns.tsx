"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { PurchaseReceiptItem } from "../../schemas/purchase-receipts"

export const columns: ColumnDef<PurchaseReceiptItem>[] = [
  {
    accessorKey: "display_name",
    header: "Material",
    size: 300,
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("display_name")}
      </div>
    ),
  },
  {
    accessorKey: "product_uom",
    header: "Unidad de medida",
    cell: ({ row }) => {
      return <div>{row.getValue("product_uom")}</div>
    },
  },
  {
    accessorKey: "quantity",
    header: "Cantidad ordenada",
    cell: ({ row }) => {
      return <div>{row.getValue("quantity")}</div>
    },
  },
  {
    accessorKey: "product_uom_qty",
    header: "Cantidad recibida",
    cell: ({ row }) => {
      return <div>{row.getValue("product_uom_qty")}</div>
    },
  }
]